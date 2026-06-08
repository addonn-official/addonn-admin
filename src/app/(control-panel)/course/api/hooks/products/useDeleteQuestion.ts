import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { subTopicQueryKey } from './useSubTopic';


interface KyError extends Error {
    response?: {
        json: () => Promise<{ message?: string; }>;
        text: () => Promise<string>;
    };
}

export const useDeleteQuestion = (subtopic_id?: string) => {
	const queryClient = useQueryClient();
    

	// Wrap the API call so mutation variables are passed through and we can
	// inspect them in onSuccess to pick the correct course id to invalidate.
	return useMutation({
		mutationFn: ecommerceApi.deleteQuestion,
		onSuccess: (_data, variables) => {
			// Prefer the course_id passed as mutation variable, fallback to hook arg.
            console.log(_data,variables)
			const stid = (variables && (variables as any).courseContent?.id) || subtopic_id;
            console.log('Created question, invalidating topic cache for id:',   stid);
			if (stid) {
				// Invalidate the exact query key used by useProduct
				queryClient.invalidateQueries({ queryKey: subTopicQueryKey(stid) });
			} 
            
		},
		onError: async (error: KyError) => {
            let serverMessage = null;

            // 1. Check for the response property added by ky on an HTTP error
            if (error.response) {
                try {
                    // 2. Await the JSON body extraction
                    const errorBody = await error.response.json();
                    serverMessage = errorBody?.message;
                } catch (e) {
                    // Handle case where response body isn't valid JSON
                    console.error('Failed to parse error body:', e);
                }
            }

            const errorMessage = 
                serverMessage || 
                error.message || 
                'Failed to delete question due to an unknown error.';
            
            alert(`Question delete Failed: ${errorMessage}`);
            console.error('Question delete Error:', error);
        }
	});
};
