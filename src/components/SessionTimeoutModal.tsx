import React from 'react';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const SessionTimeoutModal: React.FC = () => {
  const { isSessionWarningOpen, sessionTimeoutRemaining, resetInactivityTimer, lockDashboard } = useBanking();

  if (!isSessionWarningOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-warning-bg)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <AlertTriangle size={32} color="var(--accent-warning)" />
        </div>

        <h3 className="title-md" style={{ marginBottom: '8px' }}>
          Session Security Timeout
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          To prevent unauthorized access and protect against shoulder surfing, your banking session will automatically lock in:
        </p>

        <div
          className="mono"
          style={{
            fontSize: '44px',
            fontWeight: 800,
            color: 'var(--accent-danger)',
            marginBottom: '28px',
            letterSpacing: '2px',
          }}
        >
          00:{sessionTimeoutRemaining < 10 ? `0${sessionTimeoutRemaining}` : sessionTimeoutRemaining}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={lockDashboard}
          >
            <Lock size={16} />
            <span>Lock Now</span>
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={resetInactivityTimer}
          >
            <RefreshCw size={16} />
            <span>Keep Active</span>
          </button>
        </div>
      </div>
    </div>
  );
};
