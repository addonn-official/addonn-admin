import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, FormControl, FormLabel, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useOrders } from '../../../api/hooks/orders/useOrders';
import { Order } from '../../../api/types';
import { useDeleteOrders } from '../../../api/hooks/orders/useDeleteOrders';
import { useCreateRefund } from '../../../api/hooks/orders/useCreateRefund';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useSnackbar } from 'notistack';

function OrdersTable() {
    let { data: orders = [], isLoading, error } = useOrders();

    if (error) {
        console.error('An error has occurred while fetching orders:', error.message);
        orders = [];
    }
    const { mutate: deleteOrders } = useDeleteOrders();
    const { mutate: createRefund } = useCreateRefund();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
const [refundDialog, setRefundDialog] = useState<{ order: Order, type: 'full' | 'partial', amount: string, approval?: string, from?: string, admin_note?: string } | null>(null);    const handleOrderDetailsClick = (order: Order) => setSelectedOrder(order);
    const handleRefundStatusClick = (order: Order) => setRefundDialog({ order, type: 'full', amount: order.final_amount });
    const handleManualRefundClick = (order: Order) => setRefundDialog({ order, type: 'full', from: 'manual', amount: order.final_amount });
    const { enqueueSnackbar } = useSnackbar();

    const handleRefundTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!refundDialog) return;
        setRefundDialog({
            ...refundDialog,
            type: e.target.value as 'full' | 'partial',
            amount: e.target.value === 'full' ? refundDialog.order.final_amount : ''
        });
    };

    const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!refundDialog) return;
        setRefundDialog({
            ...refundDialog,
            amount: e.target.value
        });
    };

    const createRefundAction = (from) => {
        // Handle allow certificate
        const data = {
            request_id_type: from === 'manual' ? 'order' : 'refund',
            request_id: from === 'manual' ? refundDialog.order.id : refundDialog.order.refunds[0]?.id,
            type: refundDialog.approval || 'approve',
            refund_type: refundDialog.type,
            amount: refundDialog.type === 'partial' ? Number(refundDialog.amount) : refundDialog.order.final_amount,
            admin_note: refundDialog.admin_note || '',

        };
        createRefund(data,

            {
                onSuccess: (data) => {
                    enqueueSnackbar('Refund Generated Successfully', {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('Refund Generation failed', err);
                    enqueueSnackbar(`Something went wrong ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
        );
    };

    const columns = useMemo<MRT_ColumnDef<Order>[]>(
        () => [
            {
                accessorKey: 'sno',
                header: 'S. No.',
                size: 20,
                Cell: ({ row }) => row.index + 1
            },
            {
                accessorKey: 'customer_details',
                header: 'Customer Details',
                Cell: ({ row }) => (
                    <>
                        {row.original.user?.name}
                        <br />
                        {row.original.user?.email}
                    </>
                )
            },
            {
                accessorKey: 'course_bundle',
                header: 'Course/Bundle',
                Cell: ({ row }) => {
                    const items = row.original.items || [];
                    return (
                        <>
                            {items.map((item: any, idx: number) =>
                                item.course_bundle
                                    ? <div key={idx}>{item.course_bundle.name}</div>
                                    : item.course
                                        ? <div key={idx}>{item.course.name}</div>
                                        : null
                            )}
                        </>
                    );
                }
            },
            {
                accessorKey: 'order_id',
                header: 'Order ID',
                Cell: ({ row }) => row.original.order_id
            },
            {
                accessorKey: 'created_at',
                header: 'Time Stamp',
                Cell: ({ row }) => row.original.created_at
            },
            {
                accessorKey: 'coupon',
                header: 'Coupon',
                Cell: ({ row }) => row.original.coupon?.code || '-'
            },
            {
                accessorKey: 'final_amount',
                header: 'Amount',
                Cell: ({ row }) => row.original.final_amount
            },
            {
                accessorKey: 'payment_status',
                header: 'Payment Status',
                Cell: ({ row }) => row.original.status_label
            },
            {
                accessorKey: 'refund_status',
                header: 'Refund Status',
                Cell: ({ row }) => (
                    row.original.refunds[row.original.refunds?.length - 1]?.status == 'requested' ? <Button
                        size="small"
                        color={row.original.refunds?.length ? "warning" : "inherit"}
                        onClick={e => {
                            e.stopPropagation(); // Prevent row click
                            handleRefundStatusClick(row.original);
                        }}
                        disabled={!row.original.refunds?.length}
                    >
                        {row.original.refunds?.length ? "Requested" : "-"}
                    </Button>: <>{row.original.refunds[row.original.refunds?.length - 1]?.status}</>
                )
            }
            // No "Action" column!
        ],
        []
    );

    if (isLoading) {
        return <FuseLoading />;
    }

    return (
        <Paper
            className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
            elevation={2}
        >
            <DataTable
                data={orders}
                columns={columns}
                // Make row clickable for details
                muiTableBodyRowProps={({ row }) => ({
                    onClick: () => handleOrderDetailsClick(row.original),
                    style: { cursor: 'pointer' }
                })}
                renderRowActionMenuItems={({ closeMenu, row, table }) => [

                    <MenuItem
                        key="manual-refund"
                        onClick={() => {
                            handleManualRefundClick(row.original);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon>lucide:rotate-ccw</FuseSvgIcon>
                        </ListItemIcon>
                        Manual Refund
                    </MenuItem>
                ]}
                renderTopToolbarCustomActions={({ table }) => {
                    const { rowSelection } = table.getState();

                    if (Object.keys(rowSelection).length === 0) {
                        return null;
                    }

                    return (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                const selectedRows = table.getSelectedRowModel().rows;
                                deleteOrders(selectedRows.map((row) => row.original.id));
                                table.resetRowSelection();
                            }}
                            className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
                            color="secondary"
                        >
                            <FuseSvgIcon>lucide:trash</FuseSvgIcon>
                            <span className="mx-2 hidden sm:flex">Delete selected items</span>
                        </Button>
                    );
                }}
            />
            {/* Manual Refund/Refund Status Dialog */}
            <Dialog
                open={!!refundDialog}
                onClose={() => setRefundDialog(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {refundDialog?.from == 'manual' ? "Manual Refund" : "Process Refund"}
                </DialogTitle>
                <DialogContent>
                    {refundDialog && (
                        <>
                            <div><b>Name:</b> {refundDialog.order.user?.name}</div>
                            <div><b>Email:</b> {refundDialog.order.user?.email}</div>
                            <div><b>Order ID:</b> {refundDialog.order.order_id}</div>
                            {refundDialog?.from != 'manual' ? (
                                <>
                                    <div><b>Refund Status:</b> {refundDialog.order.refunds[0]?.status || "Requested"}</div>
                                    <FormControl component="fieldset" sx={{ my: 1 }}>
                                        <FormLabel component="legend">Action</FormLabel>
                                        <RadioGroup
                                            row
                                            value={refundDialog.approval || 'approve'}
                                            onChange={e => setRefundDialog({
                                                ...refundDialog,
                                                approval: e.target.value
                                            })}
                                        >
                                            <FormControlLabel value="approve" control={<Radio />} label="Approve" />
                                            <FormControlLabel value="reject" control={<Radio />} label="Reject" />
                                        </RadioGroup>
                                    </FormControl>
                                </>
                            ) : null}
                            <br />
                            {refundDialog?.from === 'manual' || refundDialog.approval !== 'reject' ? (
                <FormControl component="fieldset" sx={{ my: 1 }}>
                    <FormLabel component="legend">Refund Type</FormLabel>
                    <RadioGroup
                        row
                        value={refundDialog.type}
                        onChange={handleRefundTypeChange}
                    >
                        <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                        <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                    </RadioGroup>
                </FormControl>
            ) : null}
            {refundDialog?.from === 'manual' || refundDialog.approval !== 'reject' ? (
                <TextField
                    label="Amount"
                    value={refundDialog.amount}
                    onChange={handleRefundAmountChange}
                    disabled={refundDialog.type === 'full'}
                    type="number"
                    inputProps={{
                        min: 0,
                        max: refundDialog.order.final_amount
                    }}
                    fullWidth
                    margin="normal"
                />
            ) : null}
            {refundDialog?.from !== 'manual' && refundDialog.approval === 'reject' ? (
                <TextField
                    label="Admin Note"
                    value={refundDialog.admin_note || ''}
                    onChange={e => setRefundDialog({
                        ...refundDialog,
                        admin_note: e.target.value
                    })}
                    fullWidth
                    margin="normal"
                />
            ) : null}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRefundDialog(null)}>Cancel</Button>
                    {refundDialog?.order?.refunds?.length ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                createRefundAction(refundDialog.from);
                                setRefundDialog(null);
                            }}

                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                createRefundAction(refundDialog.from);
                                setRefundDialog(null);
                            }}
                        >
                            Refund
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box sx={{ p: 1 }}>
                            {/* Top section: two columns */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Name:</b> {selectedOrder.user?.name}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Email:</b> {selectedOrder.user?.email}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Number:</b> {selectedOrder.user?.phone}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Order ID:</b> {selectedOrder.order_id}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Transaction ID:</b> {selectedOrder.transaction?.id}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Time Stamp:</b> {selectedOrder.created_at}
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            {/* Second section: two columns */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Coupon Applied:</b> {selectedOrder.coupon?.code || '-'}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Discount:</b> {selectedOrder.discount_amount}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Amount Paid:</b> {selectedOrder.final_amount}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Refund Status:</b> {selectedOrder.refund_requests?.length ? "Requested" : "-"}
                                </Box>
                                <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
                                    <b>Admin Note:</b> {selectedOrder.admin_note || '-'}
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mb: 1 }}>
                                <b>Courses/Bundle:</b>
                                <ul style={{ margin: 0, paddingLeft: 18 }}>
                                    {(selectedOrder.items || []).map((item: any, idx: number) =>
                                        <li key={idx}>
                                            {item.course_bundle ? item.course_bundle.name : item.course ? item.course.name : null}
                                        </li>
                                    )}
                                </ul>
                            </Box>
                            <Box>
                                <b>Enrollments:</b> {(selectedOrder.enrollments || []).length}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default OrdersTable;
