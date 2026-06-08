import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const OrderView = lazy(() => import('./components/views/orders/order/OrderView'));
const OrdersView = lazy(() => import('./components/views/orders/OrdersView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'order',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="order" />
		},
		{
			path: 'order',
			children: [
				{
					path: '',
					element: <OrdersView />
				},
				{
					path: ':orderId/:handle?',
					element: <OrderView />
				}
			]
		}
	]
};

export default Route;
