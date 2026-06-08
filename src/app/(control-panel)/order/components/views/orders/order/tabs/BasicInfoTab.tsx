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
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Order } from '../../../../../api/types';
import { useProducts } from '@/app/(control-panel)/course/api/hooks/products/useProducts';
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

    const orderData = watch(); // Get all form values

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

    const handleAllow = () => {
        // Handle allow certificate
        console.log('Certificate allowed');
    };

    return (
        <Box className="flex flex-col gap-6">
            {/* Key-Value Display Section */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Order Information
                </Typography>

                {/* Name */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Name:
                    </Typography>
                    <Typography variant="body2">{orderData?.name || '-'}</Typography>
                </Box>

                {/* Course */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Course:
                    </Typography>
                    <Typography variant="body2">{orderData?.course_name || '-'}</Typography>
                </Box>

                {/* Enrolled On */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Enrolled on:
                    </Typography>
                    <Typography variant="body2">{orderData?.enrolled_date || '-'}</Typography>
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
                                    orderData?.certificate_status === 'approved'
                                        ? '#e8f5e9'
                                        : orderData?.certificate_status === 'rejected'
                                            ? '#ffebee'
                                            : '#fff3e0',
                                color:
                                    orderData?.certificate_status === 'approved'
                                        ? '#2e7d32'
                                        : orderData?.certificate_status === 'rejected'
                                            ? '#c62828'
                                            : '#e65100'
                            }}
                        >
                            {orderData?.certificate_status || 'pending'}
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
                                    error={!!errors.certificate_status}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRejectOpen}
                            disabled={orderData?.certificate_status === 'rejected'}
                        >
                            Reject with Message
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleAllow}
                            disabled={orderData?.certificate_status === 'approved'}
                        >
                            Allow
                        </Button>
                    </Box>
                </Box>
            </Box>

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
