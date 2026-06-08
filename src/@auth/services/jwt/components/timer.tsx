import React, { useEffect, useState } from 'react';

interface OTPTimerProps {
  duration?: number; // seconds (default: 60)
  resendDelay?: number; // seconds before resend is enabled (default: 20)
  onExpire?: () => void;
  onResend?: () => void;
}

const OTPTimer: React.FC<OTPTimerProps> = ({
  duration = 60,
  resendDelay = 20,
  onExpire,
  onResend,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime === duration - resendDelay) {
          setResendEnabled(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, duration, resendDelay, onExpire]);

  const handleResend = () => {
    if (!resendEnabled) return;
    onResend?.();
    setTimeLeft(duration);
    setResendEnabled(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-gray-700 text-sm flex flex-col items-center gap-2">
      {timeLeft > 0 ? (
        <span>
          OTP expires in <b>{formatTime(timeLeft)}</b>
        </span>
      ) : (
        <span className="text-red-500 font-semibold">OTP expired</span>
      )}

      <button
        onClick={handleResend}
        disabled={!resendEnabled}
        className={`text-blue-600 underline ${
          resendEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        Resend OTP
      </button>
    </div>
  );
};

export default OTPTimer;
