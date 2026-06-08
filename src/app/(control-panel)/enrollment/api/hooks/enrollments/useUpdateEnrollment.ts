import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { enrollmentsQueryKey } from './useEnrollments';
import { enrollmentQueryKey } from './useEnrollment';

export const useUpdateEnrollment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateEnrollment,
		onSuccess: (_, enrollment) => {
			queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
			queryClient.invalidateQueries({ queryKey: enrollmentQueryKey(enrollment.id) });
		}
	});
};
