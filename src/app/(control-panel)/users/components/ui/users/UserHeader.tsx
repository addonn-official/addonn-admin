import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { User } from '../../../api/types';
import { useCreateUser } from '../../../api/hooks/users/useCreateUser';
import { useUpdateUser } from '../../../api/hooks/users/useUpdateUser';
import { useDeleteUser } from '../../../api/hooks/users/useDeleteUser';
import { useSnackbar } from 'notistack';
import { HTTPError } from 'ky';

/**
 * The user header.
 */
function UserHeader() {
	const routeParams = useParams<{ userId: string }>();
	const { userId } = routeParams;

	const { mutate: createUser } = useCreateUser();
	const { mutate: saveUser } = useUpdateUser();
	const { mutate: removeUser } = useDeleteUser();
	const { enqueueSnackbar } = useSnackbar();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, image } = watch() as User;

	function handleSaveUser() {
		saveUser(getValues() as User,

			{
				onSuccess: (data) => {
					enqueueSnackbar('User Saved Successfully', {
						variant: 'success'
					});
					navigate('/user/user');
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

	function handleCreateUser() {
		let userInput = getValues() as User
		createUser(userInput,

			{
				onSuccess: (data) => {
					enqueueSnackbar('User Saved Successfully', {
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

	function handleRemoveUser() {
		removeUser(userId);
		navigate('/user/user');
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
						{image && (
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
							{name || 'New User'}
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
					{userId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveUser}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveUser}
							>
								Save
							</Button>
						</>
					) : (<></>
						// <Button
						// 	className="mx-1 whitespace-nowrap"
						// 	variant="contained"
						// 	color="secondary"
						// 	disabled={_.isEmpty(dirtyFields) || !isValid}
						// 	onClick={handleCreateUser}
						// >
						// 	Add
						// </Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default UserHeader;
