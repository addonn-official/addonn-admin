import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { discussion_formQueryKey } from './useDiscussionForm';
import { discussion_formsQueryKey } from './useDiscussionForms';

export const useDeleteDiscussionForm = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteDiscussionForm,
		onSuccess: (_, discussion_formId) => {
			queryClient.invalidateQueries({ queryKey: discussion_formsQueryKey });
			queryClient.invalidateQueries({ queryKey: discussion_formQueryKey(discussion_formId) });
		}
	});
};
