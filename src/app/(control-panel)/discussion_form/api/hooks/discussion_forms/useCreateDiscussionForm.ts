import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { discussion_formsQueryKey } from './useDiscussionForms';
export const useCreateDiscussionForm = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createDiscussionForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: discussion_formsQueryKey });
		}
	});
};
