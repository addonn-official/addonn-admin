import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { courseBundlesQueryKey } from './useCourseBundles';

export const useDeleteCourseBundles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteCourseBundles,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: courseBundlesQueryKey });
		}
	});
};
