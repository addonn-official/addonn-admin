import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
// import clsx from 'clsx';
// import Button from '@mui/material/Button';
import { useEnrollments } from '../../../api/hooks/enrollments/useEnrollments';
import { Enrollment } from '../../../api/types';
// import { useDeleteEnrollments } from '../../../api/hooks/enrollments/useDeleteEnrollments';
import useNavigate from '@fuse/hooks/useNavigate';

function EnrollmentsTable() {
	let { data: enrollments=[], isLoading, error } = useEnrollments();
		const navigate = useNavigate();

	console.log('Enrollments:', enrollments);
	if (error) {
        console.error('An error has occurred while fetching enrollments:', error.message);
        enrollments = [];
    }
	// const { mutate: deleteEnrollments } = useDeleteEnrollments();

	const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
		() => [
			// {
			// 	accessorKey: 'enrollment_id',
			// 	header: 'enrollmentID',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	Cell: ({ row }) => (
			// 		<Typography
			// 			component={Link}
			// 			to={`/enrollment/enrollment/${row.original.id}`}
			// 			role="button"
			// 		>
			// 			<u>{row.original.id}</u>
			// 		</Typography>
			// 	)
			// },
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					
						<>{row.original['user']['name']}<br />{row.original['user']['email']}</>
					
				)
			},
			{
				accessorKey: 'course',
				header: 'Course',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['course']['title']}</>
					
				)
			},{
				accessorKey: 'enrolledon',
				header: 'Enrolled on',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['enrolled_on']}</>
					
				)
			},{
				accessorKey: 'coursecompletion',
				header: 'course Completion %',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['completion_percentage']}%</>
					
				)
			},
			
			
			{
				accessorKey: 'active',
				header: 'Status',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.certificate_status}
						{/* {row.original.certificate_status=='pending' ? (
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
						)} */}
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
				data={enrollments}
				columns={columns}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/enrollment/enrollment/${row.original.id}`);
					},
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)'
						}
					}
				})}
				// renderRowActionMenuItems={({ closeMenu, row, table }) => [
				// 	<MenuItem
				// 		key={0}
				// 		onClick={() => {
				// 			deleteEnrollments([row.original.id]);
				// 			closeMenu();
				// 			table.resetRowSelection();
				// 		}}
				// 	>
				// 		<ListItemIcon>
				// 			<FuseSvgIcon>lucide:trash</FuseSvgIcon>
				// 		</ListItemIcon>
				// 		Delete
				// 	</MenuItem>
				// ]}
				// renderTopToolbarCustomActions={({ table }) => {
				// 	const { rowSelection } = table.getState();

				// 	if (Object.keys(rowSelection).length === 0) {
				// 		return null;
				// 	}

				// 	return (
				// 		<Button
				// 			variant="contained"
				// 			size="small"
				// 			onClick={() => {
				// 				const selectedRows = table.getSelectedRowModel().rows;
				// 				deleteEnrollments(selectedRows.map((row) => row.original.id));
				// 				table.resetRowSelection();
				// 			}}
				// 			className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
				// 			color="secondary"
				// 		>
				// 			<FuseSvgIcon>lucide:trash</FuseSvgIcon>
				// 			<span className="mx-2 hidden sm:flex">Delete selected items</span>
				// 		</Button>
				// 	);
				// }}
			/>
		</Paper>
	);
}

export default EnrollmentsTable;
