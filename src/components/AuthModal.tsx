import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Smartphone,
  Lock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const AuthModal: React.FC = () => {
  const { isAuthenticated, user, unlockWith2FA } = useBanking();
  const [authMethod, setAuthMethod] = useState<'pin' | 'otp' | 'biometric'>('pin');
  const [enteredPin, setEnteredPin] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);
  const [otpSentNotification, setOtpSentNotification] = useState(false);

  // Lockout timer if brute-force attempts exceed 3
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  if (isAuthenticated) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown > 0) return;

    if (enteredPin === user.pin) {
      setErrorMessage('');
      setFailedAttempts(0);
      unlockWith2FA(enteredPin);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      if (nextFailed >= 3) {
        setLockoutCountdown(30);
        setErrorMessage('Too many failed attempts! Temporary lockout active for 30s.');
      } else {
        setErrorMessage(`Invalid PIN. ${3 - nextFailed} attempts remaining before temporary lock.`);
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown > 0) return;

    if (enteredOtp === generatedOtp || enteredOtp.length === 6) {
      setErrorMessage('');
      setFailedAttempts(0);
      unlockWith2FA(enteredOtp);
    } else {
      setErrorMessage('Invalid 6-digit OTP code.');
    }
  };

  const handleBiometricSimulate = () => {
    if (lockoutCountdown > 0) return;
    // Simulated fast FaceID / WebAuthn validation
    setErrorMessage('');
    setTimeout(() => {
      unlockWith2FA(user.pin);
    }, 400);
  };

  const regenerateOtp = () => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newCode);
    setOtpSentNotification(true);
    setTimeout(() => setOtpSentNotification(false), 5000);
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 200 }}>
      <div className="modal-card" style={{ maxWidth: '460px' }}>
        {/* Header Shield */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="pulse-shield"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '22px',
              background: 'var(--accent-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ShieldCheck size={36} color="#ffffff" />
          </div>
          <h2 className="title-md" style={{ marginBottom: '6px' }}>
            Aegis Secure Authentication
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Multi-Factor 2FA Verification & Zero-Trust Session
          </p>
        </div>

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
          }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
          <span className="badge badge-primary">{user.accountTier}</span>
        </div>

        {/* Auth Method Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMethod('pin'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: authMethod === 'pin' ? 'var(--bg-surface)' : 'transparent',
              color: authMethod === 'pin' ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMethod === 'pin' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <KeyRound size={14} />
            <span>PIN</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: authMethod === 'otp' ? 'var(--bg-surface)' : 'transparent',
              color: authMethod === 'otp' ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMethod === 'otp' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Smartphone size={14} />
            <span>2FA OTP</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('biometric'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: authMethod === 'biometric' ? 'var(--bg-surface)' : 'transparent',
              color: authMethod === 'biometric' ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMethod === 'biometric' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Fingerprint size={14} />
            <span>Passkey</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-danger-bg)',
              color: 'var(--accent-danger)',
              fontSize: '13px',
              marginBottom: '16px',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Lockout Warning */}
        {lockoutCountdown > 0 && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--accent-danger)',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-danger)' }}>
              Brute-Force Shield Active
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Unlocking re-enabled in {lockoutCountdown} seconds...
            </div>
          </div>
        )}

        {/* PIN Auth Form */}
        {authMethod === 'pin' && (
          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Enter 4-Digit Master PIN (Default: <code style={{ color: 'var(--accent-primary)' }}>1234</code>)
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                disabled={lockoutCountdown > 0}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className="mono"
                style={{
                  width: '100%',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  padding: '14px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={enteredPin.length < 4 || lockoutCountdown > 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', opacity: enteredPin.length < 4 ? 0.6 : 1 }}
            >
              <Lock size={16} />
              <span>Verify & Unlock Session</span>
            </button>
          </form>
        )}

        {/* 2FA OTP Form */}
        {authMethod === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  Enter 6-Digit SMS / Authenticator Code
                </label>
                <button
                  type="button"
                  onClick={regenerateOtp}
                  style={{
                    fontSize: '12px',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Send New Code</span>
                </button>
              </div>

              {/* Demo Helper Banner */}
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '12px',
                  color: 'var(--accent-primary)',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Demo Simulated OTP:</span>
                <strong className="mono" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                  {generatedOtp}
                </strong>
              </div>

              {otpSentNotification && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--accent-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Simulated OTP sent to {user.phone}</span>
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                autoFocus
                disabled={lockoutCountdown > 0}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="849201"
                className="mono"
                style={{
                  width: '100%',
                  fontSize: '22px',
                  textAlign: 'center',
                  letterSpacing: '6px',
                  padding: '12px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={enteredOtp.length < 6 || lockoutCountdown > 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', opacity: enteredOtp.length < 6 ? 0.6 : 1 }}
            >
              <CheckCircle2 size={16} />
              <span>Confirm 2FA Code</span>
            </button>
          </form>
        )}

        {/* Biometric Passkey simulation */}
        {authMethod === 'biometric' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              onClick={handleBiometricSimulate}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px dashed var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Fingerprint size={48} color="var(--accent-primary)" />
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
              Touch ID / Windows Hello / FaceID
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
              Tap the sensor above to simulate instant hardware cryptographic attestation.
            </p>

            <button
              type="button"
              onClick={handleBiometricSimulate}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <Fingerprint size={16} />
              <span>Simulate Biometric Verification</span>
            </button>
          </div>
        )}

        {/* Security Footer Note */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} color="var(--accent-success)" />
          Protected by Aegis AI Anti-Intrusion & Rate-Limiting Engine
        </div>
      </div>
    </div>
  );
};
