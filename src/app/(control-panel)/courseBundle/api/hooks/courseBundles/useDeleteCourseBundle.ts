import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { courseBundleQueryKey } from './useCourseBundle';
import { courseBundlesQueryKey } from './useCourseBundles';

export const useDeleteCourseBundle = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteCourseBundle,
		onSuccess: (_, courseBundleId) => {
			queryClient.invalidateQueries({ queryKey: courseBundlesQueryKey });
			queryClient.invalidateQueries({ queryKey: courseBundleQueryKey(courseBundleId) });
		}
	});
};
