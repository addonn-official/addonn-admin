import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ProductView = lazy(() => import('./components/views/products/product/ProductView'));
const ProductsView = lazy(() => import('./components/views/products/ProductsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'course',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="course" />
		},
		{
			path: 'course',
			children: [
				{
					path: '',
					element: <ProductsView />
				},
				{
					path: ':productId/:handle?',
					element: <ProductView />
				}
			]
		}
	]
};

export default Route;
