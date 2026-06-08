'use client';

import TestimonialsHeader from '../../ui/testimonials/TestimonialsHeader';
import TestimonialsTable from '../../ui/testimonials/TestimonialsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The testimonials page.
 */
function Testimonials() {
	return (
		<Root
			header={<TestimonialsHeader />}
			content={<TestimonialsTable />}
		/>
	);
}

export default Testimonials;
