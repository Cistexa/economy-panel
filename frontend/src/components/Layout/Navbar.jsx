import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import api from '../../api/axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      try {
        const res = await api.get(`/stocks/search?q=${val}`);
        setSearchResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectResult = (item) => {
    setShowDropdown(false);
    setQuery('');
    if (item.type === 'stock') {
      navigate(`/stocks/${item.symbol}`);
    } else {
      navigate('/crypto');
    }
  };

  return (
    <header className="navbar glass-panel">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Hisse senedi veya kripto ara... (örn: THYAO, BTC, AAPL)"
          value={query}
          onChange={handleSearch}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onFocus={() => query && setShowDropdown(true)}
        />

        {showDropdown && searchResults.length > 0 && (
          <div className="search-results-dropdown glass-panel">
            {searchResults.map((item) => (
              <div
                key={item.symbol}
                className="search-result-item"
                onMouseDown={() => handleSelectResult(item)}
              >
                <div className="search-result-left">
                  <span className="symbol-badge">{item.symbol}</span>
                  <span className="name">{item.name}</span>
                </div>
                <div className="search-result-right">
                  <span className="price">{item.currency === 'TRY' ? '₺' : '$'}{item.price}</span>
                  <span className={`type-tag ${item.type}`}>{item.type === 'stock' ? 'Hisse' : 'Kripto'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-actions">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-text">Canlı Piyasalar</span>
        </div>

        <button className="icon-btn" title="Bildirimler">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
