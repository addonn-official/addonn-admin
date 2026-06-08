import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { CourseBundle } from '../../types';

export const courseBundleQueryKey = (courseBundleId: string) => ['ecommerce', 'courseBundle', courseBundleId];

export const useCourseBundle = (courseBundleId: string) => {
	return useQuery<CourseBundle>({
		queryFn: () => ecommerceApi.getCourseBundle(courseBundleId),
		queryKey: courseBundleQueryKey(courseBundleId),
		enabled: !!courseBundleId
	});
};
