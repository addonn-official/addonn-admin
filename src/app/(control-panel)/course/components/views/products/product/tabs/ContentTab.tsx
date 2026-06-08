import React, { useState, useRef, useEffect } from 'react';
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
    Card,
    CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuizEditDialog from './QuizEditDialog';
import SubTopicDialog from './SubTopicDialog';
import { useCreateTopic } from '@/app/(control-panel)/course/api/hooks/products/useCreateTopic';
import { useUpdateTopic } from '@/app/(control-panel)/course/api/hooks/products/useUpdateTopic';
import { Topic } from '../../../../../api/types';
import { useTopic } from '../../../../../api/hooks/products/useTopic';
import { useSubTopic } from '../../../../../api/hooks/products/useSubTopic';
import { useCreateSubTopic } from '@/app/(control-panel)/course/api/hooks/products/useCreateSubTopic';
import { useCreateQuestion } from '@/app/(control-panel)/course/api/hooks/products/useCreateQuestion';
import { useUpdateQuestion } from '@/app/(control-panel)/course/api/hooks/products/useUpdateQuestion';
import { useUpdateSubTopic } from '@/app/(control-panel)/course/api/hooks/products/useUpdateSubTopic';
import { useDeleteQuestion } from '../../../../../api/hooks/products/useDeleteQuestion';
import { useDeleteSubTopic } from '@/app/(control-panel)/course/api/hooks/products/useDeleteSubTopic';
import { useDeleteTopic } from '@/app/(control-panel)/course/api/hooks/products/useDeleteTopic';
import { useSnackbar } from 'notistack';
import { sum } from 'lodash';

function ContentTab({ courseTopics, courseId }) {

    const { mutate: createTopic } = useCreateTopic();
    const { mutate: updateTopic } = useUpdateTopic(courseId);
    const { mutate: createSubTopic } = useCreateSubTopic();
    const { mutate: createQuestion } = useCreateQuestion();
    const { mutate: updateQuestion } = useUpdateQuestion();
    const { mutate: updateSubTopic } = useUpdateSubTopic();
    const { mutate: deleteQuestion } = useDeleteQuestion();
    const { mutate: deleteSubTopic } = useDeleteSubTopic();
    const { mutate: deleteTopic } = useDeleteTopic();
    const { enqueueSnackbar } = useSnackbar();
    const [headings, setHeadings] = useState<any[]>([]);
    const [addEditHeadings, setAddEditHeadings] = useState<Topic>(null);
    const [dialogOpenIndex, setDialogOpenIndex] = useState<number | null>(null);
    const [editSub, setEditSub] = useState<{ mainIndex: number; subIndex: number } | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [quizEdit, setQuizEdit] = useState<{ mainIndex: number; subIndex: number; quizIndex: number } | null>(null);
    // pendingSub is used when creating a new sub-heading via dialog (mirrors addMainHeading flow)
    const [pendingSub, setPendingSub] = useState<any | null>(null);

    const topicId = expandedIndex !== null ? headings[expandedIndex]?.id : undefined;
    const topicQuery = useTopic(topicId);
    let { data: topicData, isLoading, isError } = topicQuery

    const [currentSubId, setCurrentSubId] = useState<string | null>(null);
    const subTopicQuery = useSubTopic(currentSubId);
    let { data: subTopicData } = subTopicQuery;

    useEffect(() => {
        console.log('topicData updated:', topicData);
        if (!topicData) return;
        topicData.course_contents.map((c) => {
            c['mode'] = c['category']['slug'] === 'quiz' ? 'course_quizzes' : c.content?.length > 8 ? 'editor' : 'resources';
        })
        const topicIndex = headings.findIndex(x => x.id === topicData.id);
        if (topicIndex !== -1) {
            setHeadings((s) => {
                const copy = [...s];
                copy[topicIndex].course_contents = topicData.course_contents;
                return copy;
            });
        }
    }, [topicData?.id]);

    useEffect(() => {
        console.log('subTopicData updated:', subTopicData);
        if (!subTopicData || !editSub) return
        // if (!subTopicData || !pendingSub) return;
        const { mainIndex, subIndex } = editSub;
        console.log(headings[editSub!.mainIndex].course_contents[editSub!.subIndex])
        subTopicData.mode = subTopicData.category['slug'] === 'quiz' ? 'course_quizzes' : subTopicData.content?.length > 8 ? 'editor' : 'resources';

        subTopicData['course_quizzes']?.map((q: any, i: any) => {
            q.correct_option_index = q.options?.findIndex((opt) => opt?.id == q.correct_course_quiz_option_id);
        });
        subTopicData['course_quizzes']?.map((q: any, i: any) => {
            q.options = q.options?.map((opt: any, j: any) => opt?.['option_text']);
        });

        setHeadings((s) => {
            const copy = [...s];
            copy[mainIndex].course_contents[subIndex] = subTopicData;
            return copy;
        });
        // setPendingSub(null);
    }, [subTopicData]);

    useEffect(() => {
        if (!editSub) return
        // console.log(headings[editSub!.mainIndex].course_contents[editSub!.subIndex])
        setCurrentSubId(headings[editSub!.mainIndex].course_contents[editSub!.subIndex]?.id || null);
    }, [editSub]);

    const joditConfig = useRef({
        readonly: false,
        height: 260,
        toolbarAdaptive: true,
    });

    useEffect(() => {
        setHeadings(courseTopics || []);
    }, [courseTopics]);

    const addMainHeading = () => {
        setDialogOpenIndex(null);
        setAddEditHeadings({ title: '', course_contents: [] } as any);
    };

    const closeMainHeadingDialog = () => {
        setAddEditHeadings(null);
        setDialogOpenIndex(null);
    }

    const saveMainHeading = () => {
        if (!addEditHeadings) return;

        if (dialogOpenIndex !== null) {
            updateTopic({ ...addEditHeadings, ...{ course_id: courseId } });
        } else {
            let newTopic = {
                id: `heading-${Date.now()}`,
                name: addEditHeadings.name,
                course_id: courseId

            }
            createTopic(newTopic);
        }

        closeMainHeadingDialog();
    }

    const deleteMainHeading = (index: number) => {
        if (!window.confirm('Delete this main topic? This action cannot be undone.')) return;
        const deleted_topic_id = headings[index]?.id;
        if (!deleted_topic_id) {
            alert('Unable to delete: topic id missing.');
            return;
        }
        setHeadings((s) => s.filter((_, i) => i !== index));
        
        deleteTopic(
            deleted_topic_id,
            {
                onSuccess: (data) => {
                    console.log('delete topic success', data);
                    enqueueSnackbar(data.message, {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('delete topic failed', err);
                    enqueueSnackbar(`delete topic failed ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
        );
    };

    // Open a dialog to create a sub-heading (similar to addMainHeading flow).
    const addSubHeading = (mainIndex: number, type: string, openEditor = true, openQuizEditor = false) => {
        const sub = {
            id: `sub-${Date.now()}`,
            title: '',
            type,
            mode: type === 'quiz' ? 'course_quizzes' : 'resources',
            videoUrl: '',
            files: [],
            course_quizzes: [],
            hours: '0',
            minutes: '0',
            seconds: '0',
        };
        // setExpandedIndex(mainIndex)
        // setExpandedIndex(null);
        // setExpandedIndex(mainIndex);
        console.log({ mainIndex, sub, topicData });
        // store pending sub and open dialog (dialog open is derived from pendingSub or editSub)
        setPendingSub({ mainIndex, sub, openQuizEditor });
    };

    const savePendingSub = () => {
        if (!pendingSub) return;
        const { mainIndex, sub, openQuizEditor } = pendingSub;
        console.log({ topicData }, sub.type)
        console.log(topicData.categories.find(x => x.slug == sub.type))
        const category_id = topicData.categories.find(x => { console.log(x.slug, sub.type, x.slug == sub.type); return x.slug == sub.type }).id;
        createSubTopic({
            topic_id: topicData.id,
            category_id: category_id,
            title: sub.title,
            content: sub.editorContent,
            hours: sub.hours,
            minutes: sub.minutes,
            seconds: sub.seconds,
            url: sub.videoUrl,
            summary: sub.summary,

        })

        // After adding, optionally add a quiz and open the quiz editor
        if (sub.type === 'Quiz' && openQuizEditor) {
            // schedule because headings update is async
            setTimeout(() => {
                const lastIndex = (headings[mainIndex]?.course_contents?.length || 0); // previous length
                // add quiz to the newly created sub and open quiz editor for it
                addQuiz(mainIndex, lastIndex, true);
            }, 0);
        }

        setPendingSub(null);
    };

    const saveEditedSub = () => {
        if (!editSub) return;
        console.log({headings})
        const sub = headings[editSub.mainIndex]?.course_contents[editSub.subIndex];
        if (!sub || !sub.id) {
            console.error('No sub found to update', { editSub, sub });
            return;
        }
        console.log({ topicData, sub })
        // call mutation to update subtopic on server
        // const category_id = topicData.categories.find(x => { console.log(x.slug, sub.type, x.slug == sub.type); return x.slug == sub.type }).id;

        updateSubTopic(
            {
                id: sub.id,
                topic_id: topicData.id,
                category_id: sub.category_id,
                title: sub.title,
                content: sub.editorContent,
                hours: sub.hours,
                minutes: sub.minutes,
                seconds: sub.seconds,
                url: sub.videoUrl,
                document: sub.files,
                summary: sub.summary,
            },
            {
                onSuccess: () => {
                    // close dialog; optional: show toast / refetch parent topic if needed
                    setEditSub(null);
                    setEditSub(editSub);
                },
                onError: (err) => {
                    console.error('Failed to update subtopic', err);
                    alert('Failed to update subtopic');
                },
            }
        );
    };

    const deleteSubHeading = (mainIndex: number, subIndex: number) => {
        if (!window.confirm('Delete this sub-topic? This action cannot be undone.')) return;
        
        const deleted_subtopic_id = headings[mainIndex]?.course_contents?.[subIndex]?.id;
        if (!deleted_subtopic_id) {
            alert('Unable to delete: subtopic id missing.');
            return;
        }

        setHeadings((s) => {
            const copy = [...s];
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.filter((_, i: number) => i !== subIndex),
            };
            return copy;
        });

        deleteSubTopic(
            deleted_subtopic_id,
            {
                onSuccess: (data) => {
                    console.log('delete Subtopic success', data);
                    enqueueSnackbar(data.message, {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('delete Subtopic failed', err);
                    enqueueSnackbar(`delete Subtopic failed ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
        );
    };

    const updateSubHeadingTitle = (mainIndex: number, subIndex: number, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], title: value };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };
    const updateSubHeadingSummary = (mainIndex: number, subIndex: number, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], summary: value };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };
    
    const setSubHeadingMode = (mainIndex: number, subIndex: number, mode: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], mode };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };

    const uploadFiles = (mainIndex: number, subIndex: number, files: File[]) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], files };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };

    const setVideoUrl = (mainIndex: number, subIndex: number, url: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], videoUrl: url };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };

    const setEditorContent = (mainIndex: number, subIndex: number, data: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], editorContent: data };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };

    const setVideoMeta = (mainIndex: number, subIndex: number, field: string, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const sub = { ...copy[mainIndex].course_contents[subIndex], [field]: value };
            copy[mainIndex] = {
                ...copy[mainIndex],
                course_contents: copy[mainIndex].course_contents.map((sh: any, i: number) => (i === subIndex ? sub : sh)),
            };
            return copy;
        });
    };

    const saveQuiz = (mainIndex: number, subIndex: number, quizIndex: number) => {
        // setQuizEdit(null);
        console.log(headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].id)
        if (headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].id) {
            updateQuestion({
                id: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].id,
                content_id: headings[mainIndex].course_contents[subIndex].id,
                question: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].question,
                answer: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].answer,
                options: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].options,
                correct_option_index: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].correct_option_index,
            },
                {
                    onSuccess: () => {
                        // setPendingQuizSave(null);
                        const contentId = headings[mainIndex].course_contents[subIndex].id;
                        if (!contentId) {
                            console.error('saveQuiz: no content id for sub', { mainIndex, subIndex });
                            return;
                        }

                        setQuizEdit(null);
                    },
                    onError: (err) => {
                        console.error('createQuestion failed', err);
                        // setPendingQuizSave(null);
                    },
                });
        } else {
            createQuestion({
                content_id: headings[mainIndex].course_contents[subIndex].id,
                question: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].question,
                answer: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].answer,
                options: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].options,
                correct_option_index: headings[mainIndex].course_contents[subIndex].course_quizzes[quizIndex].correct_option_index,
            },
                {
                    onSuccess: () => {
                        // setPendingQuizSave(null);
                        const contentId = headings[mainIndex].course_contents[subIndex].id;
                        if (!contentId) {
                            console.error('saveQuiz: no content id for sub', { mainIndex, subIndex });
                            return;
                        }

                        setQuizEdit(null);
                        // setCurrentSubId()
                    },
                    onError: (err) => {
                        console.error('createQuestion failed', err);
                        // setPendingQuizSave(null);
                    },
                });
        }



        // if (callback) callback();
    };

    const addQuiz = (mainIndex: number, subIndex: number, openEditor = false) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = copy[mainIndex].course_contents[subIndex].course_quizzes || [];
            const newQuiz = { question: '', explanation: '', options: ['', '', '', ''], correctAnswer: 0 };
            const updatedQuizzes = [...course_quizzes, newQuiz];
            copy[mainIndex].course_contents[subIndex] = {
                ...copy[mainIndex].course_contents[subIndex],
                course_quizzes: updatedQuizzes,
            };
            setTimeout(() => {
                if (openEditor) {
                    setQuizEdit({ mainIndex, subIndex, quizIndex: updatedQuizzes.length - 1 });
                }
            }, 0);
            return copy;
        });
    };

    const updateQuizQuestion = (mainIndex: number, subIndex: number, quizIndex: number, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], question: value };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const setQuizExplanation = (mainIndex: number, subIndex: number, quizIndex: number, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], answer: value };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const updateQuizOption = (mainIndex: number, subIndex: number, quizIndex: number, optionIndex: number, value: string) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            const options = [...course_quizzes[quizIndex].options];
            options[optionIndex] = value;
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], options };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const addQuizOption = (mainIndex: number, subIndex: number, quizIndex: number) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            const options = [...course_quizzes[quizIndex].options, ''];
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], options };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const removeQuizOption = (mainIndex: number, subIndex: number, quizIndex: number, optionIndex: number) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            const options = course_quizzes[quizIndex].options.filter((_, i: number) => i !== optionIndex);
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], options, correctAnswer: Math.min(course_quizzes[quizIndex].correctAnswer || 0, Math.max(0, options.length - 1)) };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const setQuizCorrectAnswer = (mainIndex: number, subIndex: number, quizIndex: number, optionIndex: number) => {
        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = [...copy[mainIndex].course_contents[subIndex].course_quizzes];
            course_quizzes[quizIndex] = { ...course_quizzes[quizIndex], correct_option_index: optionIndex };
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });
    };

    const deleteQuiz = (mainIndex: number, subIndex: number, quizIndex: number) => {
        if (!window.confirm('Delete this quiz?')) return;

        const deleted_question_id = headings[mainIndex]?.course_contents?.[subIndex]?.course_quizzes?.[quizIndex]?.id;
        if (!deleted_question_id) {
            alert('Unable to delete: question id missing.');
            return;
        }

        setHeadings((s) => {
            const copy = [...s];
            const course_quizzes = copy[mainIndex].course_contents[subIndex].course_quizzes.filter((_, i: number) => i !== quizIndex);
            copy[mainIndex].course_contents[subIndex] = { ...copy[mainIndex].course_contents[subIndex], course_quizzes };
            return copy;
        });

        deleteQuestion(
            deleted_question_id,
            {
                onSuccess: (data) => {
                    console.log('deleteQuestion success', data);
                    enqueueSnackbar(data.message, {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('deleteQuestion failed', err);
                    enqueueSnackbar(`deleteQuestion failed ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
        );
    };

    const handleDragEnd = (result: any) => {
        console.log({result})
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === 'main') {
            const items = Array.from(headings);
            const [removed] = items.splice(source.index, 1);
            items.splice(destination.index, 0, removed);
            setHeadings(items);
            return;
        }

        if (type === 'sub') {
            const sourceMain = parseInt(source.droppableId.split('-')[1], 10);
            const destMain = parseInt(destination.droppableId.split('-')[1], 10);

            const updated = Array.from(headings);

            const sourceList = Array.from(updated[sourceMain].course_contents);
            const [moved] = sourceList.splice(source.index, 1);
            updated[sourceMain] = { ...updated[sourceMain], course_contents: sourceList };

            const destList = Array.from(updated[destMain].course_contents);
            destList.splice(destination.index, 0, moved);
            updated[destMain] = { ...updated[destMain], course_contents: destList };

            setHeadings(updated);
            return;
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addMainHeading} sx={{ borderRadius: 1 }}>
                        Add New Topic
                    </Button>
                </Box>

                <Droppable droppableId="main-headings" type="main" direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ minHeight: 120, display: 'flex', flexDirection: 'column' }}
                        >
                            {headings.map((heading, mainIndex) => (
                                <Draggable key={heading.id} draggableId={String(heading.id)} index={mainIndex}>
                                     {(providedMain, snapshotMain) => (
                                        <Card
                                            ref={providedMain.innerRef}
                                            {...providedMain.draggableProps}
                                            style={{
                                                ...providedMain.draggableProps.style,
                                                boxShadow: snapshotMain.isDragging ? '0 8px 28px rgba(13,38,76,0.12)' : 'none',
                                                borderRadius: 12,
                                            }}
                                            sx={{
                                                backgroundColor: '#fbfdff',
                                                border: '1px solid rgba(34, 34, 49, 0.08)',
                                                overflow: 'visible',
                                                mb: 2,
                                            }}
                                        >
                                             <CardContent sx={{ p: 1.5 }}>

                                                <Box
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', cursor: 'pointer' }}
                                                    onClick={() => setExpandedIndex((prev) => (prev === mainIndex ? null : mainIndex))}
                                                >
                                                    <Box
                                                        {...providedMain.dragHandleProps}
                                                        onClick={(e) => e.stopPropagation()}
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 1,
                                                            bgcolor: 'transparent',
                                                            color: 'grey.600',
                                                            cursor: 'grab',
                                                        }}
                                                    >
                                                        <DragIndicatorIcon />
                                                    </Box>

                                                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
                                                        {`${mainIndex + 1}. `}{heading.name || 'Untitled Topic'}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <IconButton color="primary" size="small" onClick={(e) => { e.stopPropagation(); setDialogOpenIndex(mainIndex); setAddEditHeadings({ ...headings[mainIndex] }); }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); deleteMainHeading(mainIndex); }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex((prev) => (prev === mainIndex ? null : mainIndex)); }}>
                                                            <ExpandMoreIcon sx={{ transform: expandedIndex === mainIndex ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>


                                                <Box
                                                    sx={{ mt: 2, cursor: 'pointer' }}
                                                >
                                                    {/* render sub section only when expanded */}
                                                    {expandedIndex === mainIndex && (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            <Droppable droppableId={`sub-${mainIndex}`} type="sub" isDropDisabled={false}

                                                                isCombineEnabled={false}
                                                                ignoreContainerClipping={false}
                                                                direction="vertical"
                                                            >
                                                                 {(providedSubSummary) => (
                                                                     <div ref={providedSubSummary.innerRef} {...providedSubSummary.droppableProps}>
                                                                         {heading.course_contents?.map((subHeading: any, subIndex: number) => (
                                                                             <Draggable key={subHeading.id} draggableId={subHeading.id} index={subIndex}>
                                                                                {(providedSubItem) => (
                                                                                    <Box
                                                                                        ref={providedSubItem.innerRef}
                                                                                        {...providedSubItem.draggableProps}
                                                                                        {...providedSubItem.dragHandleProps}
                                                                                        sx={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: 2,
                                                                                            bgcolor: '#fff',
                                                                                            border: '1px solid rgba(15,23,42,0.06)',
                                                                                            borderRadius: 2,
                                                                                            p: 1,
                                                                                            px: 2,
                                                                                            mb: 1,
                                                                                        }}
                                                                                    >
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'grey.600' }}>
                                                                                            <DragIndicatorIcon />
                                                                                        </Box>

                                                                                        <Box sx={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); setEditSub({ mainIndex, subIndex }); }}>
                                                                                            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                                                                {`${mainIndex + 1}.${subIndex + 1} `}{subHeading.title || `${subHeading.type} title`}
                                                                                            </Typography>
                                                                                            <Typography variant="body2" color="text.secondary">
                                                                                                {subHeading?.category?.name} | {subHeading.mode === 'course_quizzes' ? `${subHeading.course_quizzes?.length || 0} questions` : (subHeading.url ? 'video' : 'eidtor')}
                                                                                            </Typography>
                                                                                        </Box>

                                                                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                                            <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); setEditSub({ mainIndex, subIndex }); }}>
                                                                                                <EditIcon />
                                                                                            </IconButton>
                                                                                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); deleteSubHeading(mainIndex, subIndex); }}>
                                                                                                <DeleteIcon />
                                                                                            </IconButton>
                                                                                        </Box>
                                                                                    </Box>
                                                                                )}
                                                                            </Draggable>
                                                                         ))}
                                                                         {providedSubSummary.placeholder}
                                                                     </div>
                                                                 )}
                                                            </Droppable>
                                                            <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                                                                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(mainIndex); addSubHeading(mainIndex, 'regular'); }}>
                                                                    Sub Topic
                                                                </Button>
                                                                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(mainIndex); addSubHeading(mainIndex, 'assignment') }}>
                                                                    Assignment
                                                                </Button>
                                                                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(mainIndex); addSubHeading(mainIndex, 'project') }}>
                                                                    Project
                                                                </Button>
                                                                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(mainIndex); addSubHeading(mainIndex, 'practice-problem') }}>
                                                                    Practice Problem
                                                                </Button>
                                                                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(mainIndex); addSubHeading(mainIndex, 'quiz', true, true) }}>
                                                                    Quiz
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                </Box>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Box>

            {/* Main edit dialog (for a main topic and list of subs) */}
            <Dialog fullWidth maxWidth="md" open={addEditHeadings !== null} onClose={closeMainHeadingDialog}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        {dialogOpenIndex !== null ? `Edit Topic — ${dialogOpenIndex + 1}. ${headings[dialogOpenIndex]?.title || 'Untitled'}` : 'Add New Topic'}
                    </Typography>
                    <IconButton onClick={closeMainHeadingDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {addEditHeadings && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    label="Topic title"
                                    value={addEditHeadings.name || ''}
                                    onChange={(e) => setAddEditHeadings((p: any) => ({ ...p, name: e.target.value }))}
                                    size="small"
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeMainHeadingDialog}>Cancel</Button>
                    <Button variant="contained" onClick={saveMainHeading}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* SubTopic dialog moved to separate component */}
            <SubTopicDialog
                editSub={editSub}
                pendingSub={pendingSub}
                setEditSub={setEditSub}
                setPendingSub={setPendingSub}
                headings={headings}
                joditConfig={joditConfig}
                updateSubHeadingTitle={updateSubHeadingTitle}
                updateSubHeadingSummary={updateSubHeadingSummary}
                setSubHeadingMode={setSubHeadingMode}
                setVideoUrl={setVideoUrl}
                setEditorContent={setEditorContent}
                setVideoMeta={setVideoMeta}
                uploadFiles={uploadFiles}
                addQuiz={addQuiz}
                deleteQuiz={deleteQuiz}
                setQuizEdit={setQuizEdit}
                savePendingSub={savePendingSub}
                saveEditedSub={saveEditedSub}
                // apply editor content into headings prior to calling saveEditedSub
                applyEditorContent={(m: number, s: number, content: string) => {
                    setHeadings((prev) => {
                        const copy = [...prev];
                        if (!copy[m]) return prev;
                        const contents = [...(copy[m].course_contents || [])];
                        if (typeof s === 'number' && contents[s]) {
                            contents[s] = { ...contents[s], editorContent: content };
                        }
                        copy[m] = { ...copy[m], course_contents: contents };
                        return copy;
                    });
                }}
            />

            {/* Quiz edit moved to separate component */}
            <QuizEditDialog
                quizEdit={quizEdit}
                setQuizEdit={setQuizEdit}
                headings={headings}
                updateQuizQuestion={updateQuizQuestion}
                updateQuizOption={updateQuizOption}
                addQuizOption={addQuizOption}
                removeQuizOption={removeQuizOption}
                setQuizExplanation={setQuizExplanation}
                setQuizCorrectAnswer={setQuizCorrectAnswer}
                joditConfig={joditConfig}
                saveQuiz={saveQuiz}
            />
        </DragDropContext>
    );
}

export default ContentTab;
