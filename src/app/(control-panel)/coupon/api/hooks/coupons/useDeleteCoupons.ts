import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { couponsQueryKey } from './useCoupons';

export const useDeleteCoupons = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteCoupons,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: couponsQueryKey });
		}
	});
};
