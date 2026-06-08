import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { instructorQueryKey } from './useInstructor';
import { instructorsQueryKey } from './useInstructors';

export const useDeleteInstructor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteInstructor,
		onSuccess: (_, instructorId) => {
			queryClient.invalidateQueries({ queryKey: instructorsQueryKey });
			queryClient.invalidateQueries({ queryKey: instructorQueryKey(instructorId) });
		}
	});
};
