import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Lock,
  Clock,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const Navbar: React.FC = () => {
  const {
    user,
    hideBalances,
    togglePrivacyMode,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    sessionTimeoutRemaining,
    lockDashboard,
    securityLogs,
    setIsMobileSidebarOpen,
  } = useBanking();

  const [showNotifications, setShowNotifications] = useState(false);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const recentAlerts = securityLogs.slice(0, 4);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface-glass)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Brand & Security Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="mobile-menu-btn btn-icon"
          onClick={() => setIsMobileSidebarOpen(true)}
          title="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--accent-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
              AEGIS<span style={{ color: 'var(--accent-primary)' }}>BANK</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-success)',
                  display: 'inline-block',
                  boxShadow: '0 0 6px var(--accent-success)',
                }}
              />
              FIPS 140-2 Level 4 Verified
            </div>
          </div>
        </div>

        {/* Security badge pill */}
        <div
          className="badge badge-success"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
        >
          <CheckCircle2 size={13} />
          <span>E2E 256-bit AES</span>
        </div>
      </div>

      {/* Control Actions & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Session Inactivity Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: sessionTimeoutRemaining < 45 ? 'var(--accent-danger-bg)' : 'var(--bg-input)',
            border: `1px solid ${sessionTimeoutRemaining < 45 ? 'var(--accent-danger)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            color: sessionTimeoutRemaining < 45 ? 'var(--accent-danger)' : 'var(--text-muted)',
            transition: 'var(--transition-fast)',
          }}
          title="Session auto-lock timer for shoulder surfing and inactivity protection"
        >
          <Clock size={13} />
          <span className="mono">{formatSeconds(sessionTimeoutRemaining)}</span>
        </div>

        {/* Privacy Mode (Hide Balances) */}
        <button
          className="btn-icon"
          onClick={togglePrivacyMode}
          title={hideBalances ? 'Show account balances' : 'Hide account balances (Privacy Mode)'}
        >
          {hideBalances ? <EyeOff size={18} color="var(--accent-warning)" /> : <Eye size={18} />}
        </button>

        {/* Sound toggle */}
        <button
          className="btn-icon"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} color="var(--text-dim)" />}
        </button>

        {/* Theme toggle */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications / Security Alerts */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications((prev) => !prev)}
            title="Security Audit & Notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-danger)',
              }}
            />
          </button>

          {showNotifications && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '320px',
                padding: '16px',
                zIndex: 60,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Security Notifications</div>
                <span className="badge badge-primary">{securityLogs.length} events</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentAlerts.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '10px',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      {log.severity === 'alert' && <AlertTriangle size={13} color="var(--accent-danger)" />}
                      {log.severity === 'warning' && <AlertTriangle size={13} color="var(--accent-warning)" />}
                      {log.severity === 'success' && <CheckCircle2 size={13} color="var(--accent-success)" />}
                      <span style={{ color: 'var(--text-main)' }}>{log.event}</span>
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginTop: '4px' }}>
                      {log.timestamp} • {log.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lock Dashboard Quick Button */}
        <button
          className="btn btn-secondary"
          onClick={lockDashboard}
          style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
          title="Instant 2FA Lockout"
        >
          <Lock size={14} />
          <span>Lock</span>
        </button>

        {/* User Profile Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 10px 4px 6px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {user.accountTier}
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-dim)" />
        </div>
      </div>
    </header>
  );
};
