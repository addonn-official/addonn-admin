import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Order } from '../../../api/types';
import { useCreateOrder } from '../../../api/hooks/orders/useCreateOrder';
import { useUpdateOrder } from '../../../api/hooks/orders/useUpdateOrder';
import { useDeleteOrder } from '../../../api/hooks/orders/useDeleteOrder';
import { useSnackbar } from 'notistack';

/**
 * The order header.
 */
function OrderHeader() {
	const routeParams = useParams<{ orderId: string }>();
	const { orderId } = routeParams;

	const { mutate: createOrder } = useCreateOrder();
	const { mutate: saveOrder } = useUpdateOrder();
	const { mutate: removeOrder } = useDeleteOrder();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	// const { name, images, featuredImageId } = watch() as Order;

	function handleSaveOrder() {
		saveOrder(getValues() as Order,
	
	{
                onSuccess: (data) => {
                    enqueueSnackbar('Order Saved Successfully', {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('Order Saved failed', err);
                    enqueueSnackbar(`Something went wrong ${err.message}`, {
                        variant: 'error'
                    });
                },
            });
	}

	function handleCreateOrder() {
		let orderInput = getValues() as Order
		createOrder(orderInput,

	{
                onSuccess: (data) => {
                    enqueueSnackbar('Order Saved Successfully', {
                        variant: 'success'
                    });
                },
                onError: (err: any) => {
                    console.error('Order Saved failed', err);
                    enqueueSnackbar(`Something went wrong ${err.message}`, {
                        variant: 'error'
                    });
                },
            }
		);
	}

	function handleRemoveOrder() {
		removeOrder(orderId);
		navigate('/order/order');
	}

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{'Order'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Detail
						</Typography>
					</motion.div>
				</div>
				<motion.div
					className="flex w-full flex-1 justify-end"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{orderId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveOrder}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveOrder}
							>
								Save
							</Button>
						</>
					) : (
						<Button
							className="mx-1 whitespace-nowrap"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							onClick={handleCreateOrder}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default OrderHeader;
