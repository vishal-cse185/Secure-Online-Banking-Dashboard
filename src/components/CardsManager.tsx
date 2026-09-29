import { useState } from 'react';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Globe,
  ShoppingCart,
  Banknote,
  Radio,
  Sliders,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  RotateCw,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const CardsManager: React.FC = () => {
  const {
    cards,
    toggleCardFreeze,
    updateCardLimit,
    toggleCardControl,
    user,
    createVirtualCard,
  } = useBanking();

  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [revealedCvv, setRevealedCvv] = useState<Record<string, boolean>>({});
  const [revealedNumber, setRevealedNumber] = useState<Record<string, boolean>>({});
  const [pinPromptCvvModal, setPinPromptCvvModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // New Virtual Card Modal state
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState<'visa' | 'mastercard'>('visa');
  const [newCardType, setNewCardType] = useState<'debit' | 'credit'>('debit');
  const [newCardLimit, setNewCardLimit] = useState(3500);
  const [newCardTheme, setNewCardTheme] = useState<'blue' | 'purple' | 'emerald' | 'gold' | 'dark'>('emerald');

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleRevealCvvClick = () => {
    if (revealedCvv[selectedCard.id]) {
      // Toggle off without prompt
      setRevealedCvv((prev) => ({ ...prev, [selectedCard.id]: false }));
    } else {
      // Prompt for PIN to reveal CVV (enterprise security best practice!)
      setPinPromptCvvModal(true);
      setEnteredPin('');
      setPinError('');
    }
  };

  const handleCvvPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === user.pin) {
      setRevealedCvv((prev) => ({ ...prev, [selectedCard.id]: true }));
      setPinPromptCvvModal(false);
      setEnteredPin('');
    } else {
      setPinError('Incorrect 4-digit Security PIN.');
    }
  };

  const toggleNumberReveal = () => {
    setRevealedNumber((prev) => ({ ...prev, [selectedCard.id]: !prev[selectedCard.id] }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    updateCardLimit(selectedCard.id, val);
  };

  const isCvvRevealed = !!revealedCvv[selectedCard?.id];
  const isNumberRevealed = !!revealedNumber[selectedCard?.id];

  const maskCardNumber = (num: string, revealed: boolean) => {
    if (revealed) return num;
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="title-lg" style={{ marginBottom: '4px' }}>
          Virtual & Physical Card Shield
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Real-Time Killswitch • Granular Spending Thresholds • CVV Obfuscation
        </p>
      </div>

      {/* Card Selector Tabs + Issue Card Button */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              setSelectedCardId(card.id);
              setIsFlipped(false);
            }}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: selectedCardId === card.id ? 'var(--bg-surface)' : 'var(--bg-input)',
              border: `1px solid ${selectedCardId === card.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              color: selectedCardId === card.id ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: selectedCardId === card.id ? 'var(--shadow-glow)' : 'none',
              transition: 'var(--transition-fast)',
            }}
          >
            <CreditCard size={16} color={selectedCardId === card.id ? 'var(--accent-primary)' : 'var(--text-dim)'} />
            <span>
              {card.cardHolder.split(' ')[0]} ({card.cardNumber.slice(-4)})
            </span>
            {card.status === 'frozen' && (
              <span className="badge badge-danger" style={{ padding: '2px 6px', fontSize: '10px' }}>
                Frozen
              </span>
            )}
          </button>
        ))}

        {/* Issue Virtual Card Trigger */}
        <button
          onClick={() => setShowCreateCardModal(true)}
          className="btn btn-secondary"
          style={{
            padding: '11px 18px',
            fontSize: '13px',
            flexShrink: 0,
            borderStyle: 'dashed',
            borderColor: 'var(--accent-primary)',
            color: 'var(--accent-primary)',
          }}
        >
          <Plus size={16} />
          <span>Issue Virtual Card</span>
        </button>
      </div>

      {/* Main Grid: Card Display + Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
        }}
      >
        {/* Interactive 3D Card Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="card-flipper-container">
            <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
              {/* CARD FRONT */}
              <div
                className={`bank-card card-front card-theme-${selectedCard.colorTheme}`}
                style={{ width: '100%', height: '250px' }}
              >
                {selectedCard.status === 'frozen' && (
                  <div className="card-frozen-overlay">
                    <Lock size={44} color="#ffffff" />
                    <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.08em' }}>
                      CARD TEMPORARILY FROZEN
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>All transactions currently declined</div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} />
                    <span style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '15px' }}>AEGIS PREMIER</span>
                  </div>
                  <span className="mono" style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase' }}>
                    {selectedCard.brand}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="card-chip" />
                  <Radio size={20} color="rgba(255, 255, 255, 0.7)" />
                </div>

                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: '22px',
                      letterSpacing: '4px',
                      fontWeight: 600,
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{maskCardNumber(selectedCard.cardNumber, isNumberRevealed)}</span>
                    <button
                      onClick={toggleNumberReveal}
                      style={{ color: 'rgba(255,255,255,0.7)', padding: '4px' }}
                      title="Reveal Card Number"
                    >
                      {isNumberRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase' }}>Cardholder</div>
                      <div style={{ fontWeight: 600 }}>{selectedCard.cardHolder}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase' }}>Expires</div>
                      <div className="mono" style={{ fontWeight: 600 }}>{selectedCard.expiry}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase' }}>CVV / CVC</div>
                      <div
                        onClick={handleRevealCvvClick}
                        className="mono"
                        style={{
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: isCvvRevealed ? '#fcd34d' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Click to reveal CVV (PIN Required)"
                      >
                        <span>{isCvvRevealed ? selectedCard.cvv : '•••'}</span>
                        {isCvvRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div
                className={`bank-card card-back card-theme-${selectedCard.colorTheme}`}
                style={{ width: '100%', height: '250px', position: 'absolute', top: 0, left: 0 }}
              >
                <div className="card-magstripe" />
                <div className="card-signature-strip">
                  <span className="mono" style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '14px' }}>
                    {isCvvRevealed ? selectedCard.cvv : '•••'}
                  </span>
                </div>

                <div style={{ marginTop: 'auto', fontSize: '10px', opacity: 0.8, lineHeight: 1.4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>24/7 Security Helpline: 1-800-AEGIS-SEC</span>
                    <span className="mono" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                      {selectedCard.brand} SECURE
                    </span>
                  </div>
                  <div>Issued by Aegis National Bank pursuant to license by {selectedCard.brand.toUpperCase()} International.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions below Card */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', width: '100%', maxWidth: '420px' }}>
            <button
              onClick={() => toggleCardFreeze(selectedCard.id)}
              className={`btn ${selectedCard.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
              style={{ flex: 1, padding: '12px' }}
            >
              {selectedCard.status === 'active' ? (
                <>
                  <Lock size={16} />
                  <span>Freeze Card</span>
                </>
              ) : (
                <>
                  <Unlock size={16} />
                  <span>Reactivate</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="btn btn-secondary"
              style={{ padding: '12px 18px', gap: '8px' }}
              title="Flip card to inspect reverse side"
            >
              <RotateCw size={16} />
              <span>{isFlipped ? 'Show Front' : 'Flip 3D'}</span>
            </button>
          </div>
        </div>

        {/* Security Controls & Thresholds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Daily Limit Adjustment */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px' }}>
                <Sliders size={18} color="var(--accent-primary)" />
                <span>Daily Spending Threshold</span>
              </div>
              <span className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                ${selectedCard.spendingLimit.toLocaleString()}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '16px' }}>
              Transactions exceeding this limit in a 24h rolling window are automatically declined.
            </p>

            {/* Slider */}
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={selectedCard.spendingLimit}
              onChange={handleLimitChange}
              style={{ width: '100%', marginBottom: '14px', accentColor: 'var(--accent-primary)' }}
            />

            {/* Progress bar of current spent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-dim)' }}>
                  Spent today: <strong className="mono" style={{ color: 'var(--text-main)' }}>${selectedCard.currentSpent.toFixed(2)}</strong>
                </span>
                <span style={{ color: 'var(--text-dim)' }}>
                  {Math.round((selectedCard.currentSpent / selectedCard.spendingLimit) * 100)}% utilized
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, (selectedCard.currentSpent / selectedCard.spendingLimit) * 100)}%`,
                    height: '100%',
                    background: 'var(--accent-primary-gradient)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Granular Feature Toggles */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="title-md" style={{ fontSize: '16px', marginBottom: '16px' }}>
              Granular Payment Controls
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Online Transactions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingCart size={18} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Online & E-Commerce Purchases</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Allow web and in-app transactions</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.controls.onlinePayments}
                  onChange={() => toggleCardControl(selectedCard.id, 'onlinePayments')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>

              {/* International Usage */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Globe size={18} color="var(--accent-secondary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>International & Cross-Border Usage</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Block unauthorized overseas charges</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.controls.internationalUsage}
                  onChange={() => toggleCardControl(selectedCard.id, 'internationalUsage')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>

              {/* ATM Withdrawals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Banknote size={18} color="var(--accent-success)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>ATM Cash Withdrawals</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Physical ATM terminal access</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.controls.atmWithdrawals}
                  onChange={() => toggleCardControl(selectedCard.id, 'atmWithdrawals')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Contactless NFC */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Radio size={18} color="var(--accent-warning)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Contactless Tap-to-Pay</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>NFC pos terminal transactions</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.controls.contactless}
                  onChange={() => toggleCardControl(selectedCard.id, 'contactless')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CVV Security PIN Prompt Modal */}
      {pinPromptCvvModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--accent-warning-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <KeyRound size={28} color="var(--accent-warning)" />
            </div>

            <h3 className="title-md" style={{ marginBottom: '8px' }}>
              Security PIN Required
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              To view your unmasked CVV code, verify your master 4-digit PIN.
            </p>

            <form onSubmit={handleCvvPinSubmit}>
              {pinError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-danger-bg)',
                    color: 'var(--accent-danger)',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <AlertCircle size={14} />
                  <span>{pinError}</span>
                </div>
              )}

              <input
                type="password"
                maxLength={4}
                autoFocus
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="••••"
                className="mono"
                style={{
                  width: '100%',
                  fontSize: '22px',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  padding: '12px',
                  marginBottom: '20px',
                }}
                required
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setPinPromptCvvModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Instant Virtual Card Modal */}
      {showCreateCardModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--accent-primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <h3 className="title-md">Issue Instant Virtual Card</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Generate an encrypted burner card for secure e-commerce & subscriptions.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createVirtualCard({
                  brand: newCardBrand,
                  cardType: newCardType,
                  limit: newCardLimit,
                  theme: newCardTheme,
                });
                setShowCreateCardModal(false);
              }}
              style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Payment Network
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {(['visa', 'mastercard'] as const).map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setNewCardBrand(b)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: newCardBrand === b ? 'var(--accent-primary-gradient)' : 'var(--bg-input)',
                        color: newCardBrand === b ? '#ffffff' : 'var(--text-muted)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '13px',
                        border: `1px solid ${newCardBrand === b ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Card Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {(['debit', 'credit'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewCardType(t)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: newCardType === t ? 'var(--bg-surface)' : 'var(--bg-input)',
                        color: newCardType === t ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        fontSize: '13px',
                        border: `1px solid ${newCardType === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      {t} Card
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Spending Limit</label>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ${newCardLimit.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Card Aesthetic Theme
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['emerald', 'blue', 'purple', 'gold', 'dark'] as const).map((thm) => (
                    <button
                      type="button"
                      key={thm}
                      onClick={() => setNewCardTheme(thm)}
                      style={{
                        flex: 1,
                        height: '36px',
                        borderRadius: '8px',
                        border: newCardTheme === thm ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: newCardTheme === thm ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
                        background:
                          thm === 'emerald'
                            ? 'linear-gradient(135deg, #064e3b, #10b981)'
                            : thm === 'blue'
                            ? 'linear-gradient(135deg, #1e3a8a, #0284c7)'
                            : thm === 'purple'
                            ? 'linear-gradient(135deg, #4c1d95, #c084fc)'
                            : thm === 'gold'
                            ? 'linear-gradient(135deg, #78350f, #f59e0b)'
                            : 'linear-gradient(135deg, #0f172a, #334155)',
                      }}
                      title={thm}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreateCardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Virtual Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
