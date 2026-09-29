import React from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  CreditCard,
  History,
  ShieldCheck,
  BarChart3,
  PhoneCall,
  Shield,
  X,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, isMobileSidebarOpen, setIsMobileSidebarOpen } = useBanking();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transfers', label: 'Send & Wire', icon: ArrowUpRight },
    { id: 'cards', label: 'Cards & Controls', icon: CreditCard },
    { id: 'transactions', label: 'Transactions Ledger', icon: History },
    { id: 'security', label: 'Security & Audit', icon: ShieldCheck },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={`app-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
      style={{
        width: '260px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div>
        {/* Mobile Header with Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '0 8px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
            AEGIS<span style={{ color: 'var(--accent-primary)' }}>BANK</span>
          </div>
          <button
            className="mobile-menu-btn btn-icon"
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-dim)',
              padding: '8px 14px',
            }}
          >
            Banking Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '14px',
                  background: isActive ? 'var(--accent-primary-gradient)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 4px 16px rgba(37, 99, 235, 0.35)' : 'none',
                  transition: 'var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Health & Emergency Fraud Helpline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Shield Score Widget */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
              <Shield size={16} color="var(--accent-success)" />
              <span>Shield Score</span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--accent-success)',
              }}
            >
              {user.securityScore}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '6px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: `${user.securityScore}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            Strong Protection • 2FA Active • Zero Vulnerabilities
          </div>
        </div>

        {/* 24/7 Security Hotline */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PhoneCall size={16} color="var(--accent-danger)" />
          </div>
          <div style={{ fontSize: '11px', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>24/7 Fraud Guard</div>
            <div style={{ color: 'var(--text-dim)' }}>1-800-AEGIS-SEC</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
