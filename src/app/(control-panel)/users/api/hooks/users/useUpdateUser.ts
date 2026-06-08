import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { usersQueryKey } from './useUsers';
import { userQueryKey } from './useUser';

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateUser,
		onSuccess: (_, user) => {
			queryClient.invalidateQueries({ queryKey: usersQueryKey });
			queryClient.invalidateQueries({ queryKey: userQueryKey(user.id) });
		}
	});
};
