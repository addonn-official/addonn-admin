import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Coupon } from '../../types';

export const couponsQueryKey = ['ecommerce', 'coupons'];

export const useCoupons = () => {
	return useQuery<Coupon[]>({
		queryFn: ecommerceApi.getCoupons,
		queryKey: couponsQueryKey
	});
};
