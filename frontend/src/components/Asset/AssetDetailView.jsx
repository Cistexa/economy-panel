import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  BarChart2,
  Coins
} from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import TradingViewChart from '../Chart/TradingViewChart';
import './AssetDetailView.css';

const AssetDetailView = ({ type = 'stock' }) => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCrypto = type === 'crypto';
  const apiEndpoint = isCrypto ? `/crypto/${symbol}` : `/stocks/${symbol}`;
  const backPath = isCrypto ? '/crypto' : '/stocks';
  const backLabel = isCrypto ? 'Kripto Paralar Piyasası' : 'Hisseler Listesi';

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(apiEndpoint);
        setAsset(res.data);
      } catch (err) {
        console.error(`Failed to load ${type} detail:`, err);
        setError(err.response?.data?.message || `${symbol} varlığı bulunamadı.`);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchDetail();
    }
  }, [symbol, apiEndpoint, type]);

  if (loading) {
    return (
      <div className="asset-detail-page">
        <LoadingSpinner text={`${symbol?.toUpperCase()} verileri yükleniyor...`} />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="asset-detail-page">
        <div className="detail-error glass-panel">
          <h2>{isCrypto ? 'Kripto Varlık Bulunamadı' : 'Hisse Bulunamadı'}</h2>
          <p>{error || 'İstenen varlık verisi alınamadı.'}</p>
          <div className="error-actions">
            <button className="btn btn-secondary" onClick={() => navigate(backPath)}>
              <ArrowLeft size={16} />
              <span>{backLabel}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPos = asset.dayChange >= 0;
  const currencySymbol = isCrypto ? '$' : (asset.currency === 'TRY' ? '₺' : '$');
  const exchangeLabel = asset.exchange || (isCrypto ? 'BINANCE' : 'BIST');
  const categoryLabel = (isCrypto ? asset.category : asset.sector) || (isCrypto ? 'Kripto' : 'Genel');

  const formatPrice = (num) => {
    if (num === undefined || num === null) return '0.00';
    const decimals = num < 1 ? 4 : 2;
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  return (
    <div className="asset-detail-page">
      {/* Top Bar Navigation */}
      <div className="detail-top-bar">
        <button className="btn-back" onClick={() => navigate(backPath)}>
          <ArrowLeft size={18} />
          <span>{backLabel}</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="asset-header-card glass-panel">
        <div className="asset-header-info">
          <div className={`asset-avatar ${isCrypto ? 'crypto' : 'stock'}`}>
            {isCrypto ? <Coins size={28} color="#ffffff" /> : asset.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="asset-title-row">
              <h1>{asset.symbol}</h1>
              <span className={`badge ${isCrypto ? 'badge-crypto' : 'badge-exchange'}`}>
                {exchangeLabel}
              </span>
              <span className="badge badge-sector">{categoryLabel}</span>
            </div>
            <p className="asset-company-name">{asset.name}</p>
          </div>
        </div>

        <div className="asset-header-price">
          <div className="main-price">
            {currencySymbol}{formatPrice(asset.price)}
          </div>
          <div className={`change-badge ${isPos ? 'pos' : 'neg'}`}>
            {isPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{isPos ? '+' : ''}{asset.dayChange}% (24s)</span>
          </div>
        </div>

        <div className="asset-header-actions">
          <Link to="/wallet" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Cüzdanıma Ekle</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <span className="stat-label">Günlük Değişim (24s)</span>
          <div className={`stat-val ${asset.dayChange >= 0 ? 'pos' : 'neg'}`}>
            {asset.dayChange >= 0 ? `+${asset.dayChange}%` : `${asset.dayChange}%`}
          </div>
          <span className="stat-sub">Önceki Kapanış: {currencySymbol}{formatPrice(asset.dailyPreviousClose)}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">Aylık Performans (30g)</span>
          <div className={`stat-val ${asset.monthChange >= 0 ? 'pos' : 'neg'}`}>
            {asset.monthChange >= 0 ? `+${asset.monthChange}%` : `${asset.monthChange}%`}
          </div>
          <span className="stat-sub">Ay Başı Fiyat: {currencySymbol}{formatPrice(asset.monthAgoPrice)}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">Yıllık Performans (1y)</span>
          <div className={`stat-val ${asset.yearChange >= 0 ? 'pos' : 'neg'}`}>
            {asset.yearChange >= 0 ? `+${asset.yearChange}%` : `${asset.yearChange}%`}
          </div>
          <span className="stat-sub">Yıl Başı Fiyat: {currencySymbol}{formatPrice(asset.yearAgoPrice)}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">52 Haftalık Aralık (Min - Max)</span>
          <div className="stat-val highlight">
            {currencySymbol}{formatPrice(asset.low52w)} - {currencySymbol}{formatPrice(asset.high52w)}
          </div>
          <span className="stat-sub">Borsa: {exchangeLabel}</span>
        </div>
      </div>

      {/* Interactive Price Chart Section */}
      <div className="chart-section glass-panel">
        <div className="chart-header">
          <div className="chart-title">
            <BarChart2 size={20} className={`chart-icon ${isCrypto ? 'crypto' : 'stock'}`} />
            <h3>TradingView Teknik Grafik & Çizim Araçları</h3>
          </div>
        </div>

        <TradingViewChart
          chartHistory={asset.chartHistory}
          symbol={asset.symbol}
          isPositive={isPos}
          currency={currencySymbol}
        />
      </div>
    </div>
  );
};

export default AssetDetailView;
