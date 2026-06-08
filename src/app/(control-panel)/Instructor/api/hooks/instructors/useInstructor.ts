import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Instructor } from '../../types';

export const instructorQueryKey = (instructorId: string) => ['ecommerce', 'instructor', instructorId];

export const useInstructor = (instructorId: string) => {
	return useQuery<Instructor>({
		queryFn: () => ecommerceApi.getInstructor(instructorId),
		queryKey: instructorQueryKey(instructorId),
		enabled: !!instructorId
	});
};
