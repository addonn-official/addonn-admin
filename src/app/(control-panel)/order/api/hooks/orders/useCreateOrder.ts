import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { ordersQueryKey } from './useOrders';
export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
		}
	});
};
