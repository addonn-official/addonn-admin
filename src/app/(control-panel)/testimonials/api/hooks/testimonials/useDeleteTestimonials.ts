import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { testimonialsQueryKey } from './useTestimonials';

export const useDeleteTestimonials = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteTestimonials,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: testimonialsQueryKey });
		}
	});
};
