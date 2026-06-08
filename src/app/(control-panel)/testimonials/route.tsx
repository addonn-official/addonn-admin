import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const TestimonialView = lazy(() => import('./components/views/testimonials/testimonial/TestimonialView'));
const TestimonialsView = lazy(() => import('./components/views/testimonials/TestimonialsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'testimonial',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="testimonial" />
		},
		{
			path: 'testimonial',
			children: [
				{
					path: '',
					element: <TestimonialsView />
				},
				{
					path: ':testimonialId/:handle?',
					element: <TestimonialView />
				}
			]
		}
	]
};

export default Route;
