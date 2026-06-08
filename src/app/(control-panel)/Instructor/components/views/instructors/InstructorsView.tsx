'use client';

import InstructorsHeader from '../../ui/instructors/InstructorsHeader';
import InstructorsTable from '../../ui/instructors/InstructorsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The instructors page.
 */
function Instructors() {
	return (
		<Root
			header={<InstructorsHeader />}
			content={<InstructorsTable />}
		/>
	);
}

export default Instructors;
