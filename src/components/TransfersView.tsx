import React, { useState } from 'react';
import {
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  Building,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import type { TransactionCategory } from '../types';

export const TransfersView: React.FC = () => {
  const {
    accounts,
    beneficiaries,
    executeTransfer,
    user,
    addBeneficiary,
  } = useBanking();

  // Form states
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
  const [selectedBenId, setSelectedBenId] = useState<string>(beneficiaries[0]?.id || 'custom');
  const [recipientName, setRecipientName] = useState(beneficiaries[0]?.name || '');
  const [recipientAccount, setRecipientAccount] = useState(beneficiaries[0]?.accountNumber || '');
  const [bankName, setBankName] = useState(beneficiaries[0]?.bankName || 'Chase Private Bank');
  const [amount, setAmount] = useState<string>('500');
  const [category, setCategory] = useState<TransactionCategory>('Transfer');
  const [note, setNote] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [transferError, setTransferError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Beneficiary Modal State
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');
  const [newBenBank, setNewBenBank] = useState('');
  const [newBenEmail, setNewBenEmail] = useState('');

  const selectedSource = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
  const numAmount = parseFloat(amount) || 0;
  const isHighValue = numAmount >= 2000;

  const handleSelectBeneficiary = (benId: string) => {
    setSelectedBenId(benId);
    if (benId === 'custom') {
      setRecipientName('');
      setRecipientAccount('');
      setBankName('');
    } else {
      const b = beneficiaries.find((item) => item.id === benId);
      if (b) {
        setRecipientName(b.name);
        setRecipientAccount(b.accountNumber);
        setBankName(b.bankName);
      }
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');

    if (numAmount <= 0) {
      setTransferError('Please enter a valid transfer amount.');
      return;
    }

    if (selectedSource && numAmount > selectedSource.balance) {
      setTransferError(`Insufficient funds. Your available balance is $${selectedSource.balance.toLocaleString()}.`);
      return;
    }

    if (securityPin.length < 4) {
      setTransferError('Please provide your 4-digit Security PIN to authenticate this transfer.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = executeTransfer({
        sourceAccountId,
        recipientName: recipientName || 'Direct Beneficiary',
        recipientAccount: recipientAccount || '•••• 8912',
        bankName: bankName || 'Partner Bank',
        amount: numAmount,
        category,
        note,
        pin: securityPin,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setTransferError(res.message);
      } else {
        // Reset form
        setSecurityPin('');
        setNote('');
      }
    }, 600);
  };

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName || !newBenAccount) return;

    addBeneficiary({
      name: newBenName,
      accountNumber: newBenAccount,
      bankName: newBenBank || 'National Reserve Bank',
      email: newBenEmail || `${newBenName.toLowerCase().replace(/\s+/g, '.')}@bank.com`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      isQuickSend: true,
    });

    setShowAddBenModal(false);
    setNewBenName('');
    setNewBenAccount('');
    setNewBenBank('');
    setNewBenEmail('');
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="title-lg" style={{ marginBottom: '4px' }}>
          Encrypted Fund Wire & Instant Transfer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Real-Time FedNow Rail • Zero-Knowledge PIN Authorization • Anti-Fraud Filter Active
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Transfer Form Panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleTransferSubmit}>
            {/* Source Account */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                1. Select Debiting Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                style={{ width: '100%', fontSize: '14px', padding: '12px' }}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Available: ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Beneficiary Quick Selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>2. Choose Recipient</label>
                <button
                  type="button"
                  onClick={() => setShowAddBenModal(true)}
                  style={{
                    fontSize: '12px',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <Plus size={14} />
                  <span>New Beneficiary</span>
                </button>
              </div>

              {/* Verified Beneficiary avatars */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                {beneficiaries.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBeneficiary(b.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: selectedBenId === b.id ? 'var(--accent-primary-gradient)' : 'var(--bg-input)',
                      color: selectedBenId === b.id ? '#ffffff' : 'var(--text-muted)',
                      border: `1px solid ${selectedBenId === b.id ? 'transparent' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <img
                      src={b.avatar}
                      alt={b.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{b.name}</div>
                  </div>
                ))}

                <div
                  onClick={() => handleSelectBeneficiary('custom')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedBenId === 'custom' ? 'var(--accent-primary-gradient)' : 'var(--bg-input)',
                    color: selectedBenId === 'custom' ? '#ffffff' : 'var(--text-muted)',
                    border: `1px solid ${selectedBenId === 'custom' ? 'transparent' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Building size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Custom Wire</span>
                </div>
              </div>
            </div>

            {/* Custom Recipient inputs if custom or prefilled */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Account / Routing / IBAN
                </label>
                <input
                  type="text"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  placeholder="9821 0049 3321"
                  className="mono"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>
            </div>

            {/* Amount & Fast Chips */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                3. Amount (USD)
              </label>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mono"
                  style={{
                    width: '100%',
                    fontSize: '26px',
                    fontWeight: 800,
                    padding: '14px 16px 14px 40px',
                  }}
                  required
                />
              </div>

              {/* Fast amount buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['100', '250', '500', '1000', '2500'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Memo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  <option value="Transfer">Transfer / Remittance</option>
                  <option value="Utilities">Utilities & Services</option>
                  <option value="Dining">Dining & Hospitality</option>
                  <option value="Shopping">Commerce & Retail</option>
                  <option value="Investment">Investment & Equity</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Memo / Purpose
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Invoice #9042"
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* High-Value Transaction Warning Alert */}
            {isHighValue && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-warning-bg)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  marginBottom: '20px',
                }}
              >
                <AlertTriangle size={18} color="var(--accent-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '12px', color: 'var(--accent-warning)' }}>
                  <strong>High-Security Transaction Protocol Active:</strong> Wires exceeding $2,000.00
                  trigger additional fraud surveillance and require cryptographic PIN signature verification.
                </div>
              </div>
            )}

            {/* Error Message */}
            {transferError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-danger-bg)',
                  color: 'var(--accent-danger)',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                <AlertTriangle size={16} />
                <span>{transferError}</span>
              </div>
            )}

            {/* 4-Digit Security PIN Confirmation */}
            <div
              style={{
                padding: '16px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} color="var(--accent-primary)" />
                  <span>Security Authorization PIN</span>
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  Demo PIN: <strong className="mono" style={{ color: 'var(--accent-primary)' }}>{user.pin}</strong>
                </span>
              </div>

              <input
                type="password"
                maxLength={4}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="mono"
                style={{
                  width: '100%',
                  fontSize: '20px',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  padding: '12px',
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || securityPin.length < 4}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                opacity: isSubmitting || securityPin.length < 4 ? 0.6 : 1,
              }}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'Encrypting & Authorizing...' : 'Authorize Instant Wire Transfer'}</span>
            </button>
          </form>
        </div>

        {/* Security & Transaction Info Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Real-Time Protection Shield */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--accent-success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={22} color="var(--accent-success)" />
              </div>
              <div>
                <h3 className="title-md" style={{ fontSize: '16px' }}>Aegis SafeGuard Wire</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Zero-Fraud Guarantee</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>End-to-End Cryptographic Signatures:</strong> Every outbound instruction is
                  digitally sealed using RFC 8792 cryptographic payload signing.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Beneficiary Confirmation:</strong> Destination routing numbers are cross-verified
                  against the Federal Reserve ACH Directory in real-time.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Instant Reversal Shield:</strong> In the event of flagged suspicious anomaly,
                  funds are held in cryptographic escrow until secondary biometric verification.
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Limits Overview */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              Your Tier Limits ({user.accountTier})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Single Instant Wire Limit:</span>
                <span className="mono" style={{ fontWeight: 600 }}>$50,000.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Daily Cumulative Limit:</span>
                <span className="mono" style={{ fontWeight: 600 }}>$150,000.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Network Processing Fee:</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>$0.00 (Waived)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Beneficiary Modal */}
      {showAddBenModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            <h3 className="title-md" style={{ marginBottom: '8px' }}>Add Verified Beneficiary</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              Add a trusted account to your fast-dispatch directory.
            </p>

            <form onSubmit={handleAddBeneficiary}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  placeholder="e.g. Jonathan Edwards"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Account Number / IBAN
                </label>
                <input
                  type="text"
                  value={newBenAccount}
                  onChange={(e) => setNewBenAccount(e.target.value)}
                  placeholder="4491 8820 1192"
                  className="mono"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Receiving Bank
                </label>
                <input
                  type="text"
                  value={newBenBank}
                  onChange={(e) => setNewBenBank(e.target.value)}
                  placeholder="e.g. JP Morgan Chase"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Email for Wire Notification (Optional)
                </label>
                <input
                  type="email"
                  value={newBenEmail}
                  onChange={(e) => setNewBenEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowAddBenModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
