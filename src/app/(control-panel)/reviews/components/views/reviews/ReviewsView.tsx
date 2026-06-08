'use client';

import ReviewsHeader from '../../ui/reviews/ReviewsHeader';
import ReviewsTable from '../../ui/reviews/ReviewsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The reviews page.
 */
function Reviews() {
	return (
		<Root
			header={<ReviewsHeader />}
			content={<ReviewsTable />}
		/>
	);
}

export default Reviews;
