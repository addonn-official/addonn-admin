import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import Button from '@mui/material/Button';
import useJwtAuth from '../useJwtAuth';
import OTPTimer from './timer'
import { resendOTP } from '../../../authApi';
import { useSnackbar } from 'notistack';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

const OTPschema = z.object({
	otp: z
		.string()
		.nonempty('Please enter your OTP')
});

type FormType = z.infer<typeof schema>;
type OTPFormType = z.infer<typeof OTPschema>;

const defaultValues: FormType = {
	email: '',
	password: '',
	remember: true
};

const OTPdefaultValues: OTPFormType = {
	otp: ''
}

function JwtSignInForm() {
	const { signIn, signInOTP } = useJwtAuth();
	const [xid, setXid] = useState("");
	const [action, setAction] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const {
		control,
		formState,
		handleSubmit,
		setValue,
		setError,
		getValues
		} = useForm<FormType>({
			mode: 'onChange',
			defaultValues,
			resolver: zodResolver(schema),
		});

	const {
		control: otpControl,
		formState: otpFormState,
		handleSubmit: otpHandleSubmit,
		setValue: otpSetValue,
		setError: otpSetError,
		getValues: otpGetValues
		} = useForm<OTPFormType>({
			mode: 'onChange',
			defaultValues: OTPdefaultValues,
			resolver: zodResolver(OTPschema),
		});

	const { isValid, dirtyFields, errors } = formState;
	const { isValid: OTPisValid, dirtyFields: OTPdirtyFields, errors: OTPerrors } = otpFormState;

	useEffect(() => {
		console.log({xid})
	}, [xid]);

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		signIn({
			email,
			password
		})
		.then((data) => {
        console.log({ data },data.data);
		let data2 = data.data
		console.log({data2})
        setXid(data2['x_id']);
		setAction(data2['x_action']);
      })
		.catch( async (error) => {
			console.log({error},error.message);
			const errorData = await error.response.json();
			console.error('Error during sign in:', errorData);
			// const errorData = error?.data as {
			// 	type: 'email' | 'password' | 'remember' | `root.${string}` | 'root';
			// 	message: string;
			// }[];

			// errorData?.forEach?.((err) => {
			// 	setError(err.type, {
			// 		type: 'manual',
			// 		message: err.message
			// 	});
			// });
			enqueueSnackbar(errorData.message, {
					variant: 'error'
				});
		});
	}

	function onSubmitOTP(formData: OTPFormType) {
		const { otp } = formData;
		const email = getValues('email');
		signInOTP({
			xid,
			email,
			action,
			otp
		})
		.catch(async (error) => {
			const errorData = await error.response.json();
			enqueueSnackbar(errorData.message, {
					variant: 'error'
				});
		});
	}

	const handleOTPExpire = () => {
    	console.log('OTP expired — show resend option');
  	};

	const handleResend = () => {
		console.log('Resend OTP requested');
		resendOTP({email: getValues('email'), action})
		.then((data) => {
			let data2 = data.data
			console.log('OTP resent successfully', data);
			setXid(data2['x_id']);
		})
		.catch((error) => {
			console.error('Error resending OTP', error);
		});
	};


	return (
		<>
		{!xid && <form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/forgot-password"
				>
					Forgot password?
				</Link>
			</div>

			<Button
				variant="contained"
				color="secondary"
				className="mt-4 w-full"
				aria-label="Get OTP"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Get OTP
			</Button>
		</form>}

		{
            xid && <form
            name="otpForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={otpHandleSubmit(onSubmitOTP)}
          >
            <Controller
              name="otp"
              control={otpControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="OTP"
                  autoFocus
                  type="input"
                  error={!!OTPerrors.otp}
                  helperText={OTPerrors?.otp?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
			<OTPTimer 
				duration={60}
				resendDelay={20}
				onExpire={handleOTPExpire}
				onResend={handleResend}
				
			/>
            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(OTPdirtyFields) || !OTPisValid}
              type="submit"
              size="large"
            >
              Sign in
            </Button>
          </form>
          }
		</>
	);
}

export default JwtSignInForm;
