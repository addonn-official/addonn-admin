import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    FormLabel,
    TextField,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import JoditEditor from 'jodit-react';

type QuizEdit = { mainIndex: number; subIndex: number; quizIndex: number } | null;

type Props = {
    quizEdit: QuizEdit;
    setQuizEdit: (v: QuizEdit) => void;
    headings: any[];
    updateQuizQuestion: (m: number, s: number, qi: number, value: string) => void;
    // update a single option text
    updateQuizOption?: (m: number, s: number, qi: number, optionIndex: number, value: string) => void;
    addQuizOption: (m: number, s: number, qi: number) => void;
    removeQuizOption: (m: number, s: number, qi: number, optionIndex: number) => void;
    setQuizExplanation: (m: number, s: number, qi: number, value: string) => void;
    setQuizCorrectAnswer: (m: number, s: number, qi: number, optionIndex: number) => void;
    joditConfig: any;
    saveQuiz: (m: number, s: number, qi: number) => void;
};

export default function QuizEditDialog({
    quizEdit,
    setQuizEdit,
    headings,
    updateQuizQuestion,
    updateQuizOption,
    addQuizOption,
    removeQuizOption,
    setQuizExplanation,
    setQuizCorrectAnswer,
    joditConfig,
    saveQuiz
}: Props) {

    if (!quizEdit) return null;
    const q = headings?.[quizEdit.mainIndex]?.course_contents?.[quizEdit.subIndex]?.course_quizzes?.[quizEdit.quizIndex];
    // console.log('Editing quiz:', q);
    if (!q) return null;
    const m = quizEdit.mainIndex;
    const s = quizEdit.subIndex;
    const qi = quizEdit.quizIndex;
    // local editable copy of options to avoid controlled-field issues
    const [localOptions, setLocalOptions] = useState<string[]>(
        Array.isArray(q.options) ? [...q.options] : []
    );

    // keep local options in sync when selected question changes
    useEffect(() => {
        setLocalOptions(Array.isArray(q.options) ? [...q.options] : []);
    }, [q.options, qi, m, s]);

    return (
        <Dialog fullWidth maxWidth="md" open={!!quizEdit} onClose={() => setQuizEdit(null)}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">Edit Question — {`${m + 1}.${s + 1} Question-${qi + 1}`}</Typography>
                    <Typography variant="caption">{headings[m]?.course_contents[s]?.title || headings[m]?.course_contents[s]?.type}</Typography>
                </Box>

                <Box>
                    <IconButton onClick={() => setQuizEdit(null)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormLabel>Question (rich text)</FormLabel>
                    <JoditEditor
                        value={q.question}
                        config={joditConfig.current}
                        onBlur={(val: string) => updateQuizQuestion(m, s, qi, val)}
                    />

                    <Box>
                        <FormLabel>Options</FormLabel>
                        {localOptions.map((opt: string, oi: number) => (
                            <Box key={oi} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label={`Option ${oi + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        console.log('Option change', oi, v);
                                        // update local state immediately so typing is responsive
                                        setLocalOptions((prev) => {
                                            const next = [...prev];
                                            next[oi] = v;
                                            return next;
                                        });

                                        // also notify parent if it supports immediate option updates
                                        if (typeof updateQuizOption === 'function') {
                                            updateQuizOption(m, s, qi, oi, v);
                                        }
                                    }}
                                    size="small"
                                    fullWidth
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        // update local copy immediately
                                        setLocalOptions((prev) => prev.filter((_, i) => i !== oi));
                                        // notify parent
                                        removeQuizOption(m, s, qi, oi);
                                    }}
                                >
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Box sx={{ mt: 1 }}>
                            <Button
                                size="small"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => {
                                    // optimistic local add for immediate typing
                                    setLocalOptions((prev) => [...prev, '']);
                                    addQuizOption(m, s, qi);
                                }}
                            >
                                Add Option
                            </Button>
                        </Box>
                    </Box>

                    <FormLabel>Answer Explanation</FormLabel>
                    <JoditEditor
                        value={q.answer}
                        config={joditConfig.current}
                        onBlur={(val: string) => setQuizExplanation(m, s, qi, val)}
                    />

                    <Box>
                        <FormLabel>Correct Answer</FormLabel>
                        <RadioGroup
                            row
                            value={String(q.correct_option_index ?? 0)}
                            onChange={(e) => setQuizCorrectAnswer(m, s, qi, parseInt(e.target.value, 10))}
                        >
                            {q.options.map((_: string, oi: number) => (
                                <FormControlLabel key={oi} value={String(oi)} control={<Radio />} label={`Option ${oi + 1}`} />
                            ))}
                        </RadioGroup>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => {
                        // if parent wants to persist options and doesn't support updateQuizOption,
                        // parent saveQuiz implementation should read from headings; otherwise we attempted to call updateQuizOption on change.
                        // Call saveQuiz after ensuring any local options have been pushed via updateQuizOption (if available).
                        if (typeof updateQuizOption !== 'function') {
                            // nothing extra we can do here; call save and hope parent reads latest question state
                            saveQuiz(m, s, qi);
                        } else {
                            // ensure all local options are synced
                            localOptions.forEach((opt, oi) => updateQuizOption(m, s, qi, oi, opt));
                            saveQuiz(m, s, qi);
                        }
                    }}
                >
                    Save
                </Button>
                <Button onClick={() => setQuizEdit(null)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}