import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { reviewsQueryKey } from './useReviews';
import { reviewQueryKey } from './useReview';

export const useUpdateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateReview,
		onSuccess: (_, review) => {
			queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
			queryClient.invalidateQueries({ queryKey: reviewQueryKey(review.id) });
		}
	});
};
