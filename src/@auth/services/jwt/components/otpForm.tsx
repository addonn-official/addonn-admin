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

/**
 * Form Validation Schema
 */

const OTPschema = z.object({
    otp: z
        .string()
        .nonempty('Please enter your OTP')
});

type OTPFormType = z.infer<typeof OTPschema>;

const OTPdefaultValues: OTPFormType = {
    otp: ''
}

const OTPform = ({
  xid,
  email,
  action,
  onResetLinkSet
}) => {
    const { signIn, signInOTP } = useJwtAuth();
    // const [xid, setXid] = useState("");
    // const [action, setAction] = useState("");
    
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

    const { isValid: OTPisValid, dirtyFields: OTPdirtyFields, errors: OTPerrors } = otpFormState;

    useEffect(() => {
        console.log({xid})
    }, [xid]);

    function onSubmitOTP(formData: OTPFormType) {
        const { otp } = formData;
        // const email = getValues('email');
        signInOTP({
            xid,
            email,
            action,
            otp
        })
        .then((data) => {
            let data2 = data.data
            console.log('reset link', data);
            onResetLinkSet(data2['reset_link']);
        })
        .catch((error) => {
            const errorData = error?.data as {
                type: 'otp' | `root.${string}` | 'root';
                message: string;
            }[];

            errorData?.forEach?.((err) => {
                otpSetError(err.type, {
                    type: 'manual',
                    message: err.message
                });
            });
        });
    }

    const handleOTPExpire = () => {
        console.log('OTP expired — show resend option');
    };

    const handleResend = () => {
        console.log('Resend OTP requested');
        resendOTP({email, action})
        .then((data) => {
            let data2 = data.data
            console.log('OTP resent successfully', data);
            xid=data2['x_id'];
        })
        .catch((error) => {
            console.error('Error resending OTP', error);
        });
    };

    return (
        <>
        <form
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
        
        </>
    );
}

export default OTPform;
