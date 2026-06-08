'use client';

import UsersHeader from '../../ui/users/UsersHeader';
import UsersTable from '../../ui/users/UsersTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The users page.
 */
function Users() {
	return (
		<Root
			header={<UsersHeader />}
			content={<UsersTable />}
		/>
	);
}

export default Users;
