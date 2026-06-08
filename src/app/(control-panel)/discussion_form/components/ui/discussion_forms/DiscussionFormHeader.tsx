import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { DiscussionForm } from '../../../api/types';
import { useCreateDiscussionForm } from '../../../api/hooks/discussion_forms/useCreateDiscussionForm';
import { useUpdateDiscussionForm } from '../../../api/hooks/discussion_forms/useUpdateDiscussionForm';
import { useDeleteDiscussionForm } from '../../../api/hooks/discussion_forms/useDeleteDiscussionForm';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The discussion_form header.
 */
function DiscussionFormHeader() {
	const routeParams = useParams<{ discussion_formId: string }>();
	const { discussion_formId } = routeParams;

	const { mutate: createDiscussionForm } = useCreateDiscussionForm();
	const { mutate: saveDiscussionForm } = useUpdateDiscussionForm();
	const { mutate: removeDiscussionForm } = useDeleteDiscussionForm();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { code } = watch() as DiscussionForm;

	function handleSaveDiscussionForm() {
		saveDiscussionForm(getValues() as DiscussionForm,

			{
				onSuccess: (data) => {
					enqueueSnackbar('DiscussionForm Saved Successfully', {
						variant: 'success'
					});
					navigate('/discussion_form/discussion_form');
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

	function handleCreateDiscussionForm() {
		let discussion_formInput = getValues() as DiscussionForm
		createDiscussionForm(discussion_formInput,

			{
				onSuccess: (data) => {
					enqueueSnackbar('DiscussionForm Saved Successfully', {
						variant: 'success'
					});
					navigate('/discussion_form/discussion_form');
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

	function handleRemoveDiscussionForm() {
		removeDiscussionForm(discussion_formId);
		navigate('/discussion_form/discussion_form');
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
								src="/assets/images/apps/ecommerce/discussion_form-image-placeholder.png"
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
							{code || 'New DiscussionForm'}
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
					{discussion_formId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveDiscussionForm}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveDiscussionForm}
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
							onClick={handleCreateDiscussionForm}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default DiscussionFormHeader;
