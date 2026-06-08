import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Coupon } from '../../../api/types';
import { useCreateCoupon } from '../../../api/hooks/coupons/useCreateCoupon';
import { useUpdateCoupon } from '../../../api/hooks/coupons/useUpdateCoupon';
import { useDeleteCoupon } from '../../../api/hooks/coupons/useDeleteCoupon';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The coupon header.
 */
function CouponHeader() {
	const routeParams = useParams<{ couponId: string }>();
	const { couponId } = routeParams;

	const { mutate: createCoupon } = useCreateCoupon();
	const { mutate: saveCoupon } = useUpdateCoupon();
	const { mutate: removeCoupon } = useDeleteCoupon();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { code } = watch() as Coupon;

	function handleSaveCoupon() {
		saveCoupon(getValues() as Coupon,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Coupon Saved Successfully', {
						variant: 'success'
					});
					navigate('/coupon/coupon');
				},
				onError: async (err: any) => {
					if (err instanceof HTTPError) {
						const errorJson = await err.response.json();
						enqueueSnackbar(
							errorJson?.message || 'Something went wrong',
							{
								variant: 'error'
							}
						);
					} else {
						enqueueSnackbar(
							err?.response?.data?.message || err?.message || 'Something went wrong',
							{
								variant: 'error'
							}
						);
					}
				},
			});
	}

	function handleCreateCoupon() {
		let couponInput = getValues() as Coupon
		createCoupon(couponInput,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Coupon Saved Successfully', {
						variant: 'success'
					});
					navigate('/coupon/coupon');
				},
				onError: async (err: any) => {
					if (err instanceof HTTPError) {
						const errorJson = await err.response.json();
						enqueueSnackbar(
							errorJson?.message || 'Something went wrong',
							{
								variant: 'error'
							}
						);
					} else {
						enqueueSnackbar(
							err?.response?.data?.message || err?.message || 'Something went wrong',
							{
								variant: 'error'
							}
						);
					}
				},
			}
		);
	}

	function handleRemoveCoupon() {
		removeCoupon(couponId);
		navigate('/coupon/coupon');
	}

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					{/* <motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
							<img
								className="w-8 rounded-sm sm:w-12"
								src={_.find(images, { id: featuredImageId })?.url}
								alt={name}
							/>
						) : (
							<img
								className="w-8 rounded-sm sm:w-12"
								src="/assets/images/apps/ecommerce/coupon-image-placeholder.png"
								alt={name}
							/>
						)}
					</motion.div> */}
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{code || 'New Coupon'}
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
					{couponId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveCoupon}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveCoupon}
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
							onClick={handleCreateCoupon}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default CouponHeader;
