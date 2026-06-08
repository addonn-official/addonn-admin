import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { couponQueryKey } from './useCoupon';
import { couponsQueryKey } from './useCoupons';

export const useDeleteCoupon = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteCoupon,
		onSuccess: (_, couponId) => {
			queryClient.invalidateQueries({ queryKey: couponsQueryKey });
			queryClient.invalidateQueries({ queryKey: couponQueryKey(couponId) });
		}
	});
};
