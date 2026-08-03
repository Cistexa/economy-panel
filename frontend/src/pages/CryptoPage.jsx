import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, TrendingUp, TrendingDown, Search } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './CryptoPage.css';

const CryptoPage = () => {
  const navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await api.get('/crypto');
        setCryptos(res.data);
      } catch (err) {
        console.error('Failed to load cryptos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
  }, []);

  const filteredCryptos = cryptos.filter(
    (c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crypto-page">
      <div className="page-header">
        <div>
          <h1>Kripto Varlıklar Piyasası</h1>
          <p>Kripto para piyasasındaki popüler varlıkların fiyat ve değişim oranları</p>
        </div>

        <div className="filters-bar glass-panel">
          <div className="filter-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Kripto ara... (BTC, ETH, SOL)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Kripto verileri yükleniyor..." />
      ) : (
        <div className="crypto-grid">
          {filteredCryptos.map((crypto) => (
            <div
              key={crypto.symbol}
              className="crypto-card glass-panel"
              onClick={() => navigate(`/crypto/${crypto.symbol}`)}
            >
              <div className="crypto-card-top">
                <div className="crypto-icon-box">
                  <Coins size={22} color="#f59e0b" />
                </div>
                <div className="crypto-title">
                  <h3>{crypto.name}</h3>
                  <span className="crypto-symbol">{crypto.symbol}</span>
                </div>
              </div>

              <div className="crypto-price-box">
                <span className="price-label">Güncel Fiyat</span>
                <div className="price-val">${crypto.price.toLocaleString()}</div>
              </div>

              <div className="crypto-changes-row">
                <div className="change-item">
                  <span className="ch-label">24s</span>
                  <span className={`ch-val ${crypto.dayChange >= 0 ? 'pos' : 'neg'}`}>
                    {crypto.dayChange >= 0 ? `+${crypto.dayChange}%` : `${crypto.dayChange}%`}
                  </span>
                </div>

                <div className="change-item">
                  <span className="ch-label">30g</span>
                  <span className={`ch-val ${crypto.monthChange >= 0 ? 'pos' : 'neg'}`}>
                    {crypto.monthChange >= 0 ? `+${crypto.monthChange}%` : `${crypto.monthChange}%`}
                  </span>
                </div>

                <div className="change-item">
                  <span className="ch-label">1y</span>
                  <span className={`ch-val ${crypto.yearChange >= 0 ? 'pos' : 'neg'}`}>
                    {crypto.yearChange >= 0 ? `+${crypto.yearChange}%` : `${crypto.yearChange}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoPage;
