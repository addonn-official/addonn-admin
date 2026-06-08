import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authRefreshToken, authSignIn, authOTPSignIn, authSignInWithToken, authSignUp, authUpdateDbUser, logout } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/api';
import { isTokenValid } from './utils/jwtUtils';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { HTTPError } from 'ky';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type OTPVerificationJwtSignInPayload = {
	otp: string;
	xid: string;
	email: string;
	action: string
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	const {
		value: tokenStorageValue,
		setValue: setTokenStorageValue,
		removeValue: removeTokenStorageValue
	} = useLocalStorage<string>('jwt_access_token');

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = tokenStorageValue;
			console.log('Attempting auto login with stored token11	:', accessToken);
			if (accessToken) {
				try {
					console.log('Attempting auto login with stored token');
					const response = await authSignInWithToken(accessToken);
					const session = (await response.json());
					console.log({session})
					if(session.data){
					// session.data['role']='admin'
					// setAuthState({
					// 	authStatus: 'authenticated',
					// 	isAuthenticated: true,
					// 	user: session.data['user']
					// });
					// setTokenStorageValue(session.data['token']);
					setGlobalHeaders({	 Authorization: `Bearer ${accessToken}` });
					return session.data;
					}else return false;
				

				} catch (error) {
					if (error instanceof HTTPError) {
						console.error('Auto login failed:', error.response.status);
					}

					return false;
				}
			}

			return false;
		};

		if (!authState.isAuthenticated) {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else {
					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
		// eslint-disable-next-line
	}, [authState.isAuthenticated]);

	/**
	 * Sign in
	 */
	const signIn: JwtAuthContextType['signIn'] = //useCallback(
		async (credentials) => {
			try {
				const response = await authSignIn(credentials);
				// setAuthState({
				// 	authStatus: 'authenticated',
				// 	isAuthenticated: true,
				// 	user: session.user
				// });
				// setTokenStorageValue(session.access_token);
				// setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
				return response;
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign in failed:', error.response.status);
				}

				throw error;
			}
		}
		// ,
		// [setTokenStorageValue]
	// );

	const signInOTP: JwtAuthContextType['signInOTP'] = useCallback(
		async (credentials) => {
			// console.log({credentials})
			try {
				const session = await authOTPSignIn(credentials);
				// if(session.data)
				console.log({session})
				if(session.data['user']){
					session.data['user']['role']='admin'
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: session.data['user']
					});
					setTokenStorageValue(session.data['token']);
					setGlobalHeaders({ Authorization: `Bearer ${session.data['token']}` });
				}
				return session;
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign in failed:', error.response.status);
				}

				throw error;
			}
		},
		[setTokenStorageValue]
	);

	/**
	 * Sign up
	 */
	// const signUp: JwtAuthContextType['signUp'] = useCallback(
	// 	async (data) => {
	// 		try {
	// 			const session = await authSignUp(data);
	// 			setAuthState({
	// 				authStatus: 'authenticated',
	// 				isAuthenticated: true,
	// 				user: session.user
	// 			});
	// 			setTokenStorageValue(session.access_token);
	// 			setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
	// 			return session;
	// 		} catch (error) {
	// 			if (error instanceof HTTPError) {
	// 				console.error('Sign up failed:', error.response.status);
	// 			}

	// 			throw error;
	// 		}
	// 	},
	// 	[setTokenStorageValue]
	// );

	/**
	 * Sign out
	 */
	const signOut: JwtAuthContextType['signOut'] = useCallback(
		async () => {
			try{
				console.log('Signing out user why why why');
				// await logout();
				removeTokenStorageValue();
				setTokenStorageValue(null);
				removeGlobalHeaders(['Authorization']);
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
				
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign out failed:', error.response.status);
				}

				// throw error;
			}
	}, [removeTokenStorageValue]);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (_user) => {
		try {
			const response = await authUpdateDbUser(_user);
			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error('Update user failed:', error.response.status);
			}

			throw error;
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		try {
			const response = await authRefreshToken();
			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error('Token refresh failed:', error.response.status);
			}

			throw error;
		}
	}, []);

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signIn,
				signInOTP,
				// signUp,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signIn, signInOTP,  signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	/**
	 * Intercept fetch requests to refresh the access token
	 */
	const interceptFetch = useCallback(() => {
		const { fetch: originalFetch } = window;

		window.fetch = async (...args) => {
			const [resource, config] = args;
			try {
				const response = await originalFetch(resource, config);
				const newAccessToken = response.headers.get('New-Access-Token');

				if (newAccessToken) {
					setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
					setTokenStorageValue(newAccessToken);
				}

				if (response.status === 401 && tokenStorageValue) {
					signOut();
					console.error('Unauthorized request. User was signed out. ',tokenStorageValue);
				}

				return response;
			} catch (error) {
				if (error instanceof HTTPError && error.response.status === 401) {
					signOut();
					console.error('Unauthorized request. User was signed out.');
				}

				throw error;
			}
		};
	}, [setTokenStorageValue, signOut]);

	useEffect(() => {
		if (authState.isAuthenticated) {
			interceptFetch();
		}
	}, [authState.isAuthenticated, interceptFetch]);

	return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;
