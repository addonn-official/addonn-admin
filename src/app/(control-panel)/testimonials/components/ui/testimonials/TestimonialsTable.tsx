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
import { useTestimonials } from '../../../api/hooks/testimonials/useTestimonials';
import { Testimonial } from '../../../api/types';
import { useDeleteTestimonials } from '../../../api/hooks/testimonials/useDeleteTestimonials';
import useNavigate from '@fuse/hooks/useNavigate';

function TestimonialsTable() {
	let { data: testimonials=[], isLoading, error } = useTestimonials();
	const navigate = useNavigate();
	console.log('Testimonials:', testimonials);
	if (error) {
        console.error('An error has occurred while fetching testimonials:', error.message);
        testimonials = [];
    }
	const { mutate: deleteTestimonials } = useDeleteTestimonials();

	const columns = useMemo<MRT_ColumnDef<Testimonial>[]>(
		() => [
			{
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
								src={row?.original?.thumbnail?.url}
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
					<Typography
						component={Link}
						to={`/testimonial/testimonial/${row.original.id}`}
						role="button"
					>
						<>{row.original['name']}</>
					</Typography>
				)
			},
			{
				accessorKey: 'review',
				header: 'Review',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['review']}</>
					
				)
			},
			// {
			// 	accessorKey: 'script',
			// 	header: 'Script',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	Cell: ({ row }) => (
			// 			<>{row.original['script']}</>
					
			// 	)
			// },
			
			{
				accessorKey: 'rating',
				header: 'Rating',
				enableColumnFilter: false,
				enableColumnDragging: false,
				accessorFn: (row) => `${row.rating}`
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
				data={testimonials}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteTestimonials([row.original.id]);
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
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/testimonial/testimonial/${row.original.id}`);
					},
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)'
						}
					}
				})}
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
								deleteTestimonials(selectedRows.map((row) => row.original.id));
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

export default TestimonialsTable;
