import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Enrollment } from '../../types';

export const enrollmentsQueryKey = ['ecommerce', 'enrollments'];

export const useEnrollments = () => {
	return useQuery<Enrollment[]>({
		queryFn: ecommerceApi.getEnrollments,
		queryKey: enrollmentsQueryKey
	});
};
