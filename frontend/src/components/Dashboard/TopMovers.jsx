import React, { useState, useEffect } from 'react';
import { Flame, ArrowDownRight, Calendar, Layers } from 'lucide-react';
import StockCard from './StockCard';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import './TopMovers.css';

const TopMovers = () => {
  const [period, setPeriod] = useState('day'); // 'day', 'month', 'year'
  const [data, setData] = useState({ topGainers: [], topLosers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stocks/top-movers?period=${period}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch top movers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, [period]);

  const periodLabels = {
    day: 'Günün (24s)',
    month: 'Ayın (30g)',
    year: 'Yılın (1y)',
  };

  return (
    <div className="top-movers-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Piyasa Özeti</h2>
          <p>Seçilen döneme göre en yüksek prim yapan ve en çok gerileyen hisse senetleri</p>
        </div>

        <div className="period-tabs glass-panel">
          {Object.keys(periodLabels).map((p) => (
            <button
              key={p}
              className={`period-tab ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              <Calendar size={14} />
              <span>{periodLabels[p]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Piyasa verileri yükleniyor..." />
      ) : (
        <div className="movers-grid">
          {/* Top Gainers Column */}
          <div className="movers-column glass-panel">
            <div className="column-header gainers-header">
              <div className="column-title">
                <Flame size={20} className="icon-gainer" />
                <h3>{periodLabels[period]} En Çok Kazandıranlar</h3>
              </div>
              <span className="badge badge-success">Top 5 Kazanan</span>
            </div>

            <div className="cards-list">
              {data.topGainers.map((stock) => (
                <StockCard key={stock.symbol} item={stock} isGainer={true} />
              ))}
            </div>
          </div>

          {/* Top Losers Column */}
          <div className="movers-column glass-panel">
            <div className="column-header losers-header">
              <div className="column-title">
                <ArrowDownRight size={20} className="icon-loser" />
                <h3>{periodLabels[period]} En Çok Kaybettirenler</h3>
              </div>
              <span className="badge badge-danger">Top 5 Düşen</span>
            </div>

            <div className="cards-list">
              {data.topLosers.map((stock) => (
                <StockCard key={stock.symbol} item={stock} isGainer={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopMovers;
