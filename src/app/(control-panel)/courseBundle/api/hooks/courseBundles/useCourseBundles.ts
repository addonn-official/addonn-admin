import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { CourseBundle } from '../../types';

export const courseBundlesQueryKey = ['ecommerce', 'courseBundles'];

export const useCourseBundles = () => {
	return useQuery<CourseBundle[]>({
		queryFn: ecommerceApi.getCourseBundles,
		queryKey: courseBundlesQueryKey
	});
};
