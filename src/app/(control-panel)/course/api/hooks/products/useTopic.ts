import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Topic } from '../../types';

export const topicQueryKey = (topicId: string) => ['topic', topicId];

export const useTopic = (topicId: string) => {
	return useQuery<Topic>({
		queryFn: () => ecommerceApi.getTopic(topicId),
		queryKey: topicQueryKey(topicId),
		enabled: !!topicId
	});
};
