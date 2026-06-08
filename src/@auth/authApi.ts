import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import api from '@/utils/api';

// type SignInAuthResponse = {
// 	// user: User;
// 	// access_token: string;
// 	x_id: string,
// 	x_action: string
// };

// type AuthResponse = {
// 	user: User;
// 	access_token: string;
// };

type AuthResponse = {
	status: User;
	message: string;
	data: Object
};

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
	return api.post('mock/auth/refresh', {
		retry: 0 // Don't retry refresh token requests
	});
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<Response> {
	return api.get('profile', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
}

/**
 * Sign in
 */
export async function authSignIn(credentials: { email: string; password: string }): Promise<AuthResponse> {
	return api
		.post('admin/login', {
			json: credentials
		})
		.json();
}

export async function authOTPSignIn(credentials: { otp: string }): Promise<AuthResponse> {
	return api
		.post('otp-verification', {
			json: {email: credentials['email'], otp: credentials['otp']},
			headers: {
			'X-id': credentials['xid'],
			'X-action': credentials['action']
		}
		})
		.json();
}

export async function logout(): Promise<AuthResponse> {
	return api
		.delete('profile/logout', {
			json: {}
		})
		.json();
}

export async function resendOTP(credentials: { email: string; action: string}): Promise<AuthResponse> {
	return api
		.post('admin/resend-otp', {
			json: { email: credentials['email'],type: credentials['action'] },
		})
		.json();
}

export async function forgotPassVerify(credentials: { email: string; last4?: string}): Promise<AuthResponse> {
	return api
		.post('admin/forgot-password', {
			json: credentials,
		})
		.json();
}

export async function resetPasswordAPI(data: { password: string; confirmPassword: string; resetLink: string}): Promise<AuthResponse> {
	return api
		.post('admin'+data.resetLink, {
			json: { new_password: data.password, new_password_confirmation: data.confirmPassword },
		})
		.json();
}

/**
 * Sign up
 */
export async function authSignUp(data: {
	displayName: string;
	email: string;
	password: string;
}): Promise<AuthResponse> {
	return api
		.post('mock/auth/sign-up', {
			json: data
		})
		.json();
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<User> {
	return api.get(`mock/auth/user/${userId}`).json();
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
	return api.get(`mock/auth/user-by-email/${email}`).json();
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<Response> {
	return api.put(`mock/auth/user/${user.id}`, {
		json: UserModel(user)
	});
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api
		.post('mock/users', {
			json: UserModel(user)
		})
		.json();
}
