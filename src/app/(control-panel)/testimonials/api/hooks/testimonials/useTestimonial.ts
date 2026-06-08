import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Testimonial } from '../../types';

export const testimonialQueryKey = (testimonialId: string) => ['ecommerce', 'testimonial', testimonialId];

export const useTestimonial = (testimonialId: string) => {
	return useQuery<Testimonial>({
		queryFn: () => ecommerceApi.getTestimonial(testimonialId),
		queryKey: testimonialQueryKey(testimonialId),
		enabled: !!testimonialId
	});
};
