import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { usersQueryKey } from './useUsers';

export const useDeleteUsers = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteUsers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKey });
		}
	});
};
