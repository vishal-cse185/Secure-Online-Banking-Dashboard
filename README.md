# 🛡️ AegisBank - Enterprise-Grade Secure Online Banking Dashboard

An institutional-grade, zero-trust online banking dashboard web application built with **React 19**, **TypeScript**, **Vite**, and **Modern CSS**. Designed for high-assurance financial operations with simulated end-to-end encryption, multi-factor biometric & OTP authentication, virtual card controls, real-time intrusion anomaly defense, and tamper-proof cryptographic audit ledgers.

---

## ✨ Key Features & Capabilities

### 1. 🔐 Zero-Trust Security Architecture
- **Multi-Factor Authentication (MFA / 2FA)**:
  - Master 4-digit zero-knowledge PIN protection (`1234`).
  - Simulated Time-based One-Time Password (TOTP) and SMS verification (`849201` or any 6-digit code).
  - Simulated FIDO2 / WebAuthn / Touch ID biometric authentication.
  - Brute-force rate limiting with temporary account lockouts after 3 consecutive failures.
- **Inactivity & Shoulder-Surfing Auto-Lock**:
  - Live 180-second countdown timer reset on user keystrokes and clicks.
  - 45-second critical warning modal with one-click session renewal or immediate lockdown.
- **Privacy Mode (Shoulder-Surfing Shield)**:
  - Instant balance masking across checking, high-yield vaults, investment portfolios, and virtual cards.
- **Live SOC 2 Type II Security Operations Center**:
  - Cryptographic append-only ledger tracking all authentication attempts, fund transfers, card status alterations, and IP movements.
  - Real-time intrusion simulation with AI threat defense against credential stuffing and distributed proxy anomalies.
  - One-click export of verified cryptographic audit logs (JSON format with simulated SHA-256 integrity hash).

### 2. 💳 Virtual & Physical Card Shield
- **Interactive 3D Card Flipper**:
  - Realistic card rendering with EMV chip, contactless NFC icon, and custom brand themes (Emerald Navy, Obsidian Gold, Deep Royal, Violet Prism, Midnight Dark).
  - 3D flip animation displaying reverse side: magnetic stripe, signature panel, and security helpline.
- **PIN-Gated CVV Obfuscation**:
  - CVV / CVC digits masked by default; requires master security PIN to decrypt.
- **Card Freeze Killswitch**:
  - Instantaneous freeze / unfreeze toggle with immediate transaction decline simulation.
- **Granular Controls & Spending Thresholds**:
  - Interactive daily slider limit ($500 – $20,000) with visual percentage utilization.
  - Toggle controls for online e-commerce, international transactions, ATM withdrawals, and contactless tap-to-pay.
- **Instant Virtual Card Issuance**:
  - Generate burner virtual cards on demand with customizable limits, card networks (Visa/Mastercard), and themes.

### 3. 💸 Encrypted Fund Wires & FedNow Transfers
- **Real-Time Balance Validation**:
  - Dynamic source account selection (Checking, Savings Vault, Investment) with automatic balance insufficiency guardrails.
- **Quick-Send Beneficiary Directory**:
  - Preset verified recipients with one-click autofill.
  - Add new verified external beneficiaries with account and routing validation.
- **AI Anomaly Detection**:
  - Transfers $\ge \$2,000$ trigger automatic high-value security advisory and audit log tagging.
- **Cryptographic Receipt Modal**:
  - Generates verifiable FedNow / Wire transfer receipt with transaction reference ID, zero network fee verification, and printable voucher.

### 4. 📊 Financial Intelligence & Analytics
- **Dynamic Cash Flow Tracking**:
  - Comparative visualization of monthly deposits versus expenditures.
  - Category breakdown with proportional progress indicators (Transfers, Shopping, Dining, Utilities, Salary).
  - Net capital retention ratio and yield compounding indicators.

### 5. 🎨 Design & Experience
- **Fintech Navy Dark Mode & Clean Light Mode**:
  - Seamless dark/light theme toggle.
- **Responsive Layout**:
  - Fixed desktop sidebar with collapsible slide-in mobile navigation drawer.
- **Synthesized Web Audio Feedback**:
  - Zero-asset audio cues generated dynamically with Web Audio API oscillators (subtle button clicks, success chimes, alert pulses, and lock sounds). Muteable with a single click.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Navigate to the project directory
cd secure-banking-dashboard

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:5174/` in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔑 Demo Credentials

| Credential | Value | Description |
| :--- | :--- | :--- |
| **Master Security PIN** | `1234` | Used for 2FA login, CVV reveal, and wire authorization |
| **Simulated 2FA OTP** | `849201` | Or any valid 6-digit code |
| **Account Tier** | Platinum Security | FIPS 140-2 Level 4 Verified |

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── AnalyticsView.tsx        # Financial intelligence & outflow analytics
│   ├── AuthModal.tsx            # Multi-factor authentication & lockout modal
│   ├── CardsManager.tsx         # 3D cards, CVV encryption, & virtual card issuer
│   ├── DashboardOverview.tsx    # Primary liquidity overview & quick actions
│   ├── Navbar.tsx               # Security status, session timer, audio, & theme
│   ├── ReceiptModal.tsx         # Cryptographic transaction confirmation receipt
│   ├── SecurityCenter.tsx       # SOC2 audit trail, intrusion simulation, & 2FA
│   ├── SessionTimeoutModal.tsx  # Inactivity countdown & auto-lock modal
│   ├── Sidebar.tsx              # Operations navigation & 24/7 fraud helpline
│   ├── TransactionsView.tsx     # Filterable audit ledger with CSV export
│   └── TransfersView.tsx        # Encrypted wire transfers with fraud filter
├── context/
│   └── BankingContext.tsx       # Global state management & local storage sync
├── services/
│   └── mockData.ts              # Institutional mock profiles, accounts, & cards
├── types/
│   └── index.ts                 # Strict TypeScript interface definitions
├── utils/
│   └── audio.ts                 # Web Audio API harmonic synthesizer
├── App.tsx                      # View router & modal orchestration
├── index.css                    # Design system, glassmorphism, & animations
└── main.tsx                     # React entrypoint
```

---

## 📜 Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Icons**: Lucide React
- **Audio**: Web Audio API (native browser synthesis, zero external mp3 dependencies)
- **Styling**: Modern CSS3 (CSS Variables, Glassmorphism, 3D Transforms, Responsive Media Queries)
- **Linter**: Oxlint
