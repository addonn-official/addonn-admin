import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Course } from '../../types';

export const productsQueryKey = ['ecommerce', 'products'];

export const useProducts = () => {
	return useQuery<Course[]>({
		queryFn: ecommerceApi.getProducts,
		queryKey: productsQueryKey
	});
};
