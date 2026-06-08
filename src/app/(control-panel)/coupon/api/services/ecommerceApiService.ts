import { api } from '@/utils/api';
import { Coupon } from '../types';

export const ecommerceApi = {
	// Coupons
	getCoupons: async (): Promise<Coupon[]> => {
		let  response: Coupon[] = await api.get('coupons?page=1').json();

    // Modify the response here
	response = response['data'];
    

    return response;
	},

	getCoupon: async (couponId: string): Promise<Coupon> => {
		let response: Coupon = await api.get(`coupons/${couponId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createCoupon: async (coupon: Omit<Coupon, 'id'>): Promise<Coupon> => {
        console.log('Creating coupon:', coupon);
		// coupon.code = coupon.name; // Assign name to code before sending
		return api
			.post('coupons', {
				json: coupon
			})
			.json();
	},

	updateCoupon: async (coupon: Coupon): Promise<Coupon> => {
        console.log('Updating coupon:', coupon);

		return api
			.put(`coupons/${coupon.id}`, {
				json: coupon
			})
			.json();
	},

	deleteCoupon: async (couponId: string) => {
		return api.delete(`coupons/${couponId}`);
	},

	deleteCoupons: async (couponIds: string[]) => {
		return api.delete('coupons', {
			json: couponIds
		});
	},

};
