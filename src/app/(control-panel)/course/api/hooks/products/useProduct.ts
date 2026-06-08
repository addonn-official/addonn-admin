import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Course } from '../../types';

export const productQueryKey = (productId: string) => [ 'product', productId];

export const useProduct = (productId: string) => {
	return useQuery<Course>({
		queryFn: () => ecommerceApi.getProduct(productId),
		queryKey: productQueryKey(productId),
		enabled: !!productId,
		// staleTime: 0,           // Data is considered "old" immediately
        // gcTime: 0,              // Garbage collect (delete) the data as soon as the component unmounts
        // refetchOnMount: 'always', // Force a refetch every time the component loads
	});
};
