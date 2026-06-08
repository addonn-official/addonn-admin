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
import { useInstructors } from '../../../api/hooks/instructors/useInstructors';
import { Instructor } from '../../../api/types';
import { useDeleteInstructors } from '../../../api/hooks/instructors/useDeleteInstructors';
import useNavigate from '@fuse/hooks/useNavigate';

function InstructorsTable() {
	// let { data: instructors = [], isLoading, error } = useInstructors();
	const [pageIndex, setPageIndex] = useState<number>(0); // material-react-table uses 0-based index
	const [pageSize, setPageSize] = useState<number>(10);
	const navigate = useNavigate();
	const { data: instructorsResponse, isLoading, error } = useInstructors(pageIndex + 1, pageSize);
	const instructors = instructorsResponse?.data ?? [];
	const totalCount = instructorsResponse?.meta?.total ?? instructors.length;
	console.log('Instructors:', instructors);
	// if (error) {
	// 	console.error('An error has occurred while fetching instructors:', error.message);
	// 	instructors = [];
	// }
	const { mutate: deleteInstructors } = useDeleteInstructors();

	const columns = useMemo<MRT_ColumnDef<Instructor>[]>(
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
					// <div className="flex items-center justify-center">
					// 	{row.original?.images?.length > 0 && row.original.featuredImageId ? (
					// 		<img
					// 			className="block max-h-9 w-full max-w-9 rounded-sm"
					// 			src={_.find(row.original.images, { id: row.original.featuredImageId })?.url}
					// 			alt={row.original.name}
					// 		/>
					// 	) : (
					// 		<img
					// 			className="block max-h-9 w-full max-w-9 rounded-sm"
					// 			src="/assets/images/apps/ecommerce/instructor-image-placeholder.png"
					// 			alt={row.original.name}
					// 		/>
					// 	)}
					// </div>
					<div className="flex items-center justify-center">
						{row.original?.file?.id ? (
							<img
								className="block max-h-9 w-full max-w-9 rounded-sm"
								src={row?.original?.file?.url}
								alt={row.original['name']}
							/>
						) : (
							// <img
							// 	className="block max-h-9 w-full max-w-9 rounded-sm"
							// 	src="/assets/images/apps/ecommerce/product-image-placeholder.png"
							// 	alt={row.original.title}
							// />
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
					<Typography
						component={Link}
						to={`/instructor/instructor/${row.original.id}`}
						role="button"
					>
						{row.original['display_name']}
					</Typography>
				)
			},
			{
				accessorKey: 'registration_date',
				header: 'Registration date',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					row.original.registered_at
				)
			},
			{
				accessorKey: 'average_rating',
				header: 'Average rating',
				enableColumnFilter: false,
				enableColumnDragging: false,
				accessorFn: (row) => `${row.average_rating}`
			},
			{
				accessorKey: 'active',
				header: 'Active',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.status == 'active' ? (
							<FuseSvgIcon
								className="text-green-500"
								size={20}
							>
								lucide:circle-check
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red-500"
								size={20}
							>
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
		<Paper
			className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
			elevation={2}
		>
			<DataTable
				data={instructors}
				columns={columns}
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
						navigate(`/instructor/instructor/${row.original.id}`);
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
						// onClick={() => {
						// 	deleteInstructors([row.original.id]);
						// 	closeMenu();
						// 	table.resetRowSelection();
						// }}
						onClick={() => {
							if (window.confirm(`Are you sure you want to delete instructor "${row.original.name}"?`)) {
								deleteInstructors([row.original.id]);
								closeMenu();
								table.resetRowSelection();
							}
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
								deleteInstructors(selectedRows.map((row) => row.original.id));
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

export default InstructorsTable;
