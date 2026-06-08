import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productsQueryKey } from './useProducts';
import { productQueryKey } from './useProduct';

interface KyError extends Error {
    response?: {
        json: () => Promise<{ message?: string; }>;
        text: () => Promise<string>;
    };
}

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateProduct,
		onSuccess: (_, product) => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
			queryClient.invalidateQueries({ queryKey: productQueryKey(product.id) });
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
					
					alert(`Course update Failed: ${errorMessage}`);
					console.error('Course update Error:', error);
				}
	});
};
