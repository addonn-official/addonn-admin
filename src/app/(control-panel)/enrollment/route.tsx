import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const EnrollmentView = lazy(() => import('./components/views/enrollments/enrollment/EnrollmentView'));
const EnrollmentsView = lazy(() => import('./components/views/enrollments/EnrollmentsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'enrollment',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="enrollment" />
		},
		{
			path: 'enrollment',
			children: [
				{
					path: '',
					element: <EnrollmentsView />
				},
				{
					path: ':enrollmentId/:handle?',
					element: <EnrollmentView />
				}
			]
		}
	]
};

export default Route;
