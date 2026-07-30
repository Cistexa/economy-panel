import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StockCard.css';

const StockCard = ({ item, isGainer = true }) => {
  const change = item.changePercent;
  const isPositive = change >= 0;

  return (
    <div className={`stock-card glass-panel ${isPositive ? 'gainer' : 'loser'}`}>
      <div className="stock-card-header">
        <div className="symbol-info">
          <span className="stock-symbol">{item.symbol}</span>
          <span className="stock-name">{item.name}</span>
        </div>
        <div className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{isPositive ? `+${change}%` : `${change}%`}</span>
        </div>
      </div>

      <div className="stock-card-footer">
        <div className="price-tag">
          <span className="label">Fiyat</span>
          <span className="value">₺{item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
        </div>
        {item.sector && (
          <div className="sector-tag">
            <span>{item.sector}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCard;
