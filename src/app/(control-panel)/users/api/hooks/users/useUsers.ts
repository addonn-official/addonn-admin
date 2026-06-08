import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { User } from '../../types';

export const usersQueryKey = ['ecommerce', 'users'];

export const useUsers = () => {
	return useQuery<User[]>({
		queryFn: ecommerceApi.getUsers,
		queryKey: usersQueryKey
	});
};
