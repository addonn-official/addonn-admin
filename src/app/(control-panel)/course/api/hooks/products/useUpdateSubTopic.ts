import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';

import { topicQueryKey } from './useTopic';

interface KyError extends Error {
    response?: {
        json: () => Promise<{ message?: string; }>;
        text: () => Promise<string>;
    };
}

export const useUpdateSubTopic = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateSubTopic,
		onSuccess: (_data, variables) => {
					// Prefer the course_id passed as mutation variable, fallback to hook arg.
					console.log(variables)
					const cid = (variables && (variables as any).topic_id);
					if (cid) {
						// Invalidate the exact query key used by useProduct
						queryClient.invalidateQueries({ queryKey: topicQueryKey(cid) });
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
				onError: async (error: KyError) => {
					let serverMessage = null;
		
					// 1. Check for the response property added by ky on an HTTP error
					if (error.response) {
						try {
							// 2. Await the JSON body extraction
							const errorBody = await error.response.json();
							serverMessage = errorBody?.message;
						} catch (e) {
							// Handle case where response body isn't valid JSON
							console.error('Failed to parse error body:', e);
						}
					}
		
					const errorMessage = 
						serverMessage || 
						error.message || 
						'Failed to create topic due to an unknown error.';
					
					alert(`Topic Creation Failed: ${errorMessage}`);
					console.error('Topic Creation Error:', error);
				}
	});
};
