import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productQueryKey } from './useProduct';

export const useUpdateTopic = (course_id) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateTopic,
		onSuccess: (_data, variables) => {
			// Prefer the course_id passed as mutation variable, fallback to hook arg.
			const cid = (variables && (variables as any).course_id) || course_id;
			if (cid) {
				// Invalidate the exact query key used by useProduct
				queryClient.invalidateQueries({ queryKey: productQueryKey(cid) });
			} else {
				// Best-effort fallback: invalidate queries whose key contains 'product'
				// (useful if productQueryKey shape differs or hook wasn't given course_id)
				queryClient.invalidateQueries({
					predicate: (query) =>
						Array.isArray(query.queryKey) &&
						query.queryKey.some((k) => typeof k === 'string' && k.toLowerCase().includes('product')),
				});
			}
		},
	});
};
