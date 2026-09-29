export type AccountType = 'checking' | 'savings' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber: string;
  balance: number;
  currency: string;
  routingNumber: string;
  apy?: number;
  isPrimary?: boolean;
}

export interface CardControls {
  onlinePayments: boolean;
  internationalUsage: boolean;
  atmWithdrawals: boolean;
  contactless: boolean;
}

export interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  brand: 'visa' | 'mastercard';
  status: 'active' | 'frozen';
  cardType: 'debit' | 'credit';
  spendingLimit: number;
  currentSpent: number;
  pin: string;
  colorTheme: 'blue' | 'purple' | 'emerald' | 'gold' | 'dark';
  controls: CardControls;
}

export type TransactionCategory =
  | 'Transfer'
  | 'Salary'
  | 'Groceries'
  | 'Utilities'
  | 'Dining'
  | 'Entertainment'
  | 'Shopping'
  | 'Investment'
  | 'Security';

export type TransactionStatus = 'completed' | 'pending' | 'flagged';

export interface Transaction {
  id: string;
  reference: string;
  timestamp: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  status: TransactionStatus;
  recipientName?: string;
  recipientAccount?: string;
  senderAccount?: string;
  ipAddress: string;
  location: string;
  otpVerified?: boolean;
  notes?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  ipAddress: string;
  device: string;
  location: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  location: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  email: string;
  avatar: string;
  isQuickSend: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator' | 'email';
  securityScore: number;
  lastLogin: string;
  accountTier: 'Platinum Security' | 'Standard' | 'Private Client';
  pin: string; // 4-digit security PIN
}

export interface TransferPayload {
  sourceAccountId: string;
  recipientName: string;
  recipientAccount: string;
  bankName: string;
  amount: number;
  category: TransactionCategory;
  note: string;
  pin: string;
}
