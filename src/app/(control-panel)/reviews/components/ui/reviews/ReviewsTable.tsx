import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { useReviews } from '../../../api/hooks/reviews/useReviews';
import { Review } from '../../../api/types';
import { useDeleteReviews } from '../../../api/hooks/reviews/useDeleteReviews';
import useNavigate from '@fuse/hooks/useNavigate';

function ReviewsTable() {
    const [pageIndex, setPageIndex] = useState<number>(0); // material-react-table uses 0-based index
    const [pageSize, setPageSize] = useState<number>(10);
    const navigate = useNavigate();
    const { data: reviewsResponse, isLoading, error } = useReviews(pageIndex + 1, pageSize);
    const reviews = reviewsResponse?.data ?? [];
    const totalCount = reviewsResponse?.meta?.total ?? reviews.length;

    if (error) {
        console.error('An error has occurred while fetching reviews:', (error as Error).message);
    }

    const { mutate: deleteReviews } = useDeleteReviews();

    const columns = useMemo<MRT_ColumnDef<Review>[]>(
        () => [
            {
                accessorFn: (row) => row.featuredImageId,
                id: 'featuredImageId',
                header: '',
                enableColumnFilter: false,
                enableColumnDragging: false,
                size: 64,
                enableSorting: false,
                Cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        {row.original?.file?.id ? (
                            <img
                                className="block max-h-9 w-full max-w-9 rounded-sm"
                                src={row?.original?.file?.url}
                                alt={row.original.name}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                )
            },
            {
                accessorKey: 'name',
                header: 'Name',
                enableColumnFilter: false,
                enableColumnDragging: false,
                Cell: ({ row }) => (
                    <Typography component={Link} to={`/review/review/${row.original.id}`} role="button">
                        <>{row.original['name']}<br/>{row.original['phone']}</>
                    </Typography>
                )
            },
            {
                accessorKey: 'course',
                header: 'Course',
                enableColumnFilter: false,
                enableColumnDragging: false,
                Cell: ({ row }) => <>{row.original['course']?.title}</>
            },
            {
                accessorKey: 'review',
                header: 'Review',
                enableColumnFilter: false,
                enableColumnDragging: false,
                Cell: ({ row }) => <>{row.original.review}</>
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                enableColumnFilter: false,
                enableColumnDragging: false,
                accessorFn: (row) => `${row.rating}`
            },
            {
                accessorKey: 'active',
                header: 'Verified',
                enableColumnFilter: false,
                enableColumnDragging: false,
                Cell: ({ row }) => (
                    <div className="flex items-center">
                        {row.original.verified == '1' ? (
                            <FuseSvgIcon className="text-green-500" size={20}>
                                lucide:circle-check
                            </FuseSvgIcon>
                        ) : (
                            <FuseSvgIcon className="text-red-500" size={20}>
                                lucide:circle-minus
                            </FuseSvgIcon>
                        )}
                    </div>
                )
            }
        ],
        []
    );

    if (isLoading) {
        return <FuseLoading />;
    }

    return (
        <Paper className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none" elevation={2}>
            <DataTable
                data={reviews}
                columns={columns}
                // Enable server-side/manual pagination: provide rowCount and controlled pagination state
                manualPagination
                rowCount={totalCount}
                state={{
                    pagination: {
                        pageIndex,
                        pageSize
                    }
                }}
                onPaginationChange={(updater: any) => {
                    // updater may be either a new pagination state or an updater function
                    if (typeof updater === 'function') {
                        const newState = updater({ pageIndex, pageSize });
                        setPageIndex(newState.pageIndex ?? pageIndex);
                        setPageSize(newState.pageSize ?? pageSize);
                    } else {
                        setPageIndex(updater.pageIndex ?? pageIndex);
                        setPageSize(updater.pageSize ?? pageSize);
                    }
                }}
                muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/review/review/${row.original.id}`);
					},
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)'
						}
					}
				})}
                renderRowActionMenuItems={({ closeMenu, row, table }) => [
                    <MenuItem
                        key={0}
                        onClick={() => {
                            deleteReviews([row.original.id]);
                            closeMenu();
                            table.resetRowSelection();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon>lucide:trash</FuseSvgIcon>
                        </ListItemIcon>
                        Delete
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
                                deleteReviews(selectedRows.map((row) => row.original.id));
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
        </Paper>
    );
}

export default ReviewsTable;
