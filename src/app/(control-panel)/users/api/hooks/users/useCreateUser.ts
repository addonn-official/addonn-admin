import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { usersQueryKey } from './useUsers';
export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersQueryKey });
		}
	});
};
