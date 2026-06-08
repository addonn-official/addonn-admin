import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { instructorsQueryKey } from './useInstructors';
export const useCreateInstructor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createInstructor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: instructorsQueryKey });
		}
	});
};
