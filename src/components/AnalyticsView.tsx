import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const AnalyticsView: React.FC = () => {
  const { transactions, hideBalances } = useBanking();
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  // Calculate totals from transactions
  const totalInflow = transactions
    .filter((t) => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalInflow - totalOutflow;

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const maxCategorySpent = Math.max(...Object.values(categoryTotals), 1);

  // Monthly data for SVG Bar Chart
  const monthlyData = [
    { month: 'Apr', income: 7200, expense: 2800 },
    { month: 'May', income: 7400, expense: 3100 },
    { month: 'Jun', income: 8100, expense: 3400 },
    { month: 'Jul', income: 7900, expense: 2900 },
    { month: 'Aug', income: 8500, expense: 3800 },
    { month: 'Sep', income: 9170, expense: 3445 },
  ];

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
            Financial Intelligence & Cash Flow
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Predictive Liquidity Models • Outflow Classification • High-Yield Compounding
          </p>
        </div>

        {/* Timeframe pill */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          {(['30d', '90d', '1y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                background: timeframe === t ? 'var(--bg-surface)' : 'transparent',
                color: timeframe === t ? 'var(--text-main)' : 'var(--text-muted)',
              }}
            >
              {t === '30d' ? 'Last 30 Days' : t === '90d' ? 'Last Quarter' : 'Year to Date'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Trio */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Total Inflow */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>Total Deposits & Inflow</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} color="var(--accent-success)" />
            </div>
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-success)' }}>
            {hideBalances ? '••••••••' : `+$${totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>
            +12.4% higher than previous period
          </div>
        </div>

        {/* Total Outflow */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>Expenses & Wires</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-danger-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingDown size={18} color="var(--accent-danger)" />
            </div>
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)' }}>
            {hideBalances ? '••••••••' : `-$${totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>
            Controlled within safety budget
          </div>
        </div>

        {/* Net Savings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>Net Capital Retained</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="var(--accent-primary)" />
            </div>
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {hideBalances ? '••••••••' : `+$${netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--accent-success)', marginTop: '6px' }}>
            62.8% Savings Retention Ratio
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Monthly Cash Flow SVG Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 className="title-md" style={{ fontSize: '16px' }}>Monthly Cash Flow Dynamics</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Inflow vs Outflow comparison (USD)</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '2px' }} />
                <span>Inflow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--accent-danger)', borderRadius: '2px' }} />
                <span>Outflow</span>
              </div>
            </div>
          </div>

          {/* SVG Responsive Chart */}
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingBottom: '24px' }}>
            {monthlyData.map((d) => {
              const maxVal = 10000;
              const inHeight = (d.income / maxVal) * 160;
              const outHeight = (d.expense / maxVal) * 160;

              return (
                <div
                  key={d.month}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '170px' }}>
                    {/* Inflow Bar */}
                    <div
                      style={{
                        width: '18px',
                        height: `${inHeight}px`,
                        background: 'var(--accent-primary-gradient)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'var(--transition-normal)',
                      }}
                      title={`${d.month} Inflow: $${d.income}`}
                    />
                    {/* Outflow Bar */}
                    <div
                      style={{
                        width: '18px',
                        height: `${outHeight}px`,
                        background: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'var(--transition-normal)',
                      }}
                      title={`${d.month} Outflow: $${d.expense}`}
                    />
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, marginTop: '8px' }}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Expense Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="title-md" style={{ fontSize: '16px', marginBottom: '6px' }}>
            Outflow Breakdown by Category
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '20px' }}>
            Classified via automated merchant taxonomy
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categoryTotals).map(([cat, amt]) => {
              const pct = Math.round((amt / maxCategorySpent) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span className="mono" style={{ color: 'var(--text-muted)' }}>
                      ${amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background:
                          cat === 'Transfer'
                            ? 'var(--accent-primary-gradient)'
                            : cat === 'Shopping'
                            ? 'linear-gradient(90deg, #8b5cf6, #ec4899)'
                            : 'linear-gradient(90deg, #06b6d4, #10b981)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
