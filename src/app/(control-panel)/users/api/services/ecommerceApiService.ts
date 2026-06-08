import { api } from '@/utils/api';
import { User } from '../types';

export const ecommerceApi = {
	// Users
	getUsers: async (): Promise<User[]> => {
		let  response: User[] = await api.get('users?page=1').json();

    // Modify the response here
	response = response['data'];
    

    return response;
	},

	getUser: async (userId: string): Promise<User> => {
		let response: User = await api.get(`users/${userId}`).json();
		console.log(response['data'])
		response['data'].otp_verified = response['data']?.profile?.is_otp_verified;
		response['data'].image = response['data']?.profile?.file?.url;
		return response['data']
	},

	createUser: async (user: Omit<User, 'id'>): Promise<User> => {
		const formData = new FormData();

    // Append basic fields
    formData.append('name', user.name);
    // formData.append('active', user.active.toString());
    // formData.append('display_name', user.display_name);
    // formData.append('bio', user.bio);
    // formData.append('rating_count', user.rating_count);
    // formData.append('review_count', user.review_count);
    // formData.append('students_taught', user.students_taught);
    // formData.append('average_rating', user.average_rating);
	formData.append('status', '1');

	// Append images
    user.images.forEach((image, index) => {
        // const blob = new Blob([image.binary], { type: image.mimeType });
		const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    });

    // Append featured image ID
    if (user.featuredImageId) {
        formData.append('featuredImageId', user.featuredImageId);
    }

		return api
			.post('users', {
				body: formData
			})
			.json();
	},

	updateUser: async (user: User): Promise<User> => {
		console.log('Updating user:', user);

		// const formData = new FormData();

    // Append basic fields
    // formData.append('name', user.name);
    // formData.append('active', user.active.toString());
    // formData.append('display_name', user.display_name);
    // formData.append('bio', user.bio);
    // formData.append('rating_count', user.rating_count);
    // formData.append('review_count', user.review_count);
    // formData.append('students_taught', user.students_taught);
    // formData.append('average_rating', user.average_rating);
	// formData.append('status', user.status);

	// Append images
    // user.images?.forEach((image, index) => {
    //     // const blob = new Blob([image.binary], { type: image.mimeType });
	// 	const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

    //     formData.append(`avatar`, blob, image.name);
    // });

		return api
			.patch(`users/${user.id}`, {
				json: {name:user.name, status: user.status}
			})
			.json();
	},

	deleteUser: async (userId: string) => {
		return api.delete(`users/${userId}`);
	},

	deleteUsers: async (userIds: string[]) => {
		return api.delete('users', {
			json: userIds
		});
	},

};
