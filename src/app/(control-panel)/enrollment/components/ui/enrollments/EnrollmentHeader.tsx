import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Enrollment } from '../../../api/types';
import { useCreateEnrollment } from '../../../api/hooks/enrollments/useCreateEnrollment';
import { useUpdateEnrollment } from '../../../api/hooks/enrollments/useUpdateEnrollment';
import { useDeleteEnrollment } from '../../../api/hooks/enrollments/useDeleteEnrollment';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The enrollment header.
 */
function EnrollmentHeader() {
	const routeParams = useParams<{ enrollmentId: string }>();
	const { enrollmentId } = routeParams;

	const { mutate: createEnrollment } = useCreateEnrollment();
	const { mutate: saveEnrollment } = useUpdateEnrollment();
	const { mutate: removeEnrollment } = useDeleteEnrollment();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	// const { name, images, featuredImageId } = watch() as Enrollment;

	function handleSaveEnrollment() {
		saveEnrollment(getValues() as Enrollment,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Enrollment Saved Successfully', {
						variant: 'success'
					});
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

	function handleCreateEnrollment() {
		let enrollmentInput = getValues() as Enrollment
		createEnrollment(enrollmentInput,

			{
				onSuccess: (data) => {
					enqueueSnackbar('Enrollment Saved Successfully', {
						variant: 'success'
					});
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

	function handleRemoveEnrollment() {
		removeEnrollment(enrollmentId);
		navigate('/enrollment/enrollment');
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
							{'Enrollment'}
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
					{enrollmentId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveEnrollment}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveEnrollment}
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
							onClick={handleCreateEnrollment}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default EnrollmentHeader;
