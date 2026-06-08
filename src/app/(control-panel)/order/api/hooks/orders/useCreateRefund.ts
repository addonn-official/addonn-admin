import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { ordersQueryKey } from './useOrders';
export const useCreateRefund = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createRefund,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
		}
	});
};
