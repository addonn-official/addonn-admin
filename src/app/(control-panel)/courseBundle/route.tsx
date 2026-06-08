import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CourseBundleView = lazy(() => import('./components/views/courseBundles/courseBundle/CourseBundleView'));
const CourseBundlesView = lazy(() => import('./components/views/courseBundles/CourseBundlesView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'course-bundle',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="courseBundle" />
		},
		{
			path: 'course-bundle',
			children: [
				{
					path: '',
					element: <CourseBundlesView />
				},
				{
					path: ':courseBundleId/:handle?',
					element: <CourseBundleView />
				}
			]
		}
	]
};

export default Route;
