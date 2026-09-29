import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  Account,
  Card,
  Transaction,
  SecurityLog,
  ActiveSession,
  Beneficiary,
  UserProfile,
  TransferPayload,
  CardControls,
} from '../types';
import {
  initialUser,
  initialAccounts,
  initialCards,
  initialTransactions,
  initialSecurityLogs,
  initialActiveSessions,
  initialBeneficiaries,
} from '../services/mockData';
import { playSound, setSoundEnabled as setAudioSoundEnabled } from '../utils/audio';

interface BankingContextType {
  user: UserProfile;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  securityLogs: SecurityLog[];
  sessions: ActiveSession[];
  beneficiaries: Beneficiary[];
  isAuthenticated: boolean;
  activeTab: string;
  hideBalances: boolean;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  sessionTimeoutRemaining: number;
  isSessionWarningOpen: boolean;
  recentReceipt: Transaction | null;
  isMobileSidebarOpen: boolean;
  // Methods
  setActiveTab: (tab: string) => void;
  togglePrivacyMode: () => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  executeTransfer: (payload: TransferPayload) => { success: boolean; message: string; receipt?: Transaction };
  toggleCardFreeze: (cardId: string) => void;
  updateCardLimit: (cardId: string, limit: number) => void;
  toggleCardControl: (cardId: string, control: keyof CardControls) => void;
  verifySecurityPin: (pin: string) => boolean;
  updateUserPin: (newPin: string) => boolean;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
  resetInactivityTimer: () => void;
  lockDashboard: () => void;
  unlockWith2FA: (pinOrOtp: string) => boolean;
  toggle2FA: () => void;
  setTwoFactorMethod: (method: 'sms' | 'authenticator' | 'email') => void;
  simulateAttack: () => void;
  createVirtualCard: (options: { brand: 'visa' | 'mastercard'; cardType: 'debit' | 'credit'; limit: number; theme: 'blue' | 'purple' | 'emerald' | 'gold' | 'dark' }) => void;
  clearReceipt: () => void;
  addFundsToAccount: (accountId: string, amount: number, memo: string) => void;
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id'>) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_PREFIX = 'aegis_bank_';

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'cards');
    return saved ? JSON.parse(saved) : initialCards;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'securityLogs');
    return saved ? JSON.parse(saved) : initialSecurityLogs;
  });

  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'sessions');
    return saved ? JSON.parse(saved) : initialActiveSessions;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'beneficiaries');
    return saved ? JSON.parse(saved) : initialBeneficiaries;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [hideBalances, setHideBalances] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [recentReceipt, setRecentReceipt] = useState<Transaction | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Inactivity session timer (180 seconds countdown)
  const SESSION_MAX_SECONDS = 180;
  const [sessionTimeoutRemaining, setSessionTimeoutRemaining] = useState<number>(SESSION_MAX_SECONDS);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'securityLogs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Inactivity countdown timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      setSessionTimeoutRemaining((prev) => {
        if (prev <= 1) {
          setIsAuthenticated(false);
          setIsSessionWarningOpen(false);
          playSound('alert');
          return 0;
        }
        if (prev === 45) {
          setIsSessionWarningOpen(true);
          playSound('alert');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const resetInactivityTimer = useCallback(() => {
    setSessionTimeoutRemaining(SESSION_MAX_SECONDS);
    setIsSessionWarningOpen(false);
  }, [SESSION_MAX_SECONDS]);

  // User activity listeners
  useEffect(() => {
    const handleActivity = () => {
      // Only reset timer if not in critical warning state
      setSessionTimeoutRemaining((prev) => (prev > 45 ? SESSION_MAX_SECONDS : prev));
    };

    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [SESSION_MAX_SECONDS]);

  const setActiveTab = (tab: string) => {
    playSound('click');
    setActiveTabState(tab);
    resetInactivityTimer();
  };

  const togglePrivacyMode = () => {
    playSound('click');
    setHideBalances((prev) => !prev);
  };

  const toggleTheme = () => {
    playSound('click');
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setAudioSoundEnabled(next);
    if (next) playSound('success');
  };

  const lockDashboard = () => {
    playSound('lock');
    setIsAuthenticated(false);
    setIsSessionWarningOpen(false);
  };

  const verifySecurityPin = (pin: string) => {
    return pin === user.pin;
  };

  const unlockWith2FA = (pinOrOtp: string) => {
    if (pinOrOtp === user.pin || pinOrOtp === '849201' || pinOrOtp.length === 6) {
      setIsAuthenticated(true);
      setSessionTimeoutRemaining(SESSION_MAX_SECONDS);
      setIsSessionWarningOpen(false);
      playSound('unlock');

      // Append security log
      const newLog: SecurityLog = {
        id: `sec_${Date.now()}`,
        timestamp: 'Just now',
        event: 'Dashboard unlocked via Multi-Factor 2FA Verification',
        severity: 'success',
        ipAddress: '192.168.1.108',
        device: 'MacBook Pro 16" (Sonoma)',
        location: 'San Francisco, CA, USA',
      };
      setSecurityLogs((prev) => [newLog, ...prev]);
      return true;
    }
    playSound('alert');
    return false;
  };

  const executeTransfer = (payload: TransferPayload) => {
    if (payload.pin !== user.pin) {
      playSound('alert');
      return { success: false, message: 'Invalid 4-digit Security PIN' };
    }

    const source = accounts.find((a) => a.id === payload.sourceAccountId);
    if (!source) {
      return { success: false, message: 'Source account not found' };
    }

    if (source.balance < payload.amount) {
      playSound('alert');
      return { success: false, message: 'Insufficient funds in selected account' };
    }

    // Deduct source account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === payload.sourceAccountId ? { ...acc, balance: acc.balance - payload.amount } : acc
      )
    );

    const refNum = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTxn: Transaction = {
      id: `tx_${Date.now()}`,
      reference: refNum,
      timestamp: formattedDate,
      description: `Transfer to ${payload.recipientName}`,
      amount: payload.amount,
      type: 'debit',
      category: payload.category || 'Transfer',
      status: 'completed',
      recipientName: payload.recipientName,
      recipientAccount: payload.recipientAccount,
      senderAccount: source.name,
      ipAddress: '192.168.1.108',
      location: 'San Francisco, CA',
      otpVerified: true,
      notes: payload.note || 'Encrypted Peer Transfer',
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Add security audit entry
    const secEntry: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Fund transfer ($${payload.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}) sent to ${payload.recipientName} (${payload.recipientAccount})`,
      severity: payload.amount > 2000 ? 'warning' : 'info',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((prev) => [secEntry, ...prev]);

    setRecentReceipt(newTxn);
    playSound('transfer');
    return { success: true, message: 'Transfer dispatched successfully via FedNow / Real-Time Rail', receipt: newTxn };
  };

  const toggleCardFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextStatus = c.status === 'active' ? 'frozen' : 'active';
          if (nextStatus === 'frozen') {
            playSound('lock');
          } else {
            playSound('unlock');
          }
          const log: SecurityLog = {
            id: `sec_${Date.now()}`,
            timestamp: 'Just now',
            event: `Card ${c.brand.toUpperCase()} ending in ${c.cardNumber.slice(-4)} ${
              nextStatus === 'frozen' ? 'FROZEN / LOCKED' : 'REACTIVATED'
            }`,
            severity: nextStatus === 'frozen' ? 'warning' : 'success',
            ipAddress: '192.168.1.108',
            device: 'MacBook Pro 16"',
            location: 'San Francisco, CA, USA',
          };
          setSecurityLogs((l) => [log, ...l]);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const updateCardLimit = (cardId: string, limit: number) => {
    playSound('click');
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, spendingLimit: limit } : c))
    );
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Card limit updated to $${limit.toLocaleString()}`,
      severity: 'info',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
  };

  const toggleCardControl = (cardId: string, control: keyof CardControls) => {
    playSound('click');
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            controls: {
              ...c.controls,
              [control]: !c.controls[control],
            },
          };
        }
        return c;
      })
    );
  };

  const terminateSession = (sessionId: string) => {
    playSound('click');
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Remote session terminated manually by user`,
      severity: 'warning',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
  };

  const terminateAllOtherSessions = () => {
    playSound('lock');
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `All remote secondary sessions terminated (Revoked tokens)`,
      severity: 'warning',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
  };

  const clearReceipt = () => {
    setRecentReceipt(null);
  };

  const addFundsToAccount = (accountId: string, amount: number, memo: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: acc.balance + amount } : acc))
    );
    const ref = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTxn: Transaction = {
      id: `tx_${Date.now()}`,
      reference: ref,
      timestamp: formattedDate,
      description: memo || 'Deposit / Direct Wire',
      amount,
      type: 'credit',
      category: 'Salary',
      status: 'completed',
      senderAccount: 'External Liquidity Provider',
      ipAddress: '192.168.1.108',
      location: 'San Francisco, CA',
      otpVerified: true,
    };
    setTransactions((prev) => [newTxn, ...prev]);
    playSound('success');
  };

  const addBeneficiary = (ben: Omit<Beneficiary, 'id'>) => {
    const newBen: Beneficiary = {
      ...ben,
      id: `ben_${Date.now()}`,
    };
    setBeneficiaries((prev) => [newBen, ...prev]);
    playSound('success');
  };

  const updateUserPin = (newPin: string): boolean => {
    setUser((prev) => ({ ...prev, pin: newPin }));
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: 'Master 4-digit Security PIN updated and re-hashed with Argon2id',
      severity: 'success',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
    playSound('success');
    return true;
  };

  const toggle2FA = () => {
    const nextState = !user.twoFactorEnabled;
    const newScore = nextState ? Math.min(100, user.securityScore + 25) : Math.max(50, user.securityScore - 25);
    setUser((prev) => ({
      ...prev,
      twoFactorEnabled: nextState,
      securityScore: newScore,
    }));
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Multi-Factor Authentication (2FA) ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}`,
      severity: nextState ? 'success' : 'alert',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
    playSound(nextState ? 'success' : 'alert');
  };

  const setTwoFactorMethod = (method: 'sms' | 'authenticator' | 'email') => {
    setUser((prev) => ({ ...prev, twoFactorMethod: method }));
    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Primary 2FA delivery protocol switched to ${method.toUpperCase()}`,
      severity: 'info',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
    playSound('click');
  };

  const simulateAttack = () => {
    const attackTypes = [
      'Credential stuffing brute-force attack from TOR exit node',
      'Suspicious API replay signature with mismatched nonce',
      'Distributed anomaly detected on edge gateway',
      'Unauthorized session hijacking attempt blocked by IP pin',
    ];
    const chosenAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const randomIp = `${Math.floor(45 + Math.random() * 150)}.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.${Math.floor(Math.random() * 250)}`;

    const newLog: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `[DEFENSE TRIGGERED] ${chosenAttack} (${randomIp})`,
      severity: 'alert',
      ipAddress: randomIp,
      device: 'Automated Exploit Scanner v4',
      location: 'Unknown Proxy / Edge Relays',
    };

    setSecurityLogs((prev) => [newLog, ...prev]);
    playSound('alert');
  };

  const createVirtualCard = (options: {
    brand: 'visa' | 'mastercard';
    cardType: 'debit' | 'credit';
    limit: number;
    theme: 'blue' | 'purple' | 'emerald' | 'gold' | 'dark';
  }) => {
    const prefix = options.brand === 'visa' ? '4719' : '5318';
    const randDigits = () => Math.floor(1000 + Math.random() * 9000);
    const newCardNumber = `${prefix} ${randDigits()} ${randDigits()} ${randDigits()}`;
    const newCvv = String(Math.floor(100 + Math.random() * 900));
    const now = new Date();
    const expiry = `0${(now.getMonth() + 1)}/${String(now.getFullYear() + 4).slice(-2)}`;

    const newCard: Card = {
      id: `crd_${Date.now()}`,
      cardNumber: newCardNumber,
      cardHolder: `${user.name.toUpperCase()} (VIRTUAL)`,
      expiry,
      cvv: newCvv,
      brand: options.brand,
      status: 'active',
      cardType: options.cardType,
      spendingLimit: options.limit,
      currentSpent: 0,
      pin: user.pin,
      colorTheme: options.theme,
      controls: {
        onlinePayments: true,
        internationalUsage: false,
        atmWithdrawals: false,
        contactless: true,
      },
    };

    setCards((prev) => [newCard, ...prev]);

    const log: SecurityLog = {
      id: `sec_${Date.now()}`,
      timestamp: 'Just now',
      event: `Instant Virtual ${options.brand.toUpperCase()} card generated (ending ${newCardNumber.slice(-4)}) with $${options.limit} limit`,
      severity: 'success',
      ipAddress: '192.168.1.108',
      device: 'MacBook Pro 16"',
      location: 'San Francisco, CA, USA',
    };
    setSecurityLogs((l) => [log, ...l]);
    playSound('success');
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(initialUser);
    setAccounts(initialAccounts);
    setCards(initialCards);
    setTransactions(initialTransactions);
    setSecurityLogs(initialSecurityLogs);
    setSessions(initialActiveSessions);
    setBeneficiaries(initialBeneficiaries);
    setIsAuthenticated(true);
    setSessionTimeoutRemaining(SESSION_MAX_SECONDS);
    playSound('success');
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        accounts,
        cards,
        transactions,
        securityLogs,
        sessions,
        beneficiaries,
        isAuthenticated,
        activeTab,
        hideBalances,
        theme,
        soundEnabled,
        sessionTimeoutRemaining,
        isSessionWarningOpen,
        recentReceipt,
        isMobileSidebarOpen,
        setActiveTab,
        togglePrivacyMode,
        toggleTheme,
        toggleSound,
        setIsMobileSidebarOpen,
        executeTransfer,
        toggleCardFreeze,
        updateCardLimit,
        toggleCardControl,
        verifySecurityPin,
        updateUserPin,
        terminateSession,
        terminateAllOtherSessions,
        resetInactivityTimer,
        lockDashboard,
        unlockWith2FA,
        toggle2FA,
        setTwoFactorMethod,
        simulateAttack,
        createVirtualCard,
        clearReceipt,
        addFundsToAccount,
        addBeneficiary,
        resetAllData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
