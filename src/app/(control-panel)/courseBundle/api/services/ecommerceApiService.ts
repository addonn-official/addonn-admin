import { api } from '@/utils/api';
import { CourseBundle } from '../types';

function toBoolean(value) {
	if (typeof value === "string") {
		return value.toLowerCase() === "true";
	}
	return Boolean(value);
}

export const ecommerceApi = {
	// CourseBundles
	getCourseBundles: async (): Promise<CourseBundle[]> => {
		let response: CourseBundle[] = await api.get('course-bundles?page=1').json();

		// Modify the response here
		response = response['data'];


		return response;
	},

	getCourseBundle: async (courseBundleId: string): Promise<CourseBundle> => {
		let response: CourseBundle = await api.get(`course-bundles/${courseBundleId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createCourseBundle: async (courseBundle: Omit<CourseBundle, 'id'>): Promise<CourseBundle> => {
		const formData = new FormData();
		console.log('Creating courseBundle:', courseBundle);
		formData.append('name', courseBundle.name);
		if (courseBundle.courses) {
			// console.log(courseBundle.courses)
			courseBundle.courses.forEach((tag: any) => formData.append("course_ids[]", tag));
		}
		if (courseBundle.price) formData.append('price', courseBundle.price)
		if (courseBundle.discounted_price) formData.append('discounted_price', courseBundle.discounted_price)
		formData.append('status', toBoolean(courseBundle.status) ? '1' : '0')

		if (courseBundle.images[0] && courseBundle.images[0].binary) {
			const image = courseBundle.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });
			formData.append(`thumbnail`, blob, image.name);
		}

		return api
			.post('course-bundles', {
				body: formData
			})
			.json();
	},

	updateCourseBundle: async (courseBundle: CourseBundle): Promise<CourseBundle> => {
		console.log('Updating courseBundle:', courseBundle);

		const formData = new FormData();

		formData.append('name', courseBundle.name);
		if (courseBundle.courses) {
			courseBundle.courses.forEach((tag: any) => formData.append("course_ids[]", tag));
		}
		if (courseBundle.price) formData.append('price', courseBundle.price)
		if (courseBundle.discounted_price) formData.append('discounted_price', courseBundle.discounted_price)
		formData.append('status', toBoolean(courseBundle.status) ? '1' : '0')
		if (courseBundle.images[0] && courseBundle.images[0].binary) {
			const image = courseBundle.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });
			formData.append(`thumbnail`, blob, image.name);
		}

		return api
			.post(`course-bundles/${courseBundle.id}`, {
				body: formData
			})
			.json();
	},

	deleteCourseBundle: async (courseBundleId: string) => {
		return api.delete(`course-bundles/${courseBundleId}`);
	},

	deleteCourseBundles: async (courseBundleIds: string[]) => {
		return api.delete('course-bundles', {
			json: courseBundleIds
		});
	},

};
