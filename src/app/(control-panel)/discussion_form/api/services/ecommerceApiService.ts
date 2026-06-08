import { api } from '@/utils/api';
import { DiscussionForm } from '../types';

export const ecommerceApi = {
	// DiscussionForms
	getDiscussionForms: async (): Promise<DiscussionForm[]> => {
		let  response: DiscussionForm[] = await api.get('comments/by-couses?page=1').json();

    // Modify the response here
	response = response['data'];
    

    return response;
	},

	getDiscussionForm: async (discussion_formId: string): Promise<DiscussionForm> => {
		let response: DiscussionForm = await api.get(`comments/${discussion_formId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createDiscussionForm: async (discussion_form: Omit<DiscussionForm, 'id'>): Promise<DiscussionForm> => {
        console.log('Creating discussion_form:', discussion_form);
		// discussion_form.code = discussion_form.name; // Assign name to code before sending
		return api
			.post('comments', {
				json: discussion_form
			})
			.json();
	},

	updateDiscussionForm: async (discussion_form: DiscussionForm): Promise<DiscussionForm> => {
        console.log('Updating discussion_form:', discussion_form);

		return api
			.put(`comments/${discussion_form.id}`, {
				json: discussion_form
			})
			.json();
	},

	deleteDiscussionForm: async (discussion_formId: string) => {
		return api.delete(`comments/${discussion_formId}`);
	},

	deleteDiscussionForms: async (discussion_formIds: string[]) => {
		return api.delete('comments', {
			json: discussion_formIds
		});
	},

};
