'use client';

import CourseBundlesHeader from '../../ui/courseBundles/CourseBundlesHeader';
import CourseBundlesTable from '../../ui/courseBundles/CourseBundlesTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The courseBundles page.
 */
function CourseBundles() {
	return (
		<Root
			header={<CourseBundlesHeader />}
			content={<CourseBundlesTable />}
		/>
	);
}

export default CourseBundles;
