import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { TransfersView } from './components/TransfersView';
import { CardsManager } from './components/CardsManager';
import { TransactionsView } from './components/TransactionsView';
import { SecurityCenter } from './components/SecurityCenter';
import { AnalyticsView } from './components/AnalyticsView';
import { AuthModal } from './components/AuthModal';
import { SessionTimeoutModal } from './components/SessionTimeoutModal';
import { ReceiptModal } from './components/ReceiptModal';

const DashboardContent: React.FC = () => {
  const { activeTab, isMobileSidebarOpen, setIsMobileSidebarOpen } = useBanking();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'transfers':
        return <TransfersView />;
      case 'cards':
        return <CardsManager />;
      case 'transactions':
        return <TransactionsView />;
      case 'security':
        return <SecurityCenter />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper">{renderActiveView()}</main>
      </div>

      {/* Global Security Modals */}
      <AuthModal />
      <SessionTimeoutModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <DashboardContent />
    </BankingProvider>
  );
}
