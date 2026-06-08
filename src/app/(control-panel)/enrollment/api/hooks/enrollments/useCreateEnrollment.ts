import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { enrollmentsQueryKey } from './useEnrollments';
export const useCreateEnrollment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createEnrollment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
		}
	});
};
