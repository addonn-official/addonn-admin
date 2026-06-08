import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { reviewQueryKey } from './useReview';
import { reviewsQueryKey } from './useReviews';

export const useDeleteReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteReview,
		onSuccess: (_, reviewId) => {
			queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
			queryClient.invalidateQueries({ queryKey: reviewQueryKey(reviewId) });
		}
	});
};
