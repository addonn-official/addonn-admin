import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { couponsQueryKey } from './useCoupons';
export const useCreateCoupon = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createCoupon,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: couponsQueryKey });
		}
	});
};
