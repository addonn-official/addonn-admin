'use client';

import CouponsHeader from '../../ui/coupons/CouponsHeader';
import CouponsTable from '../../ui/coupons/CouponsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The coupons page.
 */
function Coupons() {
	return (
		<Root
			header={<CouponsHeader />}
			content={<CouponsTable />}
		/>
	);
}

export default Coupons;
