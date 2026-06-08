import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import ClassicSignInPageView from './components/views/ClassicSignInPageView';
import ClassicForgotPasswordPageView from './components/views/ClassicForgotPasswordPageView'
import SignUpPageView from './components/views/SignUpPageView';
import SignOutPageView from './components/views/SignOutPageView';

const route: FuseRouteItemType = {
	children: [
		{
			path: 'sign-in',
			element: <ClassicSignInPageView />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			},
			auth: authRoles.onlyGuest // []
		},
		{
			path: 'forgot-password',
			element: <ClassicForgotPasswordPageView />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			},
			auth: authRoles.onlyGuest // []
		},
		{
			path: 'sign-up',
			element: <SignUpPageView />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			},
			auth: authRoles.onlyGuest
		},
		{
			path: 'sign-out',
			element: <SignOutPageView />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			},
			auth: null
		}
	]
};

export default route;
