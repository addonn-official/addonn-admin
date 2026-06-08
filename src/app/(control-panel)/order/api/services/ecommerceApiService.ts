import { api } from '@/utils/api';
import { Order } from '../types';
import { create } from 'lodash';

export const ecommerceApi = {
	// Orders
	getOrders: async (): Promise<Order[]> => {
		let  response: Order[] = await api.get('orders?page=1').json();

    // Modify the response here
	response = response['data'];
    

    return response;
	},

	getOrder: async (orderId: string): Promise<Order> => {
		let response: Order = await api.get(`orders/${orderId}`).json();
		console.log(response['data'])
		return response['data']
	},
	createRefund: async (refund: any): Promise<any> => {
		return api
			.post(`orders/handle-refund-request`, {
				json: refund
			})
			.json();
	},
	createOrder: async (order: Omit<Order, 'id'>): Promise<Order> => {
        const formData = new FormData();
		console.log('Creating order:', order);
    // Append basic fields
    formData.append('name', order.name);
    formData.append('order', order.order);
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(order.rating);
		console.log(Number.isFinite(ratingNum))
		if (!Number.isFinite(ratingNum)) {
			// fallback to 0 if rating not a number; adjust as needed
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    

    // Append images
     if (order.images[0] && order.images[0].binary) {
			const image = order.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    }
    // Append featured image ID
    if (order.featuredImageId) {
        formData.append('featuredImageId', order.featuredImageId);
    }

		return api
			.post('orders', {
				body: formData
			})
			.json();
	},

	updateOrder: async (order: Order): Promise<Order> => {
        console.log('Updating order:', order);

        const formData = new FormData();

    // Append basic fields
    formData.append('name', order.name);
    formData.append('order', order.order);
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(order.rating);
		if (!Number.isFinite(ratingNum)) {
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    
    formData.append('status', '1');
    
    // formData.append('linkdin', order.linkdin);

	// Append images
    if (order.images[0] && order.images[0].binary) {
			const image = order.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        // const blob = new Blob([image.binary], { type: image.mimeType });
		// const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    };

		return api
			.put(`orders/${order.id}`, {
				body: formData
			})
			.json();
	},

	deleteOrder: async (orderId: string) => {
		return api.delete(`orders/${orderId}`);
	},

	deleteOrders: async (orderIds: string[]) => {
		return api.delete('orders', {
			json: orderIds
		});
	},

};
