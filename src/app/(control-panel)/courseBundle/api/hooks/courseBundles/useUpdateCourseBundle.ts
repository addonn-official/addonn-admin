import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { courseBundlesQueryKey } from './useCourseBundles';
import { courseBundleQueryKey } from './useCourseBundle';

export const useUpdateCourseBundle = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateCourseBundle,
		onSuccess: (_, courseBundle) => {
			queryClient.invalidateQueries({ queryKey: courseBundlesQueryKey });
			queryClient.invalidateQueries({ queryKey: courseBundleQueryKey(courseBundle.id) });
		}
	});
};
