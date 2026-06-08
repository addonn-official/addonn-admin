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
import { useCoupons } from '../../../api/hooks/coupons/useCoupons';
import { Coupon } from '../../../api/types';
import { useDeleteCoupons } from '../../../api/hooks/coupons/useDeleteCoupons';
import useNavigate from '@fuse/hooks/useNavigate';

function CouponsTable() {
	let { data: coupons=[], isLoading, error } = useCoupons();
	const navigate = useNavigate();
	console.log('Coupons:', coupons);
	if (error) {
        console.error('An error has occurred while fetching coupons:', error.message);
        coupons = [];
    }
	const { mutate: deleteCoupons } = useDeleteCoupons();

	const columns = useMemo<MRT_ColumnDef<Coupon>[]>(
		() => [
			// {
			// 	accessorFn: (row) => row.featuredImageId,
			// 	id: 'featuredImageId',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	size: 64,
			// 	enableSorting: false,
			// 	Cell: ({ row }) => (
			// 		<div className="flex items-center justify-center">
			// 			{row.original?.file?.id ? (
			// 				<img
			// 					className="block max-h-9 w-full max-w-9 rounded-sm"
			// 					src={row?.original?.file?.url}
			// 					alt={row.original.name}
			// 				/>
			// 			) : (
			// 				<></>
			// 			)}
			// 		</div>
			// 	)
			// },
			
			{
				accessorKey: 'code',
				header: 'Code',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/coupon/coupon/${row.original.id}`}
						role="button"
					>
						<>{row.original['code']}</>
					</Typography>
				)
			},
			{
				accessorKey: 'discount',
				header: 'Discount',
				size: 50,
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['discount']}</>
					
				)
			},
			{
				accessorKey: 'starts_at',
				header: 'Start Date',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
						<>{row.original['starts_at']}</>
					
				)
			},
			{
				accessorKey: 'expires_at',
				header: 'Expiry Date',
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					
						<u>{row.original.expires_at}</u>
					
				)
			},
			{
				accessorKey: 'active',
				header: 'Status',
				size: 80,
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.is_active ? (
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
				data={coupons}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteCoupons([row.original.id]);
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
						navigate(`/coupon/coupon/${row.original.id}`);
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
								deleteCoupons(selectedRows.map((row) => row.original.id));
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

export default CouponsTable;
