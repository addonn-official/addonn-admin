import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CouponView = lazy(() => import('./components/views/coupons/coupon/CouponView'));
const CouponsView = lazy(() => import('./components/views/coupons/CouponsView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'coupon',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="coupon" />
		},
		{
			path: 'coupon',
			children: [
				{
					path: '',
					element: <CouponsView />
				},
				{
					path: ':couponId/:handle?',
					element: <CouponView />
				}
			]
		}
	]
};

export default Route;
