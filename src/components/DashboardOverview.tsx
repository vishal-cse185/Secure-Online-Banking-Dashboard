import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  PlusCircle,
  Eye,
  EyeOff,
  Send,
  Lock,
  Unlock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const DashboardOverview: React.FC = () => {
  const {
    user,
    accounts,
    cards,
    transactions,
    beneficiaries,
    hideBalances,
    togglePrivacyMode,
    setActiveTab,
    toggleCardFreeze,
    addFundsToAccount,
  } = useBanking();

  const [revealedAccounts, setRevealedAccounts] = useState<Record<string, boolean>>({});
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('2500');
  const [selectedDepositAccount, setSelectedDepositAccount] = useState(accounts[0]?.id || '');

  // Calculate Net Worth
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Masking helper
  const maskAccount = (num: string, revealed: boolean) => {
    if (revealed) return num;
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  const toggleAccountReveal = (id: string) => {
    setRevealedAccounts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      addFundsToAccount(selectedDepositAccount, amt, 'Demo Liquidity Direct Deposit');
      setShowDepositModal(false);
    }
  };

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Primary card
  const primaryCard = cards[0];

  return (
    <div>
      {/* Top Banner / Welcome & Quick Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 className="title-lg">Welcome back, {user.name}</h1>
            <span className="badge badge-success">
              <ShieldCheck size={12} /> Protected
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Secure Portal Active • Last authentication: {user.lastLogin}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDepositModal(true)}
            style={{ fontSize: '13px' }}
          >
            <PlusCircle size={16} />
            <span>Deposit Demo Funds</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab('transfers')}
            style={{ fontSize: '13px' }}
          >
            <Send size={16} />
            <span>New Transfer</span>
          </button>
        </div>
      </div>

      {/* Net Worth Hero Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 32px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderColor: 'var(--border-glow)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Combined Net Worth
            </span>
            <button
              onClick={togglePrivacyMode}
              style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}
              title="Toggle Balance Visibility"
            >
              {hideBalances ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div
            className="mono"
            style={{
              fontSize: '38px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
            }}
          >
            {hideBalances
              ? '••••••••••'
              : `$${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px', color: 'var(--accent-success)' }}>
            <TrendingUp size={15} />
            <span>+4.85% APY compounding daily across vaults</span>
          </div>
        </div>

        {/* Quick stat chips */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Monthly Inflow</div>
            <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-success)', marginTop: '2px' }}>
              {hideBalances ? '••••' : '+$8,850.00'}
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Monthly Outflow</div>
            <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-danger)', marginTop: '2px' }}>
              {hideBalances ? '••••' : '-$3,445.70'}
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Shield Defense</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
              100% Active
            </div>
          </div>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="title-md">Primary Liquidity Accounts</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>FDIC Insured up to $2,500,000</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {accounts.map((acc) => {
            const isRevealed = !!revealedAccounts[acc.id];
            return (
              <div
                key={acc.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{acc.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                        {acc.type} Account {acc.apy ? `• ${acc.apy}% APY` : ''}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Wallet size={18} color="var(--accent-primary)" />
                    </div>
                  </div>

                  <div
                    className="mono"
                    style={{
                      fontSize: '28px',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      marginBottom: '16px',
                    }}
                  >
                    {hideBalances
                      ? '••••••••'
                      : `$${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </div>
                </div>

                <div>
                  {/* Account number row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <span className="mono" style={{ color: 'var(--text-muted)' }}>
                      {maskAccount(acc.accountNumber, isRevealed)}
                    </span>
                    <button
                      onClick={() => toggleAccountReveal(acc.id)}
                      style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}
                      title={isRevealed ? 'Hide account digits' : 'Reveal full account number'}
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      Routing: <span className="mono">{acc.routingNumber}</span>
                    </span>
                    <button
                      onClick={() => setActiveTab('transfers')}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <span>Transfer</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Quick Beneficiary Transfer & Live Card Preview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Quick Send to Beneficiaries */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md">Verified Beneficiaries</h3>
            <button
              onClick={() => setActiveTab('transfers')}
              style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              Manage
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
            Instant encrypted peer-to-peer transfers with biometric/PIN authorization.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {beneficiaries.map((ben) => (
              <div
                key={ben.id}
                onClick={() => setActiveTab('transfers')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img
                  src={ben.avatar}
                  alt={ben.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '8px', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{ben.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{ben.bankName.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Card Security Widget */}
        {primaryCard && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="title-md">Active Virtual Debit</h3>
              <button
                onClick={() => setActiveTab('cards')}
                style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                View Details
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Mini Card Render */}
              <div
                className={`bank-card card-theme-${primaryCard.colorTheme}`}
                style={{ maxWidth: '100%', height: '180px', padding: '18px' }}
              >
                {primaryCard.status === 'frozen' && (
                  <div className="card-frozen-overlay">
                    <Lock size={28} color="#ffffff" />
                    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em' }}>
                      CARD TEMPORARILY FROZEN
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '14px' }}>AEGIS PLATINUM</span>
                  <span className="mono" style={{ fontSize: '14px', fontWeight: 700 }}>VISA</span>
                </div>

                <div className="card-chip" style={{ width: '36px', height: '26px' }} />

                <div>
                  <div className="mono" style={{ fontSize: '16px', letterSpacing: '3px', fontWeight: 600 }}>
                    •••• •••• •••• {primaryCard.cardNumber.slice(-4)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px' }}>
                    <span>{primaryCard.cardHolder}</span>
                    <span>EXP {primaryCard.expiry}</span>
                  </div>
                </div>
              </div>

              {/* Card Controls Quick Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Today's Spending</div>
                  <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>
                    ${primaryCard.currentSpent.toFixed(2)} / ${primaryCard.spendingLimit}
                  </div>
                </div>

                <button
                  className={`btn ${primaryCard.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                  onClick={() => toggleCardFreeze(primaryCard.id)}
                >
                  {primaryCard.status === 'active' ? (
                    <>
                      <Lock size={14} color="var(--accent-warning)" />
                      <span>Freeze Card</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={14} />
                      <span>Unfreeze Card</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions Table Preview */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 className="title-md">Recent Ledger Transactions</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Real-time cryptographic audit trail</p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab('transactions')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            <span>View All Ledger</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', color: 'var(--text-dim)', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-dim)', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-dim)', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-dim)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 8px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: tx.type === 'credit' ? 'var(--accent-success-bg)' : 'var(--bg-input)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft size={15} color="var(--accent-success)" />
                        ) : (
                          <ArrowUpRight size={15} color="var(--text-muted)" />
                        )}
                      </div>
                      <div>
                        <div>{tx.description}</div>
                        <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {tx.reference}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>{tx.category}</td>
                  <td style={{ padding: '14px 8px', color: 'var(--text-dim)' }}>{tx.timestamp}</td>
                  <td style={{ padding: '14px 8px' }}>
                    {tx.status === 'completed' && <span className="badge badge-success">Completed</span>}
                    {tx.status === 'pending' && <span className="badge badge-warning">Pending</span>}
                    {tx.status === 'flagged' && <span className="badge badge-danger">Blocked by AI</span>}
                  </td>
                  <td
                    className="mono"
                    style={{
                      padding: '14px 8px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: tx.type === 'credit' ? 'var(--accent-success)' : 'var(--text-main)',
                    }}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Deposit Demo Modal */}
      {showDepositModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            <h3 className="title-md" style={{ marginBottom: '8px' }}>Deposit Liquidity (Demo)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              Simulate an incoming direct wire or payroll credit to test real-time balance calculations.
            </p>

            <form onSubmit={handleDepositSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Target Account
                </label>
                <select
                  value={selectedDepositAccount}
                  onChange={(e) => setSelectedDepositAccount(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (${a.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ width: '100%', fontSize: '16px' }}
                  className="mono"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowDepositModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
