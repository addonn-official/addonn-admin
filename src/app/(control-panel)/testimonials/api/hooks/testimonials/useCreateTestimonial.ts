import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { testimonialsQueryKey } from './useTestimonials';
export const useCreateTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createTestimonial,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: testimonialsQueryKey });
		}
	});
};
