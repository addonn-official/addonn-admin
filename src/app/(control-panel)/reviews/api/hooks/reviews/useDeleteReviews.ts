import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { reviewsQueryKey } from './useReviews';

export const useDeleteReviews = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteReviews,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
		}
	});
};
