import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Enrollment } from '../../../../../api/types';
import { useProducts } from '@/app/(control-panel)/course/api/hooks/products/useProducts';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { Paper, Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LinearProgress from '@mui/material/LinearProgress';
import {useUpdateCertificate} from '../../../../../api/hooks/enrollments/useUpdateCertificate';
import { useSnackbar } from 'notistack';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
    const methods = useFormContext();
    let { data: courses = [], isLoading, error } = useProducts();
    const { control, formState, watch, getValues } = methods;
    const { errors } = formState;
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectMessage, setRejectMessage] = useState('');
    
    const { mutate: updateCertificate } = useUpdateCertificate();
    const enrollmentData = watch(); // Get all form values
    const { enqueueSnackbar } = useSnackbar();
    // Calculate Overall Score
    const calculateOverallScore = useMemo(() => {
        const quizzes = enrollmentData?.quiz_attempts || [];
        const submissions = enrollmentData?.submissions || [];

        // Sum of quiz percentages
        const quizSum = quizzes.reduce((sum, quiz) => sum + (quiz.percentage || 0), 0);

        // Sum of submission marks
        const submissionSum = submissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);

        // Total count
        const totalCount = quizzes.length + submissions.length;

        // Avoid division by zero
        if (totalCount === 0) {
            return {
                score: 0,
                quizCount: 0,
                submissionCount: 0,
                totalCount: 0,
                formula: 'No data available'
            };
        }

        const score = (quizSum + submissionSum) / totalCount;

        return {
            score: Math.round(score * 100) / 100, // Round to 2 decimal places
            quizCount: quizzes.length,
            submissionCount: submissions.length,
            totalCount,
            quizSum: Math.round(quizSum * 100) / 100,
            submissionSum: Math.round(submissionSum * 100) / 100,
            formula: `(${Math.round(quizSum * 100) / 100} + ${Math.round(submissionSum * 100) / 100}) / ${totalCount}`
        };
    }, [enrollmentData?.quiz_attempts, enrollmentData?.submissions]);

    const getScoreColor = (score) => {
        if (score >= 80) return '#4caf50'; // Green
        if (score >= 60) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    const handleRejectOpen = () => setOpenRejectDialog(true);
    const handleRejectClose = () => {
        setOpenRejectDialog(false);
        setRejectMessage('');
    };
    const handleRejectSubmit = () => {
        // Handle reject with message
        console.log('Reject with message:', rejectMessage);
        handleRejectClose();
    };

    const setCertificateStatus = () => {
        // Handle allow certificate
        const certData = {
            enrollmentId: enrollmentData.id,
            request_status: enrollmentData.certificate_status,
            request_note: '',
            id: enrollmentData.certificate?.id
        };
        updateCertificate(certData,

	{
                onSuccess: (data) => {
                    enqueueSnackbar('Certificate Saved Successfully', {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('Certificate Saved failed', err);
                    enqueueSnackbar(`Something went wrong ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
		);
    };

    // Quiz Attempts Table Columns
    const quizAttemptColumns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'attempt_number',
                header: 'Attempt',
                enableColumnFilter: false,
                size: 80
            },
            {
                accessorKey: 'percentage',
                header: 'Percentage',
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <Typography variant="body2">
                        {row.original.percentage !== null ? `${row.original.percentage}%` : '-'}
                    </Typography>
                )
            },
            {
                accessorKey: 'result',
                header: 'Result',
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <Chip
                        label={row.original.result || 'Pending'}
                        color={row.original.result === 'Pass' ? 'success' : row.original.result === 'Fail' ? 'error' : 'default'}
                        size="small"
                    />
                )
            }
        ],
        []
    );

    // Submissions Table Columns
    const submissionsColumns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'content.title',
                header: 'Content Title',
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <Typography variant="body2">
                        {row.original.content?.title || '-'}
                    </Typography>
                )
            },
            {
                accessorKey: 'type',
                header: 'Type',
                enableColumnFilter: false,
                size: 100
            },
            {
                accessorKey: 'status',
                header: 'Status',
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {row.original.status ? (
                            <FuseSvgIcon className="text-green-500" size={20}>
                                lucide:check-circle
                            </FuseSvgIcon>
                        ) : (
                            <FuseSvgIcon className="text-red-500" size={20}>
                                lucide:x-circle
                            </FuseSvgIcon>
                        )}
                        <Typography variant="body2">{row.original.status ? 'Submitted' : 'Pending'}</Typography>
                    </Box>
                )
            },
            {
                accessorKey: 'marks',
                header: 'Marks (in %)',
                enableColumnFilter: false,
                size: 80
            }
        ],
        []
    );

    return (
        <Box className="flex flex-col gap-6">
            {/* Overall Score Section */}
            {calculateOverallScore.totalCount > 0 && (
                <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Overall Performance
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                        {/* Score Circle */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                border: `4px solid ${getScoreColor(calculateOverallScore.score)}`
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        color: getScoreColor(calculateOverallScore.score)
                                    }}
                                >
                                    {calculateOverallScore.score}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    %
                                </Typography>
                            </Box>
                        </Box>

                        {/* Score Details */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                        Quizzes Attempted:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {calculateOverallScore.quizCount}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                        Submissions:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {calculateOverallScore.submissionCount}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                        Total Items:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {calculateOverallScore.totalCount}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(calculateOverallScore.score, 100)}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getScoreColor(calculateOverallScore.score),
                                            borderRadius: 1
                                        }
                                    }}
                                />
                            </Box>

                            {/* Formula Breakdown */}
                            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 0.5 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    <strong>Formula:</strong> ({calculateOverallScore.quizSum} + {calculateOverallScore.submissionSum}) / {calculateOverallScore.totalCount}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Key-Value Display Section */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Enrollment Information
                </Typography>

                {/* Name */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Name:
                    </Typography>
                    <Typography variant="body2">{enrollmentData?.user?.name || '-'}</Typography>
                </Box>

                {/* Course */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Course:
                    </Typography>
                    <Typography variant="body2">{enrollmentData?.course?.title || '-'}</Typography>
                </Box>

                {/* Enrolled On */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Enrolled on:
                    </Typography>
                    <Typography variant="body2">{enrollmentData?.enrolled_on || '-'}</Typography>
                </Box>

                {/* Certificate Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Certificate Status:
                    </Typography>
                    <Typography variant="body2">
                        <span
                            style={{
                                display: 'inline-block',
                                borderRadius: 4,
                                backgroundColor:
                                    enrollmentData?.certificate_status === 'approved'
                                        ? '#e8f5e9'
                                        : enrollmentData?.certificate_status === 'rejected'
                                            ? '#ffebee'
                                            : '#fff3e0',
                                color:
                                    enrollmentData?.certificate_status === 'approved'
                                        ? '#2e7d32'
                                        : enrollmentData?.certificate_status === 'rejected'
                                            ? '#c62828'
                                            : '#e65100',
                                padding: '4px 8px'
                            }}
                        >
                            {enrollmentData?.certificate_status || 'pending'}
                        </span>
                    </Typography>
                </Box>
            </Box>

            {/* Certificate Status Dropdown & Actions */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Certificate Management
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Status Dropdown */}
                    <Controller
    name="certificate_status"
    control={control}
    render={({ field }) => (
        <FormControl fullWidth size="small">
            <FormLabel htmlFor="certificate_status">Certificate Status</FormLabel>
            <Select
                id="certificate_status"
                {...field}
                value={enrollmentData?.certificate_status || ''}
                error={!!errors.certificate_status}
            >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="requested">Requested</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="downloaded">Downloaded</MenuItem>
            </Select>
        </FormControl>
    )}
/>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        
                        <Button
                            variant="contained"
                            color="success"
                            onClick={setCertificateStatus}
                            // disabled={enrollmentData?.certificate_status === 'approved'}
                        >
                            Sbumit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRejectOpen}
                            // disabled={enrollmentData?.certificate_status === 'rejected'}
                        >
                            Reject with Message
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Quiz Attempts Table */}
            {Array.isArray(enrollmentData?.quiz_attempts) && enrollmentData.quiz_attempts.length > 0 && (
                <Paper className="flex h-full w-full flex-auto flex-col overflow-hidden" elevation={1}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Quiz Attempts
                        </Typography>
                    </Box>
                    <DataTable
                        data={enrollmentData.quiz_attempts}
                        columns={quizAttemptColumns}
                    />
                </Paper>
            )}

            {/* Submissions Table */}
            {Array.isArray(enrollmentData?.submissions) && enrollmentData.submissions.length > 0 && (
                <Paper className="flex h-full w-full flex-auto flex-col overflow-hidden" elevation={1}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Submissions
                        </Typography>
                    </Box>
                    <DataTable
                        data={enrollmentData.submissions}
                        columns={submissionsColumns}
                    />
                </Paper>
            )}

            {/* Reject Dialog */}
            <Dialog open={openRejectDialog} onClose={handleRejectClose} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Certificate</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter rejection reason/message..."
                        value={rejectMessage}
                        onChange={(e) => setRejectMessage(e.target.value)}
                        label="Rejection Message"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectClose}>Cancel</Button>
                    <Button onClick={handleRejectSubmit} variant="contained" color="error">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BasicInfoTab;
