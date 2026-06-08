import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Enrollment } from '../../types';

export const enrollmentQueryKey = (enrollmentId: string) => ['ecommerce', 'enrollment', enrollmentId];

export const useEnrollment = (enrollmentId: string) => {
	return useQuery<Enrollment>({
		queryFn: () => ecommerceApi.getEnrollment(enrollmentId),
		queryKey: enrollmentQueryKey(enrollmentId),
		enabled: !!enrollmentId
	});
};
