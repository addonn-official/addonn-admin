import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { reviewsQueryKey } from './useReviews';
export const useCreateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
		}
	});
};
