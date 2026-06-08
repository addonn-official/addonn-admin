import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Testimonial } from '../../../api/types';
import { useCreateTestimonial } from '../../../api/hooks/testimonials/useCreateTestimonial';
import { useUpdateTestimonial } from '../../../api/hooks/testimonials/useUpdateTestimonial';
import { useDeleteTestimonial } from '../../../api/hooks/testimonials/useDeleteTestimonial';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The testimonial header.
 */
function TestimonialHeader() {
	const routeParams = useParams<{ testimonialId: string }>();
	const { testimonialId } = routeParams;

	const { mutate: createTestimonial } = useCreateTestimonial();
	const { mutate: saveTestimonial } = useUpdateTestimonial();
	const { mutate: removeTestimonial } = useDeleteTestimonial();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, images, featuredImageId } = watch() as Testimonial;

	function handleSaveTestimonial() {
		saveTestimonial(getValues() as Testimonial,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Testimonial Saved Successfully', {
						variant: 'success'
					});
					navigate('/testimonial/testimonial');
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

	function handleCreateTestimonial() {
		let testimonialInput = getValues() as Testimonial
		createTestimonial(testimonialInput,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Testimonial Saved Successfully', {
						variant: 'success'
					});
					navigate('/testimonial/testimonial');
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

	function handleRemoveTestimonial() {
		removeTestimonial(testimonialId);
		navigate('/testimonial/testimonial');
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
								alt={name}
							/>
						) : (
							<img
								className="w-8 rounded-sm sm:w-12"
								src={images[0]?.url}
								alt={name}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{name || 'New Testimonial'}
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
					{testimonialId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveTestimonial}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveTestimonial}
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
							onClick={handleCreateTestimonial}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default TestimonialHeader;
