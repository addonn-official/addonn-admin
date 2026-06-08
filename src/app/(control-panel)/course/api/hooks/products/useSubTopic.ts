import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Topic } from '../../types';

export const subTopicQueryKey = (subtopicId: string) => ['subtopic', subtopicId];

export const useSubTopic = (subtopicId: string) => {
	return useQuery<any>({
		queryFn: () => ecommerceApi.getSubTopic(subtopicId),
		queryKey: subTopicQueryKey(subtopicId),
		enabled: !!subtopicId
	});
};
