'use client';

import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormLabel from '@mui/material/FormLabel';
import { forgotPassVerify, resetPasswordAPI } from '../../../,,/../../../@auth/authApi';
import OTPform from '../../../,,/../../../@auth/services/jwt/components/otpForm';
// import { confirmResetPassword } from '@aws-amplify/auth';

/**
 * Form Validation Schema
 */
const schema = z.object({
    email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

const schemaPhone = z.object({
    phone: z
        .string()
        .nonempty('You must enter last 4 digits of your phone number')
        .regex(/^\d{4}$/, 'Enter exactly 4 digits')
});

const schemaResetPassword = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Please enter your password'),
    confirmPassword: z.string().nonempty('Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const defaultValues = {
    email: ''
};

const defaultValuesPhone = {
    phone: ''
};

const defaultValuesResetPassword = {
    password: '',
    confirmPassword: ''
};

function ForgotPasswordPageForm() {
    const { control, formState, handleSubmit, getValues, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: zodResolver(schema)
    });

    const { control: controlPhone, 
        formState: formStatePhone, 
        handleSubmit: handleSubmitPhone, 
        getValues: getValuesPhone, 
         } = useForm({
        mode: 'onChange',
        defaultValues: defaultValuesPhone,
        resolver: zodResolver(schemaPhone)
    });

    const { control: controlResetPassword, 
        formState: formStateResetPassword, 
        handleSubmit: handleSubmitResetPassword, 
        getValues: getValuesResetPassword, 
         } = useForm({
        mode: 'onChange',
        defaultValues: defaultValuesResetPassword,
        resolver: zodResolver(schemaResetPassword)
    });

    const [xid, setXid] = useState("");
    const [action, setAction] = useState("forgot");
    const [phone, setPhone] = useState("");
    const [resetLink, setResetLink] = useState("");

    const { isValid, dirtyFields, errors } = formState;
    const { isValid: phoneisValid, dirtyFields: phonedirtyFields, errors: phoneerrors } = formStatePhone;
    const { isValid: resetPasswordIsValid, dirtyFields: resetPasswordDirtyFields, errors: resetPasswordErrors } = formStateResetPassword;

    function onSubmit() {
        let input = { email: getValues('email') };
        if (getValuesPhone('phone')) {
            input['last4'] = getValuesPhone('phone');
        }
        forgotPassVerify(input)
            .then((data) => {
                let data2 = data.data;
                console.log('verify successfully', data);
                if (data2['masked_phone']) setPhone(data2['masked_phone']);
                if (data2['x_id']) setXid(data2['x_id']);
                if (data2['action']) setAction(data2['action']);
            })
            .catch((error) => {
                console.error('Error resending OTP', error);
            });
    }

    const handleResetLinkSet = (link) => {
        console.log('reset link', link);
        setResetLink(link);
    };

    function onSubmitResetPassword(data) {
        console.log('Reset Password Data:', data);
        
        resetPasswordAPI({ password: data.password, confirmPassword: data.confirmPassword, resetLink })
        	.then(() => {console.log('Password reset successfully')}
				
			)
        	.catch((error) => console.error('Error resetting password', error));
    }

    return (
        <>
            {!resetLink && !phone && (
                <form
                    name="registerForm"
                    noValidate
                    className="mt-4 flex w-full flex-col justify-center gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    {...field}
                                    id="email"
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors?.email?.message}
                                    required
                                    fullWidth
                                />
                            </FormControl>
                        )}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        aria-label="Register"
                        disabled={_.isEmpty(dirtyFields) || !isValid}
                        type="submit"
                        size="medium"
                    >
                        Verify Email
                    </Button>

                    <Typography
                        className="text-md font-medium"
                        color="text.secondary"
                    >
                        Return to <Link to="/sign-in">sign in</Link>
                    </Typography>
                </form>
            )}

            {phone && !xid && (
                <form
                    name="registerForm"
                    noValidate
                    className="mt-4 flex w-full flex-col justify-center gap-4"
                    onSubmit={handleSubmitPhone(onSubmit)}
                >
                    <Controller
                        name="phone"
                        control={controlPhone}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel htmlFor="phone">Phone</FormLabel>
                                {phone}{' '}
                                <TextField
                                    {...field}
                                    id="phone"
                                    type="text"
                                    inputMode="numeric"
                                    inputProps={{ maxLength: 4, pattern: '\\d{4}' }}
                                    error={!!phoneerrors.phone}
                                    helperText={phoneerrors?.phone?.message}
                                    required
                                    fullWidth
                                />
                            </FormControl>
                        )}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        aria-label="Register"
                        disabled={_.isEmpty(phonedirtyFields) || !phoneisValid}
                        type="submit"
                        size="medium"
                    >
                        Verify Phone
                    </Button>

                    <Typography
                        className="text-md font-medium"
                        color="text.secondary"
                    >
                        Return to <Link to="/sign-in">sign in</Link>
                    </Typography>
                </form>
            )}

            {xid && !resetLink && (
                <OTPform xid={xid} email={getValues('email')} action={action} onResetLinkSet={handleResetLinkSet} />
            )}

            {resetLink && (
                <form
                    name="resetPasswordForm"
                    noValidate
                    className="mt-4 flex w-full flex-col justify-center gap-4"
                    onSubmit={handleSubmitResetPassword(onSubmitResetPassword)}
                >
                    <Controller
                        name="password"
                        control={controlResetPassword}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel htmlFor="password">New Password</FormLabel>
                                <TextField
                                    {...field}
                                    id="password"
                                    type="password"
                                    error={!!resetPasswordErrors.password}
                                    helperText={resetPasswordErrors?.password?.message}
                                    required
                                    fullWidth
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={controlResetPassword}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                <TextField
                                    {...field}
                                    id="confirmPassword"
                                    type="password"
                                    error={!!resetPasswordErrors.confirmPassword}
                                    helperText={resetPasswordErrors?.confirmPassword?.message}
                                    required
                                    fullWidth
                                />
                            </FormControl>
                        )}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        aria-label="Reset Password"
                        disabled={_.isEmpty(resetPasswordDirtyFields) || !resetPasswordIsValid}
                        type="submit"
                        size="medium"
                    >
                        Reset Password
                    </Button>
                </form>
            )}
        </>
    );
}

export default ForgotPasswordPageForm;
