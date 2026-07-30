import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './StocksPage.css';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get('/stocks');
        setStocks(res.data);
      } catch (err) {
        console.error('Failed to load stocks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const sectors = ['ALL', ...new Set(stocks.map((s) => s.sector).filter(Boolean))];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="stocks-page">
      <div className="page-header">
        <div>
          <h1>Hisse Senetleri Piyasası</h1>
          <p>BIST ve Küresel borsalardaki hisse senetlerinin anlık durumları</p>
        </div>

        <div className="filters-bar glass-panel">
          <div className="filter-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Hisse ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <Filter size={16} />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'Tüm Sektörler' : sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Hisse verileri yükleniyor..." />
      ) : (
        <div className="stocks-table-container glass-panel">
          <table className="stocks-table">
            <thead>
              <tr>
                <th>Sembol & Şirket</th>
                <th>Sektör</th>
                <th>Fiyat</th>
                <th>Günlük (24s)</th>
                <th>Aylık (30g)</th>
                <th>Yıllık (1y)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="symbol-cell">
                    <div className="symbol-icon">{stock.symbol.slice(0, 2)}</div>
                    <div>
                      <div className="symbol-title">{stock.symbol}</div>
                      <div className="symbol-subtitle">{stock.name}</div>
                    </div>
                  </td>
                  <td>
                    <span className="sector-badge">{stock.sector}</span>
                  </td>
                  <td className="price-cell">₺{stock.price.toFixed(2)}</td>
                  <td>
                    <span className={`change-pill ${stock.dayChange >= 0 ? 'pos' : 'neg'}`}>
                      {stock.dayChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stock.dayChange >= 0 ? `+${stock.dayChange}%` : `${stock.dayChange}%`}
                    </span>
                  </td>
                  <td>
                    <span className={`change-pill ${stock.monthChange >= 0 ? 'pos' : 'neg'}`}>
                      {stock.monthChange >= 0 ? `+${stock.monthChange}%` : `${stock.monthChange}%`}
                    </span>
                  </td>
                  <td>
                    <span className={`change-pill ${stock.yearChange >= 0 ? 'pos' : 'neg'}`}>
                      {stock.yearChange >= 0 ? `+${stock.yearChange}%` : `${stock.yearChange}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StocksPage;
