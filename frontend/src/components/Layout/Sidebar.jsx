import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Coins, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/stocks', name: 'Hisse Senetleri', icon: TrendingUp },
    { path: '/crypto', name: 'Kripto Paralar', icon: Coins },
    { path: '/wallet', name: 'Cüzdanım', icon: Wallet },
    { path: '/settings', name: 'Ayarlar', icon: Settings },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <TrendingUp size={24} color="#6366f1" />
          </div>
          <div className="logo-text">
            <h2>Economy</h2>
            <span>PANEL</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <div className="nav-item-content">
                <Icon size={20} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={16} className="nav-arrow" />
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || user?.username}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <button className="btn-logout" onClick={logout}>
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
