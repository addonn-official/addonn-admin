import { api } from '@/utils/api';
import { Testimonial } from '../types';
function toBoolean(value) {
	if (typeof value === "string") {
		return value.toLowerCase() === "true";
	}
	return Boolean(value);
}
export const ecommerceApi = {
	// Testimonials
	getTestimonials: async (): Promise<Testimonial[]> => {
		let response: Testimonial[] = await api.get('testimonials?page=1').json();

		// Modify the response here
		response = response['data'];


		return response;
	},

	getTestimonial: async (testimonialId: string): Promise<Testimonial> => {
		let response: Testimonial = await api.get(`testimonials/${testimonialId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createTestimonial: async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
		const formData = new FormData();
		console.log('Creating testimonial:', testimonial);
		// Append basic fields
		formData.append('name', testimonial.name);
		formData.append('review', testimonial.review);
		formData.append('rating', testimonial.rating);
		formData.append('script', testimonial.script);
		formData.append('type_id', testimonial.courses?testimonial.courses:testimonial?.course['id']);
		formData.append('type', 'courses');
		formData.append('is_home', testimonial.is_home?'1':'0');

		// Append images
		if (testimonial.images[0] && testimonial.images[0].binary) {
			const image = testimonial.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

			formData.append(`thumbnail`, blob, image.name);
		}

		if (testimonial.videos[0] && testimonial.videos[0].binary) {
			const video = testimonial.videos[0];
			const blob = new Blob([new Uint8Array(video.binary)], { type: video.mimeType });

			formData.append(`video`, blob, video.name);
		}


		return api
			.post('testimonials', {
				body: formData
			})
			.json();
	},

	updateTestimonial: async (testimonial: Testimonial): Promise<Testimonial> => {
		console.log('Updating testimonial:', testimonial);

		const formData = new FormData();

		formData.append('name', testimonial.name);
		formData.append('review', testimonial.review);
		formData.append('rating', testimonial.rating);
		formData.append('script', testimonial.script);
		formData.append('type_id', testimonial.courses?testimonial.courses:testimonial?.course['id']);
		
		formData.append('type', 'courses');
		formData.append('is_home', testimonial.is_home?'1':'0');

		if (testimonial.images[0] && testimonial.images[0].binary) {
			const image = testimonial.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

			formData.append(`thumbnail`, blob, image.name);
		}

		if (testimonial.videos && testimonial.videos[0] && testimonial.videos[0].binary) {
			const video = testimonial.videos[0];
			const blob = new Blob([new Uint8Array(video.binary)], { type: video.mimeType });

			formData.append(`video`, blob, video.name);
		}


		return api
			.post(`testimonials/${testimonial.id}`, {
				body: formData
			})
			.json();
	},

	deleteTestimonial: async (testimonialId: string) => {
		return api.delete(`testimonials/${testimonialId}`);
	},

	deleteTestimonials: async (testimonialIds: string[]) => {
		return api.delete('testimonials', {
			json: testimonialIds
		});
	},

};
