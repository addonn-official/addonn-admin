import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { enrollmentsQueryKey } from './useEnrollments';

export const useDeleteEnrollments = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteEnrollments,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
		}
	});
};
