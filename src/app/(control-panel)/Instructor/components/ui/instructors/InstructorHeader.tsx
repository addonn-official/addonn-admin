import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Instructor } from '../../../api/types';
import { useCreateInstructor } from '../../../api/hooks/instructors/useCreateInstructor';
import { useUpdateInstructor } from '../../../api/hooks/instructors/useUpdateInstructor';
import { useDeleteInstructor } from '../../../api/hooks/instructors/useDeleteInstructor';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The instructor header.
 */
function InstructorHeader() {
	const routeParams = useParams<{ instructorId: string }>();
	const { instructorId } = routeParams;

	const { mutate: createInstructor } = useCreateInstructor();
	const { mutate: saveInstructor } = useUpdateInstructor();
	const { mutate: removeInstructor } = useDeleteInstructor();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, image, featuredImageId } = watch() as Instructor;

	function handleSaveInstructor() {
		saveInstructor(getValues() as Instructor, {
			onSuccess: (data) => {
				enqueueSnackbar('Instructor Saved Successfully', {
					variant: 'success'
				});
				navigate('/instructor/instructor');
			},
			onError: async (err: any) => {
				if (err instanceof HTTPError) {
					const errorJson = await err.response.json();
					enqueueSnackbar(
						errorJson?.message|| 'Something went wrong',
						{
							variant: 'error'
						}
					);
				}else{
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

	function handleCreateInstructor() {
		let instructorInput = getValues() as Instructor;
		createInstructor(instructorInput, {
			onSuccess: (data) => {
				enqueueSnackbar('Instructor Saved Successfully', {
					variant: 'success'
				});
				navigate('/instructor/instructor');
			},
			onError: async (err: any) => {
				if (err instanceof HTTPError) {
					const errorJson = await err.response.json();
					enqueueSnackbar(
						errorJson?.message|| 'Something went wrong',
						{
							variant: 'error'
						}
					);
				}else{
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

	function handleRemoveInstructor() {
		removeInstructor(instructorId, {
			onSuccess: (data) => {
				enqueueSnackbar('Instructor deleted successfully', {
					variant: 'success'
				});
				navigate('/instructor/instructor');
			},
			onError: async (err: any) => {
				if (err instanceof HTTPError) {
					const errorJson = await err.response.json();
					enqueueSnackbar(
						errorJson?.message|| 'Something went wrong',
						{
							variant: 'error'
						}
					);
				}else{
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
						{image &&  (
							<img
								className="w-8 rounded-sm sm:w-12"
								src={image}
								
							/>
						)}
					</motion.div>
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{name || 'New Instructor'}
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
					{instructorId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveInstructor}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveInstructor}
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
							onClick={handleCreateInstructor}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default InstructorHeader;
