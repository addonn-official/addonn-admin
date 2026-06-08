import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
// import { productsQueryKey } from './useProducts';
// import { productQueryKey } from './useProduct';
import { subTopicQueryKey } from './useSubTopic';

interface KyError extends Error {
    response?: {
        json: () => Promise<{ message?: string; }>;
        text: () => Promise<string>;
    };
}

export const useUpdateQuestion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateQuestion,
		onSuccess: (_data, variables) => {
					// Prefer the course_id passed as mutation variable, fallback to hook arg.
					console.log(variables)
					const cid = (variables && (variables as any).courseContent?.id);
					console.log('Updated question, invalidating topic cache for id:',   cid);	
					if (cid) {
						// Invalidate the exact query key used by useProduct
						queryClient.invalidateQueries({ queryKey: subTopicQueryKey(cid) });
					} 
				},
				onError: async (error: KyError) => {
					let serverMessage = null;
					console.log({error});
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
