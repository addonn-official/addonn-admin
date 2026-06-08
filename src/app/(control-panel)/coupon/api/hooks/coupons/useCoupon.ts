import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Coupon } from '../../types';

export const couponQueryKey = (couponId: string) => ['ecommerce', 'coupon', couponId];

export const useCoupon = (couponId: string) => {
	return useQuery<Coupon>({
		queryFn: () => ecommerceApi.getCoupon(couponId),
		queryKey: couponQueryKey(couponId),
		enabled: !!couponId
	});
};
