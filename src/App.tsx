import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimModal } from './components/ClaimModal';
import { ContactModal } from './components/ContactModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BrowsePage } from './pages/BrowsePage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportItemPage } from './pages/ReportItemPage';
import { MatchesPage } from './pages/MatchesPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactHelpPage } from './pages/ContactHelpPage';

import { Item, ItemType } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [browseFilter, setBrowseFilter] = useState<string>('');

  // Modals state
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [claimItem, setClaimItem] = useState<Item | null>(null);
  const [contactItem, setContactItem] = useState<Item | null>(null);

  const handleNav = (tab: string, filter?: string) => {
    setCurrentTab(tab);
    if (filter !== undefined) {
      setBrowseFilter(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewItem = (item: Item) => {
    setDetailItem(item);
  };

  const handleClaimItem = (item: Item) => {
    setDetailItem(null);
    setClaimItem(item);
  };

  const handleContactItem = (item: Item) => {
    setDetailItem(null);
    setContactItem(item);
  };

  const handleViewItemById = async (itemId: string) => {
    try {
      const res = await api.getItem(itemId);
      setDetailItem(res.item);
    } catch {
      // fallback
    }
  };

  const handleContactItemById = async (itemId: string) => {
    try {
      const res = await api.getItem(itemId);
      setContactItem(res.item);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={handleNav} />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNav={handleNav}
            onViewItem={handleViewItem}
            onClaimItem={handleClaimItem}
          />
        )}

        {currentTab === 'browse' && (
          <BrowsePage
            initialFilter={browseFilter}
            onViewItem={handleViewItem}
            onClaimItem={handleClaimItem}
            onReport={(type: ItemType) => handleNav(type === 'lost' ? 'report_lost' : 'report_found')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNav={handleNav}
            onViewItem={handleViewItem}
            onClaimItem={handleClaimItem}
          />
        )}

        {currentTab === 'report_lost' && (
          <ReportItemPage
            initialType="lost"
            onSuccess={() => handleNav('my_reports')}
            onNav={handleNav}
          />
        )}

        {currentTab === 'report_found' && (
          <ReportItemPage
            initialType="found"
            onSuccess={() => handleNav('my_reports')}
            onNav={handleNav}
          />
        )}

        {currentTab === 'matches' && (
          <MatchesPage
            onViewItem={handleViewItem}
            onClaimItem={handleClaimItem}
            onNav={handleNav}
          />
        )}

        {currentTab === 'my_reports' && (
          <MyReportsPage
            onNav={handleNav}
            onViewItem={handleViewItem}
            onReport={(type: ItemType) => handleNav(type === 'lost' ? 'report_lost' : 'report_found')}
          />
        )}

        {currentTab === 'my_claims' && (
          <MyClaimsPage
            onNav={handleNav}
            onViewItemById={handleViewItemById}
            onContactItemById={handleContactItemById}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage onNav={handleNav} />
        )}

        {currentTab === 'profile' && (
          <ProfilePage onNav={handleNav} />
        )}

        {currentTab === 'admin' && (
          <AdminPage />
        )}

        {currentTab === 'how_it_works' && (
          <HowItWorksPage onNav={handleNav} />
        )}

        {currentTab === 'contact_help' && (
          <ContactHelpPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNav={handleNav} />

      {/* Global Interactive Modals */}
      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onClaim={handleClaimItem}
        onContact={handleContactItem}
        onItemUpdated={() => {
          // refresh any view if needed
        }}
      />

      <ClaimModal
        item={claimItem}
        onClose={() => setClaimItem(null)}
        onClaimSubmitted={() => {
          handleNav('my_claims');
        }}
      />

      <ContactModal
        item={contactItem}
        onClose={() => setContactItem(null)}
      />

      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
