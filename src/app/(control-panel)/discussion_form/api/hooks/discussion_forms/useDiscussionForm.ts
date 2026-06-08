import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { DiscussionForm } from '../../types';

export const discussion_formQueryKey = (discussion_formId: string) => ['ecommerce', 'discussion_form', discussion_formId];

export const useDiscussionForm = (discussion_formId: string) => {
	return useQuery<DiscussionForm>({
		queryFn: () => ecommerceApi.getDiscussionForm(discussion_formId),
		queryKey: discussion_formQueryKey(discussion_formId),
		enabled: !!discussion_formId
	});
};
