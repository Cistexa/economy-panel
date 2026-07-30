import React from 'react';
import TopMovers from '../components/Dashboard/TopMovers';
import { Wallet, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-panel">
        <div className="banner-text">
          <h1>Hoş geldin, {user?.fullName || user?.username}! 👋</h1>
          <p>Bugünün piyasa özetini ve cüzdan durumunu buradan canlı olarak takip edebilirsin.</p>
        </div>
        <div className="banner-stats">
          <div className="quick-stat">
            <div className="stat-icon purple">
              <Activity size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Borsa Trendi</span>
              <span className="stat-value positive">+1.85%</span>
            </div>
          </div>

          <div className="quick-stat">
            <div className="stat-icon green">
              <TrendingUp size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Kripto Hacmi</span>
              <span className="stat-value">$84.2B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Movers Component */}
      <TopMovers />
    </div>
  );
};

export default DashboardPage;
