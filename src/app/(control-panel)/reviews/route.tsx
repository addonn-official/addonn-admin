import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ReviewView = lazy(() => import('./components/views/reviews/review/ReviewView'));
const ReviewsView = lazy(() => import('./components/views/reviews/ReviewsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'review',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="review" />
		},
		{
			path: 'review',
			children: [
				{
					path: '',
					element: <ReviewsView />
				},
				{
					path: ':reviewId/:handle?',
					element: <ReviewView />
				}
			]
		}
	]
};

export default Route;
