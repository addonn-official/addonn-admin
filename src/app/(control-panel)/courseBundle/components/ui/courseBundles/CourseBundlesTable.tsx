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
import { useCourseBundles } from '../../../api/hooks/courseBundles/useCourseBundles';
import { CourseBundle } from '../../../api/types';
import { useDeleteCourseBundles } from '../../../api/hooks/courseBundles/useDeleteCourseBundles';
import useNavigate from '@fuse/hooks/useNavigate';

function CourseBundlesTable() {
	let { data: courseBundles=[], isLoading, error } = useCourseBundles();
	const navigate = useNavigate();
	
	console.log('CourseBundles:', courseBundles);
	if (error) {
        console.error('An error has occurred while fetching courseBundles:', error.message);
        courseBundles = [];
    }
	const { mutate: deleteCourseBundles } = useDeleteCourseBundles();

	const columns = useMemo<MRT_ColumnDef<CourseBundle>[]>(
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
				accessorKey: 'courseBundle_id',
				header: 'courseBundleID',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					// <Typography
					// 	component={Link}
					// 	to={`/course-bundle/course-bundle/${row.original.id}`}
					// 	role="button"
					// >
						<>{row.original.id}</>
					// </Typography>
				)
			},
			{
				accessorKey: 'name',
				header: 'Bundle Name',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					
						<>{row.original['name']}</>
					
				)
			},
			// {
			// 	accessorKey: 'number_of_course',
			// 	header: 'Number of Course',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	Cell: ({ row }) => (
			// 			<>{row.original['number_of_course']}</>
					
			// 	)
			// },
			{
				accessorKey: 'courses',
				header: 'Courses in the bundle',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					
						<>{row.original.courses.map(c=>c.title).join(', ')}</>
					
				)
			},
			{
				accessorKey: 'price',
				header: 'Price',
				enableColumnFilter: false,
				enableColumnDragging: false,
				accessorFn: (row) => `${row.price}`
			},
			{
				accessorKey: 'discounted_price',
				header: 'Discounted Price',
				enableColumnFilter: false,
				enableColumnDragging: false,
				accessorFn: (row) => `${row.discounted_price}`
			},
			{
				accessorKey: 'active',
				header: 'Status',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.status ? (
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
				data={courseBundles}
				columns={columns}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/course-bundle/course-bundle/${row.original.id}`);
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
							deleteCourseBundles([row.original.id]);
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
								deleteCourseBundles(selectedRows.map((row) => row.original.id));
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

export default CourseBundlesTable;
