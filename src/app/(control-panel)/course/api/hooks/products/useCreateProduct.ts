import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productsQueryKey } from './useProducts';
interface KyError extends Error {
    response?: {
        json: () => Promise<{ message?: string; }>;
        text: () => Promise<string>;
    };
}

export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
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
                'Failed to create product due to an unknown error.';
            
            alert(`Product Creation Failed: ${errorMessage}`);
            console.error('Product Creation Error:', error);
        }
	});
};
