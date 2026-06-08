import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { instructorsQueryKey } from './useInstructors';

export const useDeleteInstructors = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteInstructors,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: instructorsQueryKey });
		}
	});
};
