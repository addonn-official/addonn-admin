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
import { useProducts } from '../../../api/hooks/products/useProducts';
import { Course } from '../../../api/types';
import { useDeleteProducts } from '../../../api/hooks/products/useDeleteProducts';
import useNavigate from '@fuse/hooks/useNavigate';

function ProductsTable() {
	let { data: products=[], isLoading, error } = useProducts();
	const navigate = useNavigate();
	console.log('Products:', products);
	if (error) {
        console.error('An error has occurred while fetching products:', error.message);
        products = [];
    }
	const { mutate: deleteProducts } = useDeleteProducts();

	const columns = useMemo<MRT_ColumnDef<Course>[]>(
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
								alt={row.original.title}
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
			// {
			// 	accessorKey: 'course_id',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	header: 'courseID',
			// 	Cell: ({ row }) => (
			// 		<Typography
			// 			component={Link}
			// 			to={`/course/course/${row.original.id}`}
			// 			role="button"
			// 		>
			// 			<u>{row.original.id}</u>
			// 		</Typography>
			// 	)
			// },
			{
				accessorKey: 'name',
				enableColumnFilter: false,
				enableColumnDragging: false,
				header: 'Name',
				Cell: ({ row }) => (
					
						<>{row.original.title}</>
					
				)
			},
			{
				accessorKey: 'release_status',
				enableColumnFilter: false,
				enableColumnDragging: false,
				header: 'Release Status',
				Cell: ({ row }) => (
						<>{row.original.status?'Public':'Comming soon'}</>
				)
			},
			// {
			// 	accessorKey: 'categories',
			// 	header: 'Category',
			// 	Cell: ({ row }) => (
			// 		<div className="flex flex-wrap gap-1">
			// 			{row.original.categories.map((item) => (
			// 				<Chip
			// 					key={item}
			// 					label={item}
			// 					size="small"
			// 				/>
			// 			))}
			// 		</div>
			// 	)
			// },
			// {
			// 	accessorKey: 'priceTaxIncl',
			// 	header: 'Status',
			// 	accessorFn: (row) => `$${row.priceTaxIncl}`
			// },
			{
				accessorKey: 'Instructors',
				enableColumnFilter: false,
				enableColumnDragging: false,
				header: 'Instructors',
				accessorFn: (row) => `${row.instructors?.map(instructor => instructor.name).join(', ')}`
			},
			{
				accessorKey: 'discounted_price',
				enableColumnFilter: false,
				enableColumnDragging: false,
				header: 'Discounted Price',
				accessorFn: (row) => `${(row as any).discounted_price ?? ''}`
			},
			// {
			// 	accessorKey: 'quantity',
			// 	header: 'Quantity',
			// 	Cell: ({ row }) => (
			// 		<div className="flex items-center gap-1">
			// 			<span>{row.original.quantity}</span>
			// 			<i
			// 				className={clsx(
			// 					'inline-block h-2 w-2 rounded-sm',
			// 					row.original.quantity <= 5 && 'bg-red-500',
			// 					row.original.quantity > 5 && row.original.quantity <= 25 && 'bg-orange-500',
			// 					row.original.quantity > 25 && 'bg-green-500'
			// 				)}
			// 			/>
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'active',
				header: 'Active',
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
				data={products}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteProducts([row.original.id]);
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
						navigate(`/course/course/${row.original.id}`);
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
								deleteProducts(selectedRows.map((row) => row.original.id));
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

export default ProductsTable;
