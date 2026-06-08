import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { DiscussionForm } from '../../types';

export const discussion_formsQueryKey = ['ecommerce', 'discussion_forms'];

export const useDiscussionForms = () => {
	return useQuery<DiscussionForm[]>({
		queryFn: ecommerceApi.getDiscussionForms,
		queryKey: discussion_formsQueryKey
	});
};
