import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DiscussionFormView = lazy(() => import('./components/views/discussion_forms/discussion_form/DiscussionFormView'));
const DiscussionFormsView = lazy(() => import('./components/views/discussion_forms/DiscussionFormsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'discussion-form',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="discussion-form" />
		},
		{
			path: 'discussion-form',
			children: [
				{
					path: '',
					element: <DiscussionFormsView />
				},
				{
					path: ':discussion-form/:handle?',
					element: <DiscussionFormsView />
				}
			]
		}
	]
};

export default Route;
