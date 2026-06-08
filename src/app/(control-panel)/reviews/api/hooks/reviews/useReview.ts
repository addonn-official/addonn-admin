import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Review } from '../../types';

export const reviewQueryKey = (reviewId: string) => ['ecommerce', 'review', reviewId];

export const useReview = (reviewId: string) => {
	return useQuery<Review>({
		queryFn: () => ecommerceApi.getReview(reviewId),
		queryKey: reviewQueryKey(reviewId),
		enabled: !!reviewId
	});
};
