import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    Box,
    IconButton,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import JoditEditor from 'jodit-react';

type EditSub = { mainIndex: number; subIndex: number } | null;
type PendingSub = any | null;

type Props = {
    editSub: EditSub;
    pendingSub: PendingSub;
    setEditSub: (v: EditSub) => void;
    setPendingSub: (v: PendingSub) => void;
    headings: any[];
    joditConfig: any;
    updateSubHeadingTitle: (m: number, s: number, v: string) => void;
    updateSubHeadingSummary: (m: number, s: number, v: string) => void;
    setSubHeadingMode: (m: number, s: number, v: string) => void;
    setVideoUrl: (m: number, s: number, v: string) => void;
    setEditorContent: (m: number, s: number, v: string) => void;
    setVideoMeta: (m: number, s: number, field: string, v: string) => void;
    uploadFiles: (m: number, s: number, files: File[]) => void;
    addQuiz: (m: number, s: number, openEditor?: boolean) => void;
    deleteQuiz: (m: number, s: number, qi: number) => void;
    setQuizEdit: (v: any) => void;
    savePendingSub: () => void;
    saveEditedSub: () => void;
    // applyEditorContent is called to update parent headings state with editor value
    applyEditorContent?: (m: number, s: number, content: string) => void;
};

export default function SubTopicDialog(props: Props) {
    const {
        editSub,
        pendingSub,
        setEditSub,
        setPendingSub,
        headings,
        joditConfig,
        updateSubHeadingTitle,
        updateSubHeadingSummary,
        setSubHeadingMode,
        setVideoUrl,
        setEditorContent,
        setVideoMeta,
        uploadFiles,
        addQuiz,
        deleteQuiz,
        setQuizEdit,
        savePendingSub,
        saveEditedSub,
    } = props;

    const open = !!editSub || !!pendingSub;
    if (!open) return null;
    console.log({headings})
    const isPending = !!pendingSub;
    const sub = isPending ? pendingSub!.sub : headings[editSub!.mainIndex]?.course_contents?.[editSub!.subIndex];
    const m = isPending ? pendingSub!.mainIndex : editSub!.mainIndex;
    const s = isPending ? undefined : editSub!.subIndex;
    console.log('SubTopicDialog render', { open, isPending, sub });
    // adjust dialog size when editor mode is active
    const dialogMaxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = sub?.mode === 'editor' ? 'md' : 'sm';
    const [durationError, setDurationError] = useState(false);
    
    // local editor state for edit mode to avoid parent re-renders causing caret jumps
    // const [localEditorContent, setLocalEditorContent] = useState<string>('');

    // initialize local editor content when editing an existing sub
    // useEffect(() => {
    //     if (!open) return;
    //     if (isPending) {
    //         setLocalEditorContent(pendingSub?.sub?.editorContent ?? '');
    //     } else if (editSub) {
    //         const existing = headings[editSub.mainIndex]?.course_contents?.[editSub.subIndex];
    //         console.log('Initializing local editor content for edit mode', existing);
    //         setLocalEditorContent(existing?.editorContent ?? '');
    //     }
    // }, [open, isPending, editSub, pendingSub, headings]);

    const onChangeTitle = (v: string) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, title: v } } : p));
        } else {
            updateSubHeadingTitle(m, s as number, v);
        }
    };

    const onChangeSummary = (v: string) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, summary: v } } : p));
        } else {
            updateSubHeadingSummary(m, s as number, v);
        }
    }

    const onChangeMode = (v: string) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, mode: v } } : p));
        } else {
            setSubHeadingMode(m, s as number, v);
        }
    };

    const onChangeVideoUrl = (v: string) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, videoUrl: v } } : p));
        } else {
            setVideoUrl(m, s as number, v);
        }
    };

    const handleChangeHMS = (field: string, v: any) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, [field]: v } } : p));
        } else {
            setVideoMeta(m, s as number, field, String(v));
        }
        // clear duration error once user edits a duration field
        setDurationError(false);
    };

    const onUploadFiles = (files: File[]) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, files } } : p));
        } else {
            uploadFiles(m, s as number, files);
        }
    };

    const onChangeEditorContent = (v: string) => {
        if (isPending) {
            setPendingSub((p) => (p ? { ...p, sub: { ...p.sub, editorContent: v } } : p));
        } else {
            // update only local editor buffer to avoid parent-side rerenders (caret jump)
            setEditorContent(m, s as number,v);
        }
    }
    return (
        <Dialog fullWidth maxWidth={dialogMaxWidth} open={open} onClose={() => { setEditSub(null); setPendingSub(null); }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    {isPending
                        ? `Add ${pendingSub!.sub.type}`
                        : `Edit SubTopic — ${editSub!.mainIndex + 1}.${editSub!.subIndex + 1} ${(headings[editSub!.mainIndex]?.course_contents[editSub!.subIndex]?.title) || ''}`}
                </Typography>
                <IconButton onClick={() => { setEditSub(null); setPendingSub(null); }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label={`${sub?.type?sub.type+' title':'Title'}`}
                        value={sub.title}
                        onChange={(e) => onChangeTitle(e.target.value)}
                        size="small"
                        fullWidth
                    />

                    <TextField
                        multiline
                        label="Summary"
                        type="text"
                        rows={3}
                        value={sub.summary}
                        onChange={(e) => onChangeSummary(e.target.value)}
                        size="small"
                        fullWidth
                    />

                    {sub.mode != 'course_quizzes' && isPending && (
                        <FormControl>
                            <FormLabel>Content Type</FormLabel>
                            <RadioGroup row value={sub.mode || 'resources'} onChange={(e) => onChangeMode(e.target.value)}>
                                <FormControlLabel value="resources" control={<Radio />} label="Resources" />
                                <FormControlLabel value="editor" control={<Radio />} label="Editor" />
                            </RadioGroup>
                        </FormControl>
                    )}

                    {sub.mode === 'resources' && (
                        <>
                            <TextField
                                label="Video URL"
                                value={sub.url}
                                onChange={(e) => onChangeVideoUrl(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            {(sub.videoUrl || sub.url) && <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    // select
                                    type="number"
                                    label="Hours"
                                    value={sub.hours}
                                    onChange={(e) => handleChangeHMS('hours', e.target.value)}
                                    size="small"
                                    error={durationError && !!sub.videoUrl}
                                    helperText={durationError && !!sub.videoUrl ? 'Hours / minutes / seconds required when Video URL is set' : ''}
                                >
                                    {/* {[...Array(13).keys()].map((h) => (
                                        <MenuItem key={`hour-${h}`} value={h}>
                                            {String(h).padStart(2, '0')}
                                        </MenuItem>
                                    ))} */}
                                </TextField>

                                <TextField
                                    // select
                                    type="number"
                                    label="Minutes"
                                    value={sub.minutes}
                                    onChange={(e) => handleChangeHMS('minutes', e.target.value)}
                                    size="small"
                                    error={durationError && !!sub.videoUrl}
                                >
                                    {/* {[...Array(61).keys()].map((m) => (
                                        <MenuItem key={`min-${m}`} value={m}>
                                            {String(m).padStart(2, '0')}
                                        </MenuItem>
                                    ))} */}
                                </TextField>

                                <TextField
                                    // select
                                    type="number"
                                    label="Seconds"
                                    value={sub.seconds}
                                    onChange={(e) => handleChangeHMS('seconds', e.target.value)}
                                    size="small"
                                    error={durationError && !!sub.videoUrl}
                                >
                                    {/* {[...Array(61).keys()].map((s) => (
                                        <MenuItem key={`sec-${s}`} value={s}>
                                            {String(s).padStart(2, '0')}
                                        </MenuItem>
                                    ))} */}
                                </TextField>
                            </Box>}
                            <Box sx={{ mt: 1 }}>
                                <Button variant="contained" component="label" startIcon={<AddIcon />}>
                                    Upload PDF/PPT
                                    <input type="file" hidden onChange={(e) => onUploadFiles(Array.from(e.target.files || []))} />
                                </Button> 
                                {sub?.file?.url &&  <a href={sub.file.url} target='_blank'> Uploaded Document</a>}
                            </Box>
                        </>
                    )}

                    {sub.mode === 'course_quizzes' && (
                        <>
                            {!isPending && <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => {
                                    // if (isPending) {
                                    //     setPendingSub((p) => p ? { ...p, sub: { ...p.sub, course_quizzes: [...(p.sub.course_quizzes || []), { id: `quiz-${Date.now()}`, question: '', explanation: '', options: ['', '', '', ''], correctAnswer: 0 }] } } : p);
                                    // } else {
                                        addQuiz(m, s as number, true);
                                    // }
                                }}>
                                    Add Question
                                </Button>
                            </Box>}

                            {(sub.course_quizzes || []).map((quiz: any, qi: number) => (
                                <Box key={quiz.id} sx={{ mt: 2, p: 1, backgroundColor: '#fff', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ flex: 1 }} onClick={() => setQuizEdit({ mainIndex: m, subIndex: isPending ? (sub.course_quizzes.length - 1) : s as number, quizIndex: qi })}>
                                        <Typography sx={{ fontWeight: 500 }}>
                                            {quiz.question ? <span dangerouslySetInnerHTML={{ __html: `${qi + 1}. ${quiz.question}` }} /> : `Question ${qi + 1}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" onClick={() => setQuizEdit({ mainIndex: m, subIndex: isPending ? (sub.course_quizzes.length - 1) : s as number, quizIndex: qi })}>Edit</Button>
                                        {quiz.id && <Button color="error" size="small" onClick={() => {
                                            if (isPending) {
                                                setPendingSub((p) => p ? { ...p, sub: { ...p.sub, course_quizzes: p.sub.course_quizzes.filter((_: any, i: number) => i !== qi) } } : p);
                                            } else {
                                                deleteQuiz(m, s as number, qi);
                                            }
                                        }}>Delete</Button>}
                                    </Box>
                                </Box>
                            ))}
                        </>
                    )}

                    {sub.mode === 'editor' && (
                        <JoditEditor
                            value={sub.content || ''}
                            config={joditConfig.current}
                            onChange={(val: string) => onChangeEditorContent(val)}
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                {isPending ? (
                    <>
                        <Button onClick={() => setPendingSub(null)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                // title required
                                if (!sub.title || String(sub.title).trim() === '') {
                                    alert('Title is required.');
                                    return;
                                }

                                // validate duration when video URL is set
                                if (sub.videoUrl) {
                                    console.log('err',sub)
                                    if (sub.hours === undefined || sub.hours === '0' || sub.minutes === undefined || sub.minutes === '0' || sub.seconds === undefined || sub.seconds === '0') {
                                        console.log('set err')
                                        setDurationError(true);
                                        return;
                                    }
                                }

                                // if editor mode ensure editor content present
                                if (sub.mode === 'editor') {
                                    const content = sub.editorContent ?? '';
                                    if (!content || String(content).trim() === '') {
                                        alert('Content is required for editor mode.');
                                        return;
                                    }
                                }

                                savePendingSub();
                            }}
                        >
                            Save
                        </Button>
                    </>
                ) : editSub ? (
                    <>
                        <Button onClick={() => setEditSub(null)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                // title required
                                if (!sub.title || String(sub.title).trim() === '') {
                                    alert('Title is required.');
                                    return;
                                }

                                // validate duration when video URL is set
                                if (sub.videoUrl) {
                                    if (sub.hours === undefined || sub.hours === '0' || sub.minutes === undefined || sub.minutes === '0' || sub.seconds === undefined || sub.seconds === '0') {
                                        setDurationError(true);
                                        return;
                                    }
                                }

                                // editor content validation: use localEditorContent
                                // if (sub.mode === 'editor') {
                                //     if (!sub.editorContent || String(localEditorContent).trim() === '') {
                                //         alert('Content is required for editor mode.');
                                //         return;
                                //     }
                                //     // apply editor content to parent before saving (if callback provided)
                                //     if (props.applyEditorContent && typeof props.applyEditorContent === 'function') {
                                //         props.applyEditorContent(m, s as number, localEditorContent);
                                //     }
                                // }

                                saveEditedSub();
                            }}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => { setEditSub(null); setPendingSub(null); }}>Close</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}