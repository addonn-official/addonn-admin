import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Testimonial } from '../../types';

export const testimonialsQueryKey = ['ecommerce', 'testimonials'];

export const useTestimonials = () => {
	return useQuery<Testimonial[]>({
		queryFn: ecommerceApi.getTestimonials,
		queryKey: testimonialsQueryKey
	});
};
