import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { enrollmentsQueryKey } from './useEnrollments';
import { enrollmentQueryKey } from './useEnrollment';

export const useUpdateCertificate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateCertificate,
		onSuccess: (_, enrollment) => {
			console.log('Certificate updated successfully for enrollment:', enrollment);
			queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });

			queryClient.invalidateQueries({ queryKey: enrollmentQueryKey(enrollment.id) });
		}
	});
};
