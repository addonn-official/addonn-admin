import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { testimonialQueryKey } from './useTestimonial';
import { testimonialsQueryKey } from './useTestimonials';

export const useDeleteTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteTestimonial,
		onSuccess: (_, testimonialId) => {
			queryClient.invalidateQueries({ queryKey: testimonialsQueryKey });
			queryClient.invalidateQueries({ queryKey: testimonialQueryKey(testimonialId) });
		}
	});
};
