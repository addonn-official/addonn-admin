import { useMemo } from 'react';
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
import { useUsers } from '../../../api/hooks/users/useUsers';
import { User } from '../../../api/types';
import { useDeleteUsers } from '../../../api/hooks/users/useDeleteUsers';
import useNavigate from '@fuse/hooks/useNavigate';

function UsersTable() {
	let { data: users=[], isLoading, error } = useUsers();
	const navigate = useNavigate();
	console.log('Users:', users);
	if (error) {
        console.error('An error has occurred while fetching users:', error.message);
        users = [];
    }
	const { mutate: deleteUsers } = useDeleteUsers();

	const columns = useMemo<MRT_ColumnDef<User>[]>(
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
						{row.original?.profile.file?.id ? (
							<img
								className="block max-h-9 w-full max-w-9 rounded-sm"
								src={row?.original?.profile?.file?.url}
								
							/>
						) : (<>	</>
						)}
					</div>
				)
			},
			// {
			// 	accessorKey: 'user_id',
			// 	header: 'userID',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	Cell: ({ row }) => (
			// 		<Typography
			// 			component={Link}
			// 			to={`/user/user/${row.original.id}`}
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
					<Typography
						component={Link}
						to={`/user/user/${row.original.id}`}
						role="button"
					>
						{row.original['name']}
					</Typography>
				)
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['phone']}</>
					
				)
			},
			{
				accessorKey: 'profession',
				header: 'Profession',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['profession']}</>
					
				)
			},
			{
				accessorKey: 'registration_date',
				header: 'Registration date',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					
						// <u>{row.original.created_at}</u>
						row.original.created_at //? new Date(row.original.created_at).toLocaleDateString() : 'N/A'
					
				)
			},
			{
				accessorKey: 'course_purchased',
				header: 'Course Purchased',
				enableColumnFilter: false,
				enableColumnDragging: false,
				accessorFn: (row) => `${row.course_purchased?row.course_purchased:''}`
			},
			{
				accessorKey: 'active',
				header: 'Account Status',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<div className="flex items-center gap-2">
						{!row.original?.profile?.is_otp_verified ? (
							<span className="text-orange-500 text-sm font-medium">OTP Pending</span>
						) : row.original.status === 'active' ? (
                             <FuseSvgIcon
                                 className="text-green-500"
                                 size={20}
                             >
                                 lucide:circle-check
                             </FuseSvgIcon>
						) : row.original.status === 'suspended' ? (
                             <FuseSvgIcon
                                 className="text-orange-500"
                                 size={20}
                             >
                                 lucide:circle-minus
                             </FuseSvgIcon>
						) : row.original.status === 'deleted' ? (
                             <FuseSvgIcon
                                 className="text-red-500"
                                 size={20}
                             >
                                 lucide:circle-minus
                             </FuseSvgIcon>
						) : (
							<span className="text-gray-500 text-sm">Unknown</span>
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
				data={users}
				columns={columns}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/user/user/${row.original.id}`);
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
						if (window.confirm(`Are you sure you want to delete user "${row.original.name}"?`)) {
							deleteUsers([row.original.id]);
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
							const count = selectedRows.length;
							if (window.confirm(`Are you sure you want to delete ${count} user(s)?`)) {
								deleteUsers(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}
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

export default UsersTable;
