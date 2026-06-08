import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { enrollmentQueryKey } from './useEnrollment';
import { enrollmentsQueryKey } from './useEnrollments';

export const useDeleteEnrollment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteEnrollment,
		onSuccess: (_, enrollmentId) => {
			queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
			queryClient.invalidateQueries({ queryKey: enrollmentQueryKey(enrollmentId) });
		}
	});
};
