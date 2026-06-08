import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { User } from '../../types';

export const userQueryKey = (userId: string) => ['ecommerce', 'user', userId];

export const useUser = (userId: string) => {
	return useQuery<User>({
		queryFn: () => ecommerceApi.getUser(userId),
		queryKey: userQueryKey(userId),
		enabled: !!userId
	});
};
