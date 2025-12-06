import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OpportunitiesMap from './components/OpportunitiesMap';
import ProductRecommender from './components/ProductRecommender';
import MarketIntelligence from './components/MarketIntelligence';
import StrategicAnalysis from './components/StrategicAnalysis';
import OperationsManager from './components/OperationsManager';
import CompetitiveIntelligence from './components/CompetitiveIntelligence';

import RetrofitCalculator from './components/RetrofitCalculator';
import ReportCenter from './components/ReportCenter';
import Settings from './components/Settings';
import Login from './components/Login';
import './App.css';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log('Searching for:', e.target.value);
  };

  const handleLogin = (userData) => {
    // userData comes from backend with { id, name, email, role }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <main className="main-content">
        {/* Header */}
        <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div className="flex items-center gap-2" style={{ background: 'var(--color-bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', width: '300px' }}>
            <Search size={18} className="text-secondary" />
            <input
              type="text"
              placeholder="Buscar productos, regiones..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', width: '100%', outline: 'none' }}
            />
          </div>

          <div className="flex items-center gap-4" style={{ marginRight: '1.5rem' }}>
            <button style={{ position: 'relative' }}>
              <Bell size={20} className="text-secondary" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--color-danger)', borderRadius: '50%' }}></span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={20} className="text-secondary" /> : <Moon size={20} className="text-secondary" />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogout} title="Cerrar Sesión">
              <div style={{ width: '32px', height: '32px', background: 'var(--color-bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <span className="text-sm font-bold">{user?.name}</span>
              {user?.role === 'viewer' && <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Visita</span>}
            </div>
          </div>
        </header>

        {/* Content Area */}
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'opportunities' && <OpportunitiesMap />}
        {activeTab === 'products' && <ProductRecommender />}
        {activeTab === 'market' && <MarketIntelligence />}
        {activeTab === 'strategy' && <StrategicAnalysis />}
        {activeTab === 'operations' && <OperationsManager />}
        {activeTab === 'competitive' && <CompetitiveIntelligence />}
        {activeTab === 'competitive' && <CompetitiveIntelligence />}
        {activeTab === 'retrofit' && <RetrofitCalculator />}
        {activeTab === 'reports' && <ReportCenter />}
        {activeTab === 'settings' && <Settings autoUpdate={autoUpdate} setAutoUpdate={setAutoUpdate} />}
      </main>
    </div>
  );
}

export default App;
