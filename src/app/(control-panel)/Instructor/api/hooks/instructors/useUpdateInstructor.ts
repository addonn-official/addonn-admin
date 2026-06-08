import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { instructorsQueryKey } from './useInstructors';
import { instructorQueryKey } from './useInstructor';
import { enqueueSnackbar } from 'notistack';

export const useUpdateInstructor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateInstructor,
		onSuccess: (_, instructor) => {
			queryClient.invalidateQueries({ queryKey: instructorsQueryKey });
			queryClient.invalidateQueries({ queryKey: instructorQueryKey(instructor.id) });
		}
		
	});
};
