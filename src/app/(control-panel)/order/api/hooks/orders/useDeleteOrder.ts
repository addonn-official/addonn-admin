import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { orderQueryKey } from './useOrder';
import { ordersQueryKey } from './useOrders';

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteOrder,
		onSuccess: (_, orderId) => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
			queryClient.invalidateQueries({ queryKey: orderQueryKey(orderId) });
		}
	});
};
