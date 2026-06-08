import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { testimonialsQueryKey } from './useTestimonials';
import { testimonialQueryKey } from './useTestimonial';

export const useUpdateTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateTestimonial,
		onSuccess: (_, testimonial) => {
			queryClient.invalidateQueries({ queryKey: testimonialsQueryKey });
			queryClient.invalidateQueries({ queryKey: testimonialQueryKey(testimonial.id) });
		}
	});
};
