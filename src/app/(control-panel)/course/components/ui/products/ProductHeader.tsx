import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Course } from '../../../api/types';
import { useCreateProduct } from '../../../api/hooks/products/useCreateProduct';
import { useUpdateProduct } from '../../../api/hooks/products/useUpdateProduct';
import { useDeleteProduct } from '../../../api/hooks/products/useDeleteProduct';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The product header.
 */
function ProductHeader() {
	const routeParams = useParams<{ productId: string }>();
	const { productId } = routeParams;

	const { mutate: createProduct } = useCreateProduct();
	const { mutate: saveProduct } = useUpdateProduct();
	const { mutate: removeProduct } = useDeleteProduct();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { title, images, featuredImageId } = watch() as Course;
	// console.log(images)
	function handleSaveProduct() {
		saveProduct(getValues() as Course,
			{
				onSuccess: (data) => {

					enqueueSnackbar('Course Saved Successfully', {
						variant: 'success'
					});
					navigate('/course/course');
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

	function handleCreateProduct() {
		let courseInput = getValues() as Course
		createProduct(courseInput,
			{
				onSuccess: (data) => {
					console.log(data)
					if (data['data']?.id) navigate('/course/course/' + data['data'].id);
					enqueueSnackbar('Course Created Successfully', {
						variant: 'success'
					});
					navigate('/course/course');
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

	function handleRemoveProduct() {
		removeProduct(productId);
		navigate('/course/course');
	}

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
							<img
								className="w-8 rounded-sm sm:w-12"
								src={_.find(images, { id: featuredImageId })?.url}
								alt={title}
							/>
						) : (
							<img
								className="w-8 rounded-sm sm:w-12"
								// src="/assets/images/apps/ecommerce/product-image-placeholder.png"
								// alt={title}
								src={images[0]?.url}
								alt={title}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{title || 'New Course'}
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
					{productId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveProduct}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveProduct}
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
							onClick={handleCreateProduct}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default ProductHeader;
