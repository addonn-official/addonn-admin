import { useQuery } from '@tanstack/react-query';
import { ecommerceApi, ReviewsResponse } from '../../services/ecommerceApiService';

export const reviewsQueryKey = ['ecommerce', 'reviews'];

export const useReviews = (page = 1, perPage = 10) => {
    return useQuery<ReviewsResponse>({
        queryFn: () => ecommerceApi.getReviews(page, perPage),
        queryKey: [...reviewsQueryKey, page, perPage],
        // keepPreviousData: true
    });
};