'use client';

import EnrollmentsHeader from '../../ui/enrollments/EnrollmentsHeader';
import EnrollmentsTable from '../../ui/enrollments/EnrollmentsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The enrollments page.
 */
function Enrollments() {
	return (
		<Root
			header={<EnrollmentsHeader />}
			content={<EnrollmentsTable />}
		/>
	);
}

export default Enrollments;
