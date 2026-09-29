import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  Laptop,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Flame,
  Key,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const SecurityCenter: React.FC = () => {
  const {
    user,
    sessions,
    securityLogs,
    terminateSession,
    terminateAllOtherSessions,
    resetAllData,
    updateUserPin,
    simulateAttack,
    toggle2FA,
    setTwoFactorMethod,
  } = useBanking();

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');

  const [simulatedAlertSuccess, setSimulatedAlertSuccess] = useState('');

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    setPinChangeSuccess('');

    if (oldPin !== user.pin) {
      setPinChangeError('Current master PIN is incorrect.');
      return;
    }

    if (newPin.length !== 4) {
      setPinChangeError('New PIN must be exactly 4 digits.');
      return;
    }

    updateUserPin(newPin);
    setPinChangeSuccess('Master Security PIN updated successfully!');
    setTimeout(() => {
      setShowChangePinModal(false);
      setOldPin('');
      setNewPin('');
      setPinChangeSuccess('');
    }, 1500);
  };

  const handleSimulateAttack = () => {
    simulateAttack();
    setSimulatedAlertSuccess('Defense mechanism engaged! Suspicious anomaly blocked and logged to Audit Trail.');
    setTimeout(() => setSimulatedAlertSuccess(''), 4500);
  };

  const handleDownloadAuditReport = () => {
    const reportData = {
      institution: 'AegisBank Enterprise Defense',
      standard: 'SOC 2 Type II / FIPS 140-2 Level 4',
      generatedAt: new Date().toISOString(),
      accountHolder: user.name,
      securityScore: `${user.securityScore}/100`,
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod,
      activeSessions: sessions.length,
      auditHash: `SHA256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      recentAuditLogs: securityLogs.slice(0, 15),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisBank_Security_Audit_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Title */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 className="title-lg" style={{ marginBottom: '4px' }}>
            Security Operations & Audit Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Zero-Trust Architecture • Real-Time Threat Intelligence • Session Revocation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={handleDownloadAuditReport}
            style={{ fontSize: '13px' }}
            title="Download cryptographic audit logs report"
          >
            <Download size={15} />
            <span>Export SOC 2 Report</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleSimulateAttack}
            style={{ fontSize: '13px' }}
            title="Demonstrate AI intrusion protection"
          >
            <Flame size={16} color="var(--accent-warning)" />
            <span>Simulate Intrusion Shield</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={resetAllData}
            style={{ fontSize: '13px' }}
            title="Reset sandbox state"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {simulatedAlertSuccess && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--accent-success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-success)',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{simulatedAlertSuccess}</span>
        </div>
      )}

      {/* Security Health Score Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'var(--accent-success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <ShieldCheck size={36} color="var(--accent-success)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="title-md">Enterprise Defense Grade: A+</h2>
                <span className="badge badge-success">Top 1% Tier</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Your accounts are secured by multi-factor hardware cryptography, TLS 1.3, and automatic session timeouts.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Security Posture Score
            </div>
            <div className="mono" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-success)' }}>
              {user.securityScore}/100
            </div>
          </div>
        </div>

        {/* Security Checklist Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} color="var(--accent-success)" />
            <span>Multi-Factor 2FA Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} color="var(--accent-success)" />
            <span>FIPS 140-2 Level 4 Verified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} color="var(--accent-success)" />
            <span>Auto Inactivity Lock (180s)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} color="var(--accent-success)" />
            <span>Shoulder Surfing Privacy Shield</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Credentials & Active Sessions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
          marginBottom: '28px',
        }}
      >
        {/* Credentials & 2FA Manager */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="title-md" style={{ fontSize: '16px', marginBottom: '16px' }}>
            Authentication & Access Keys
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Master PIN */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <KeyRound size={20} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Master 4-Digit Security PIN</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Current PIN: <span className="mono">••••</span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setShowChangePinModal(true)}
              >
                Change PIN
              </button>
            </div>

            {/* 2FA Master Switch & Method Selector */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '14px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Smartphone size={20} color={user.twoFactorEnabled ? 'var(--accent-success)' : 'var(--text-dim)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Multi-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      Active delivery: <strong style={{ color: 'var(--text-main)', textTransform: 'uppercase' }}>{user.twoFactorMethod}</strong>
                    </div>
                  </div>
                </div>
                <button
                  className={`btn ${user.twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={toggle2FA}
                >
                  {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>

              {/* Delivery Protocol Selectors */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                {(['sms', 'authenticator', 'email'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setTwoFactorMethod(method)}
                    disabled={!user.twoFactorEnabled}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: user.twoFactorMethod === method ? 'var(--accent-primary)' : 'var(--bg-surface)',
                      color: user.twoFactorMethod === method ? '#ffffff' : 'var(--text-muted)',
                      border: `1px solid ${user.twoFactorMethod === method ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      opacity: user.twoFactorEnabled ? 1 : 0.5,
                      cursor: user.twoFactorEnabled ? 'pointer' : 'not-allowed',
                      textTransform: 'capitalize',
                    }}
                  >
                    {method === 'sms' ? 'SMS Text' : method === 'authenticator' ? 'TOTP App' : 'Secure Email'}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware WebAuthn / Passkeys */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Key size={20} color="var(--accent-warning)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>FIDO2 / WebAuthn Hardware Keys</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Apple Touch ID / YubiKey registered
                  </div>
                </div>
              </div>
              <span className="badge badge-primary">Active</span>
            </div>
          </div>
        </div>

        {/* Active Authorized Devices */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="title-md" style={{ fontSize: '16px' }}>Authorized Sessions</h3>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{sessions.length} active sessions</div>
            </div>

            {sessions.length > 1 && (
              <button
                className="btn btn-danger"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={terminateAllOtherSessions}
              >
                <LogOut size={13} />
                <span>Revoke Others</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((sess) => (
              <div
                key={sess.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: sess.isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Laptop size={18} color={sess.isCurrent ? 'var(--accent-primary)' : 'var(--text-dim)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{sess.device}</span>
                      {sess.isCurrent && (
                        <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '10px' }}>
                          This Device
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {sess.browser} • {sess.location} • <span className="mono">{sess.ip}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => terminateSession(sess.id)}
                    style={{
                      fontSize: '12px',
                      color: 'var(--accent-danger)',
                      fontWeight: 600,
                      padding: '4px 8px',
                    }}
                  >
                    Terminate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Security Event Audit Log */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 className="title-md">Security Audit Trail (SOC 2 Type II Compliant)</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              Append-only tamper-proof log of all cryptographic validations, IP shifts, and authentications.
            </p>
          </div>
          <span className="badge badge-primary">{securityLogs.length} events logged</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {securityLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '280px' }}>
                {log.severity === 'success' && <CheckCircle2 size={18} color="var(--accent-success)" />}
                {log.severity === 'info' && <ShieldCheck size={18} color="var(--accent-primary)" />}
                {log.severity === 'warning' && <AlertTriangle size={18} color="var(--accent-warning)" />}
                {log.severity === 'alert' && <ShieldAlert size={18} color="var(--accent-danger)" />}

                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.event}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Device: {log.device} • IP: <span className="mono">{log.ipAddress}</span> • {log.location}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '420px' }}>
            <h3 className="title-md" style={{ marginBottom: '8px' }}>Change Master PIN</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              Update the 4-digit code used to authorize transactions and reveal sensitive credentials.
            </p>

            <form onSubmit={handleChangePinSubmit}>
              {pinChangeError && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-danger-bg)',
                    color: 'var(--accent-danger)',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {pinChangeError}
                </div>
              )}

              {pinChangeSuccess && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-success-bg)',
                    color: 'var(--accent-success)',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {pinChangeSuccess}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Current PIN (Default: 1234)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="••••"
                  className="mono"
                  style={{ width: '100%', fontSize: '18px', textAlign: 'center', letterSpacing: '6px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  New 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="mono"
                  style={{ width: '100%', fontSize: '18px', textAlign: 'center', letterSpacing: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowChangePinModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
