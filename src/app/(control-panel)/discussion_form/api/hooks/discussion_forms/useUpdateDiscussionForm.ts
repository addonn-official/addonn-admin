import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { discussion_formsQueryKey } from './useDiscussionForms';
import { discussion_formQueryKey } from './useDiscussionForm';

export const useUpdateDiscussionForm = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateDiscussionForm,
		onSuccess: (_, discussion_form) => {
			queryClient.invalidateQueries({ queryKey: discussion_formsQueryKey });
			queryClient.invalidateQueries({ queryKey: discussion_formQueryKey(discussion_form.id) });
		}
	});
};
