import { api } from '@/utils/api';
import { Order, Product, Course, Topic, SubTopic } from '../types';
import { update } from 'lodash';
import { from } from 'stylis';

function toBoolean(value) {
	if (typeof value === "string") {
		return value.toLowerCase() === "true";
	}
	return Boolean(value);
}

export const ecommerceApi = {
	// Products
	getProducts: async (): Promise<Course[]> => {
		let response: Course[] = await api.get('courses?page=1').json();

		// Modify the response here
		response = response['data'];


		return response;
	},

	getProduct: async (productId: string): Promise<Course> => {
		let response: Product = await api.get(`courses/${productId}`).json();
		console.log('------->',response['data'])
		return response['data']
	},

	createProduct: async (course: Omit<Course, 'id'>): Promise<Course> => {
		const formData = new FormData();
		console.log('kk', { course })
		
		if (course.title) formData.append('title', course.title)
		if (course.short_description) formData.append('short_description', course.short_description)
		if (course.long_description) formData.append('long_description', course.long_description)
		formData.append('status', toBoolean(course.status) ? '1' : '0')
		if (toBoolean(course.status)) {
			if (course.user_limit) formData.append('user_limit', course.user_limit)
			if (course.difficulty_level) formData.append('difficulty_level', course.difficulty_level)
			if (course.content_drip_basis) formData.append('content_drip_basis', course.content_drip_basis)
			if (course.course_type) formData.append('course_type', course.course_type)
			if (course.actual_price) formData.append('actual_price', course.actual_price)
			if (course.discounted_price) formData.append('discounted_price', course.discounted_price)
			if (course.number_of_lectures) formData.append('number_of_lectures', course.number_of_lectures)
			if (course.start_date) formData.append('start_date', course.start_date)
			if (course.instructors) formData.append('instructors[]', course.instructors.toString())
			if (course.language) formData.append('language', course.language)
			if (course.benefits) formData.append('benefits', course.benefits)
			if (course.prerequisites) formData.append('prerequisites', course.prerequisites)
			if (course.target_audience) formData.append('target_audience', course.target_audience)
			if (course.duration) formData.append('duration', course.duration)
			// if (course.duration_minutes) formData.append('duration_minutes', course.duration_minutes)
			if (course.validity_period) formData.append('validity_period', course.validity_period)

			if (course.intro_videos) {
				course.intro_videos.map((video: any, index: number) => {
					if (video['url']) formData.append(`intro_videos[${video['platform']}]`, video['url'])
				})
			}
			formData.append('is_comment_enabled', toBoolean(course.is_comment_enabled) ? '1' : '0')
			formData.append('is_certificate_enabled', toBoolean(course.is_certificate_enabled) ? '1' : '0')
			formData.append('is_user_limit_enabled', toBoolean(course.is_user_limit_enabled) ? '1' : '0')
			formData.append('five_star_ratings', course.five_star_ratings)
			formData.append('four_star_ratings', course.four_star_ratings)
			formData.append('three_star_ratings', course.three_star_ratings)
			formData.append('two_star_ratings', course.two_star_ratings)
			formData.append('one_star_ratings', course.one_star_ratings)
			formData.append('ratings', course.ratings)
			formData.append('validity_unit', course.validity_unit)
			formData.append('validity_duration', course.validity_duration)
			formData.append('has_money_back_guarantee', toBoolean(course.has_money_back_guarantee) ? '1' : '0')
			formData.append('is_live', toBoolean(course.is_live) ? '1' : '0')
			formData.append('is_content_drip_enabled', toBoolean(course.is_content_drip_enabled) ? '1' : '0')
		}

		if (course.categories) formData.append('categories[]', course.categories.toString())
		if (course.tags) formData.append('tags[]', course.tags.toString())

		if (course.images[0] && course.images[0].binary) {
			const image = course.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

			formData.append(`thumbnail`, blob, image.name);
		}
		// formData.append('instructors[]',course.[])
		// formData.append('thumbnail',course.thumbnail)
		// console.log('Formaa Data:', formData, course.images);

		if (course.images[0] && course.images[0].binary) {
			const image = course.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

			formData.append(`thumbnail`, blob, image.name);
			// console.log(`Appended image ${index}:`, image.name);
		}
		// console.log('Course inside createProduct:', course);
		// console.log('Form Data:', formData);
		return api
			.post('courses', {
				body: formData
			})
			.json();
	},

	updateProduct: async (course: Course): Promise<Course> => {
		const formData = new FormData();
		console.log('kk', { course })

		if (course.title) formData.append('title', course.title)
		if (course.short_description) formData.append('short_description', course.short_description)
		if (course.long_description) formData.append('long_description', course.long_description)
		formData.append('status', toBoolean(course.status) ? '1' : '0')
		if (toBoolean(course.status)) {
			if (course.user_limit) formData.append('user_limit', course.user_limit)
			if (course.difficulty_level) formData.append('difficulty_level', course.difficulty_level)
			if (course.content_drip_basis) formData.append('content_drip_basis', course.content_drip_basis)
			if (course.course_type) formData.append('course_type', course.course_type)
			if (course.actual_price) formData.append('actual_price', course.actual_price)
			if (course.discounted_price) formData.append('discounted_price', course.discounted_price)
			if (course.number_of_lectures) formData.append('number_of_lectures', course.number_of_lectures)
			if (course.start_date) formData.append('start_date', course.start_date)
			if (course.instructors) {
				// formData.append('instructors[]', course.instructors.toString())
				console.log(course.instructors)
				course.instructors.forEach((tag:any) => formData.append("instructors[]", tag));	
			}
			if (course.language) formData.append('language', course.language)
			if (course.benefits) formData.append('benefits', course.benefits)
			if (course.prerequisites) formData.append('prerequisites', course.prerequisites)
			if (course.target_audience) formData.append('target_audience', course.target_audience)
			if (course.duration) formData.append('duration', course.duration)
			// if (course.duration_minutes) formData.append('duration_minutes', course.duration_minutes)
			if (course.validity_period) formData.append('validity_period', course.validity_period)

			if (course.intro_videos) {
				course.intro_videos.map((video: any, index: number) => {
					if (video['url']) formData.append(`intro_videos[${video['platform']}]`, video['url'])
				})
			}
			formData.append('is_comment_enabled', course.is_comment_enabled == 'true' ? '1' : '0')
			formData.append('is_certificate_enabled', toBoolean(course.is_certificate_enabled) ? '1' : '0')
			formData.append('is_user_limit_enabled', toBoolean(course.is_user_limit_enabled) ? '1' : '0')
			formData.append('five_star_ratings', course.five_star_ratings)
			formData.append('four_star_ratings', course.four_star_ratings)
			formData.append('three_star_ratings', course.three_star_ratings)
			formData.append('two_star_ratings', course.two_star_ratings)
			formData.append('one_star_ratings', course.one_star_ratings)
			formData.append('ratings', course.ratings)
			formData.append('validity_unit', course.validity_unit)
			formData.append('validity_duration', course.validity_duration)
			formData.append('has_money_back_guarantee', toBoolean(course.has_money_back_guarantee) ? '1' : '0')
			formData.append('is_live', toBoolean(course.is_live) ? '1' : '0')
			formData.append('is_content_drip_enabled', toBoolean(course.is_content_drip_enabled) ? '1' : '0')
		}

		if (course.categories) {
			course.categories.forEach(tag => formData.append("categories[]", tag['name']?tag['name']:tag));	
		}
		if (course.tags) {
			course.tags.forEach(tag => formData.append("tags[]", tag['name']?tag['name']:tag));	
		}
		
		if (course.images[0] && course.images[0].binary) {
			const image = course.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

			formData.append(`thumbnail`, blob, image.name);
		}

		return api
			.post(`courses/${course.id}`, {
				body: formData
			})
			.json();
	},

	deleteProduct: async (productId: string) => {
		return api.delete(`courses/${productId}`);
	},

	deleteProducts: async (productIds: string[]) => {
		return api.delete('mock/ecommerce/products', {
			json: productIds
		});
	},
	getTopic: async (topicId: string): Promise<Topic> => {
		let response: Topic = await api.get(`course-topics/${topicId}`).json();
		return response['data'];
	},
	getSubTopic(subTopicId: string): Promise<SubTopic> {
		return api.get(`course-contents/${subTopicId}`).json().then((response: any) => response.data);
	},
	createTopic: async (input: Topic): Promise<Topic> => {
		return api
			.post('course-topics', {
				json: input
			})
			.json();
	},
	updateTopic: async (input: Topic): Promise<Topic> => {
		return api
			.put(`course-topics/${input.id}`, {
				json: input
			})
			.json();
	},
	createSubTopic: async (input: SubTopic): Promise<SubTopic> => {
		const formData = new FormData();
		if (input.category_id) formData.append('category_id', input.category_id)
		if (input.content) formData.append('content', input.content)
		if (input.title) formData.append('title', input.title)
		if (input.topic_id) formData.append('topic_id', input.topic_id)
		if (input.url) formData.append('url', input.url)
		if (input.summary) formData.append('summary', input.summary)
		formData.append('hours', input.hours)
		formData.append('minutes', input.minutes)
		formData.append('seconds', input.seconds)
		return api
			.post('course-contents', {
				body: formData
			})
			.json();
	},
	updateSubTopic: async (input: SubTopic): Promise<SubTopic> => {
		const formData = new FormData();
		console.log('Updating SubTopic with input:', input);
		if (input.category_id) formData.append('category_id', input.category_id)
		if (input.content) formData.append('content', input.content)
		if (input.title) formData.append('title', input.title)
		if (input.topic_id) formData.append('topic_id', input.topic_id)
		if (input.url) formData.append('url', input.url)
		if (input.summary) formData.append('summary', input.summary)
		if (input.document) {
			const document: any = input.document[0];
			// const blob = new Blob([new Uint8Array(document.binary)], { type: document.mimeType });
			formData.append(`document`, document, document.name);
		}
		formData.append('hours', input.hours)
		formData.append('minutes', input.minutes)
		formData.append('seconds', input.seconds)
		return api
			.post(`course-contents/${input.id}`, {
				body: formData
			})
			.json();
	},
	createQuestion: async (input: any): Promise<any> => {
		console.log('Creating question with input:', input);
		return api
			.post('course-quizzes', {
				json: input
			})
			.json();
	},
	updateQuestion: async (input: any): Promise<any> => {
		console.log('Updating question with input:', input);
		return api
			.put(`course-quizzes/${input.id}`, {
				json: input
			})
			.json();
	},
	deleteQuestion: async (input: any): Promise<any> => {
		console.log('Deleting question with input:', input);
		return api
			.delete(`course-quizzes/${input}`)
			.json();
	},
	deleteSubTopic: async (input: any): Promise<any> => {
		console.log('Deleting subtopic with input:', input);
		return api
			.delete(`course-contents/${input}`)
			.json();
	},
	deleteTopic: async (input: any): Promise<any> => {
		console.log('Deleting topic with input:', input);
		return api
			.delete(`course-topics/${input}`)
			.json();
	}

};
