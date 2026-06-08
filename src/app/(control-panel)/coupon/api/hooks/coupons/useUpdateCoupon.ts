import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { couponsQueryKey } from './useCoupons';
import { couponQueryKey } from './useCoupon';

export const useUpdateCoupon = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateCoupon,
		onSuccess: (_, coupon) => {
			queryClient.invalidateQueries({ queryKey: couponsQueryKey });
			queryClient.invalidateQueries({ queryKey: couponQueryKey(coupon.id) });
		}
	});
};
