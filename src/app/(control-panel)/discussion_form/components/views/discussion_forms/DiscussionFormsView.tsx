'use client';

import DiscussionFormsHeader from '../../ui/discussion_forms/DiscussionFormsHeader';
import DiscussionFormsTable from '../../ui/discussion_forms/DiscussionFormsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The discussion_forms page.
 */
function DiscussionForms() {
	return (
		<Root
			header={<DiscussionFormsHeader />}
			content={<DiscussionFormsTable />}
		/>
	);
}

export default DiscussionForms;
