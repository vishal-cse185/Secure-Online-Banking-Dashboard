import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  AlertTriangle,
  FileText,
  X,
  MapPin,
  Printer,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import type { Transaction } from '../types';

export const TransactionsView: React.FC = () => {
  const { transactions } = useBanking();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit' | 'flagged'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (typeFilter === 'credit' && tx.type !== 'credit') return false;
      if (typeFilter === 'debit' && tx.type !== 'debit') return false;
      if (typeFilter === 'flagged' && tx.status !== 'flagged') return false;

      // Category match
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      // Search match
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const descMatch = tx.description.toLowerCase().includes(q);
        const refMatch = tx.reference.toLowerCase().includes(q);
        const recMatch = tx.recipientName?.toLowerCase().includes(q);
        const catMatch = tx.category.toLowerCase().includes(q);
        if (!descMatch && !refMatch && !recMatch && !catMatch) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Reference', 'Timestamp', 'Description', 'Amount', 'Type', 'Category', 'Status', 'Recipient', 'IP', 'Location'];
    const rows = filteredTransactions.map((tx) => [
      tx.reference,
      `"${tx.timestamp}"`,
      `"${tx.description}"`,
      tx.amount,
      tx.type,
      tx.category,
      tx.status,
      `"${tx.recipientName || tx.senderAccount || ''}"`,
      tx.ipAddress,
      `"${tx.location}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aegis_bank_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Transactions & Security Ledger
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Immutable Cryptographic Audit Trail • Geolocation & Anomaly Tagging
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV} style={{ fontSize: '13px' }}>
          <Download size={16} />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search
            size={16}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description, reference, or recipient..."
            style={{ width: '100%', paddingLeft: '38px', fontSize: '13px' }}
          />
        </div>

        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          <button
            onClick={() => setTypeFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: typeFilter === 'all' ? 'var(--bg-surface)' : 'transparent',
              color: typeFilter === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
            }}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('credit')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: typeFilter === 'credit' ? 'var(--bg-surface)' : 'transparent',
              color: typeFilter === 'credit' ? 'var(--accent-success)' : 'var(--text-muted)',
            }}
          >
            Credits
          </button>
          <button
            onClick={() => setTypeFilter('debit')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: typeFilter === 'debit' ? 'var(--bg-surface)' : 'transparent',
              color: typeFilter === 'debit' ? 'var(--text-main)' : 'var(--text-muted)',
            }}
          >
            Debits
          </button>
          <button
            onClick={() => setTypeFilter('flagged')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: typeFilter === 'flagged' ? 'var(--bg-surface)' : 'transparent',
              color: typeFilter === 'flagged' ? 'var(--accent-danger)' : 'var(--text-muted)',
            }}
          >
            Flagged
          </button>
        </div>

        {/* Category dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="var(--text-dim)" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ fontSize: '13px', padding: '8px 12px' }}
          >
            <option value="all">All Categories</option>
            <option value="Transfer">Transfer</option>
            <option value="Salary">Salary</option>
            <option value="Shopping">Shopping</option>
            <option value="Dining">Dining</option>
            <option value="Utilities">Utilities</option>
            <option value="Security">Security</option>
            <option value="Investment">Investment</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600 }}>Transaction / Memo</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600 }}>Security Status</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 10px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedTxn(tx)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Description & Reference */}
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background:
                            tx.status === 'flagged'
                              ? 'var(--accent-danger-bg)'
                              : tx.type === 'credit'
                              ? 'var(--accent-success-bg)'
                              : 'var(--bg-input)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {tx.status === 'flagged' ? (
                          <AlertTriangle size={16} color="var(--accent-danger)" />
                        ) : tx.type === 'credit' ? (
                          <ArrowDownLeft size={16} color="var(--accent-success)" />
                        ) : (
                          <ArrowUpRight size={16} color="var(--text-muted)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{tx.description}</div>
                        <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {tx.reference}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 10px', color: 'var(--text-muted)' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {tx.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 10px', color: 'var(--text-dim)' }}>{tx.timestamp}</td>

                  {/* Security Status Badge */}
                  <td style={{ padding: '14px 10px' }}>
                    {tx.status === 'completed' && (
                      <span className="badge badge-success">
                        <ShieldCheck size={12} /> Confirmed
                      </span>
                    )}
                    {tx.status === 'pending' && <span className="badge badge-warning">Clearing</span>}
                    {tx.status === 'flagged' && (
                      <span className="badge badge-danger">
                        <AlertTriangle size={12} /> Blocked / AI Shield
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td
                    className="mono"
                    style={{
                      padding: '14px 10px',
                      textAlign: 'right',
                      fontWeight: 700,
                      fontSize: '14px',
                      color:
                        tx.status === 'flagged'
                          ? 'var(--text-dim)'
                          : tx.type === 'credit'
                          ? 'var(--accent-success)'
                          : 'var(--text-main)',
                      textDecoration: tx.status === 'flagged' ? 'line-through' : 'none',
                    }}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Inspect Transaction"
                    >
                      <FileText size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
            No transactions match your search and filter criteria.
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <button
              onClick={() => setSelectedTxn(null)}
              className="btn-icon"
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background:
                    selectedTxn.status === 'flagged'
                      ? 'var(--accent-danger-bg)'
                      : selectedTxn.type === 'credit'
                      ? 'var(--accent-success-bg)'
                      : 'var(--accent-primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedTxn.status === 'flagged' ? (
                  <AlertTriangle size={22} color="var(--accent-danger)" />
                ) : (
                  <ShieldCheck size={22} color="#ffffff" />
                )}
              </div>
              <div>
                <h3 className="title-md" style={{ fontSize: '18px' }}>{selectedTxn.description}</h3>
                <div className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Ref: {selectedTxn.reference}
                </div>
              </div>
            </div>

            {/* Amount display */}
            <div
              style={{
                padding: '16px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Transaction Value</div>
              <div
                className="mono"
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: selectedTxn.type === 'credit' ? 'var(--accent-success)' : 'var(--text-main)',
                  marginTop: '4px',
                }}
              >
                {selectedTxn.type === 'credit' ? '+' : '-'}${selectedTxn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
              </div>
              <div style={{ marginTop: '4px' }}>
                {selectedTxn.status === 'completed' && <span className="badge badge-success">Completed & Settled</span>}
                {selectedTxn.status === 'pending' && <span className="badge badge-warning">Processing</span>}
                {selectedTxn.status === 'flagged' && <span className="badge badge-danger">Declined by Fraud Engine</span>}
              </div>
            </div>

            {/* Audit details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Timestamp</span>
                <span style={{ fontWeight: 500 }}>{selectedTxn.timestamp}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Category</span>
                <span style={{ fontWeight: 600 }}>{selectedTxn.category}</span>
              </div>

              {selectedTxn.recipientName && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Recipient</span>
                  <span style={{ fontWeight: 600 }}>{selectedTxn.recipientName}</span>
                </div>
              )}

              {selectedTxn.recipientAccount && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Recipient Account</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{selectedTxn.recipientAccount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Origin IP Address</span>
                <span className="mono" style={{ fontWeight: 600 }}>{selectedTxn.ipAddress}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Geolocation</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <MapPin size={13} color="var(--accent-primary)" />
                  {selectedTxn.location}
                </span>
              </div>

              {selectedTxn.notes && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Memo / Rule</span>
                  <span style={{ color: selectedTxn.status === 'flagged' ? 'var(--accent-danger)' : 'inherit', fontStyle: 'italic' }}>
                    {selectedTxn.notes}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Print Record</span>
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setSelectedTxn(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
