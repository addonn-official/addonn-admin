import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { courseBundlesQueryKey } from './useCourseBundles';
export const useCreateCourseBundle = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createCourseBundle,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: courseBundlesQueryKey });
		}
	});
};
