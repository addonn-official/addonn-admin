import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const UserView = lazy(() => import('./components/views/users/user/UserView'));
const UsersView = lazy(() => import('./components/views/users/UsersView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'user',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="user" />
		},
		{
			path: 'user',
			children: [
				{
					path: '',
					element: <UsersView />
				},
				{
					path: ':userId/:handle?',
					element: <UserView />
				}
			]
		}
	]
};

export default Route;
