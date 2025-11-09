import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Briefcase, Bell, Settings, Search } from 'lucide-react';
import { useStore } from './store';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PortfolioPage from './pages/PortfolioPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import StockDetailPage from './pages/StockDetailPage';
import HelpPage from './pages/HelpPage';
import OnboardingModal from './components/OnboardingModal';
import './App.css';

function App() {
  const { settings } = useStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // サービスワーカー登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        () => console.log('Service Worker registered'),
        (err) => console.log('Service Worker registration failed:', err)
      );
    }

    // 通知権限リクエスト
    if (settings.notifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // 初回起動チェック
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [settings.notifications]);

  return (
    <Router>
      <div className={`app ${settings.darkMode ? 'dark' : ''}`}>
        {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'ホーム' },
    { path: '/search', icon: Search, label: '検索' },
    { path: '/portfolio', icon: Briefcase, label: '資産' },
    { path: '/alerts', icon: Bell, label: '通知' },
    { path: '/settings', icon: Settings, label: '設定' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${location.pathname === path ? 'active' : ''}`}
        >
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default App;
