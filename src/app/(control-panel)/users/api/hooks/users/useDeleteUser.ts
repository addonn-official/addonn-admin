import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { userQueryKey } from './useUser';
import { usersQueryKey } from './useUsers';

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteUser,
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries({ queryKey: usersQueryKey });
			queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
		}
	});
};
