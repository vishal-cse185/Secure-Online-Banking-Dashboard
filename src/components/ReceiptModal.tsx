import React from 'react';
import { CheckCircle2, ShieldCheck, Printer, X } from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const ReceiptModal: React.FC = () => {
  const { recentReceipt, clearReceipt } = useBanking();

  if (!recentReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        {/* Close icon */}
        <button
          onClick={clearReceipt}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
        >
          <X size={16} />
        </button>

        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-success-bg)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <CheckCircle2 size={36} color="var(--accent-success)" />
          </div>
          <h3 className="title-md">Transfer Authorized</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Encrypted Transaction Confirmed & Dispatched
          </p>
        </div>

        {/* Receipt Container */}
        <div
          style={{
            background: 'var(--bg-input)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Amount Display */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Amount Sent
            </div>
            <div
              className="mono"
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--accent-success)',
                marginTop: '4px',
              }}
            >
              -${recentReceipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>USD • Zero Network Fee</div>
          </div>

          {/* Breakdown Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Reference No.</span>
              <span className="mono" style={{ fontWeight: 600 }}>{recentReceipt.reference}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Recipient</span>
              <span style={{ fontWeight: 600 }}>{recentReceipt.recipientName}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Destination Account</span>
              <span className="mono" style={{ fontWeight: 600 }}>{recentReceipt.recipientAccount}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Debited Account</span>
              <span style={{ fontWeight: 600 }}>{recentReceipt.senderAccount}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Date & Time</span>
              <span style={{ fontWeight: 500 }}>{recentReceipt.timestamp}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Security Validation</span>
              <span style={{ color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <ShieldCheck size={14} /> 2FA PIN Verified
              </span>
            </div>

            {recentReceipt.notes && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Memo</span>
                <span style={{ fontStyle: 'italic' }}>{recentReceipt.notes}</span>
              </div>
            )}
          </div>

          {/* Digital Signature */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              wordBreak: 'break-all',
              fontFamily: 'var(--font-mono)',
            }}
          >
            HASH: sha256-{recentReceipt.reference.toLowerCase()}-e2e-aegis-fips140-ok
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={clearReceipt}>
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
