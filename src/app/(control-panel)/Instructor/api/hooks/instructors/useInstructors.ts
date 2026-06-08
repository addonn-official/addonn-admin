import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Instructor } from '../../types';

export const instructorsQueryKey = ['ecommerce', 'instructors'];

export const useInstructors = (page = 1, perPage = 10) => {
	return useQuery<any>({
		queryFn: () => ecommerceApi.getInstructors(page, perPage),
		queryKey: [...instructorsQueryKey, page, perPage]
	});
};

// import { useQuery } from '@tanstack/react-query';
// import { ecommerceApi, ReviewsResponse } from '../../services/ecommerceApiService';

// export const reviewsQueryKey = ['ecommerce', 'reviews'];

// export const useReviews = (page = 1, perPage = 10) => {
// 	return useQuery<ReviewsResponse>({
// 		queryFn: () => ecommerceApi.getReviews(page, perPage),
// 		queryKey: [...reviewsQueryKey, page, perPage],
// 		// keepPreviousData: true
// 	});
// };
