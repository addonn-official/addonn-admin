import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const InstructorView = lazy(() => import('./components/views/instructors/instructor/InstructorView'));
const InstructorsView = lazy(() => import('./components/views/instructors/InstructorsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'instructor',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="instructor" />
		},
		{
			path: 'instructor',
			children: [
				{
					path: '',
					element: <InstructorsView />
				},
				{
					path: ':instructorId/:handle?',
					element: <InstructorView />
				}
			]
		}
	]
};

export default Route;
