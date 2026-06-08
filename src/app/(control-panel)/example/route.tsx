import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ExampleView = lazy(() => import('./components/views/ExampleView'));

/**
 * The Example page route.
 */
const route: FuseRouteItemType = {
	path: 'dashboard',
	element: <ExampleView />
};

export default route;
