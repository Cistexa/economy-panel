import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Layers, 
  Globe, 
  Search, 
  PlusCircle, 
  Calendar,
  BarChart2,
  ShieldCheck
} from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './StockDetailPage.css';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input state on the detail page
  const [searchInput, setSearchInput] = useState('');
  // Timeframe selector for chart (1M, 1Y)
  const [timeframe, setTimeframe] = useState('1Y');
  // Hovered chart point
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/stocks/${symbol}`);
        setStock(res.data);
      } catch (err) {
        console.error('Failed to load stock detail:', err);
        setError(err.response?.data?.message || `${symbol} hisse senedi bulunamadı.`);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchDetail();
    }
  }, [symbol]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/stocks/${searchInput.trim().toUpperCase()}`);
      setSearchInput('');
    }
  };

  if (loading) {
    return (
      <div className="stock-detail-page">
        <LoadingSpinner text={`${symbol?.toUpperCase()} verileri yükleniyor...`} />
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="stock-detail-page">
        <div className="detail-error glass-panel">
          <h2>Hisse Bulunamadı</h2>
          <p>{error || 'İstenen hisse senedi verisi alınamadı.'}</p>
          <div className="error-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/stocks')}>
              <ArrowLeft size={16} />
              <span>Hisselere Dön</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPos = stock.dayChange >= 0;
  const currencySymbol = stock.currency === 'TRY' ? '₺' : '$';

  // Filter chart history based on timeframe tab
  const rawChart = stock.chartHistory || [];
  const chartPoints = timeframe === '1M' ? rawChart.slice(-30) : rawChart;

  // Calculate min, max for SVG scaling
  const prices = chartPoints.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : stock.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : stock.price;
  const priceRange = maxPrice - minPrice || 1;

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 220;
  const padding = 20;

  // Generate SVG path coordinates
  const svgPoints = chartPoints.map((pt, idx) => {
    const x = padding + (idx / Math.max(chartPoints.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((pt.price - minPrice) / priceRange) * (svgHeight - padding * 2);
    return { x, y, pt };
  });

  const pathD = svgPoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1]?.x || svgWidth} ${svgHeight} L ${padding} ${svgHeight} Z`;

  return (
    <div className="stock-detail-page">
      {/* Top Bar: Navigation & Search */}
      <div className="detail-top-bar">
        <button className="btn-back" onClick={() => navigate('/stocks')}>
          <ArrowLeft size={18} />
          <span>Hisseler Listesi</span>
        </button>

        <form onSubmit={handleSearchSubmit} className="detail-search-box glass-panel">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Başka bir hisse incele (Örn: THYAO, AAPL, NVDA, ASELS)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn-search-submit">İncele</button>
        </form>
      </div>

      {/* Main Stock Header Card */}
      <div className="stock-header-card glass-panel">
        <div className="stock-header-info">
          <div className="stock-avatar">{stock.symbol.slice(0, 2)}</div>
          <div>
            <div className="stock-title-row">
              <h1>{stock.symbol}</h1>
              <span className="badge badge-exchange">{stock.exchange || 'BORSA'}</span>
              <span className="badge badge-sector">{stock.sector || 'Genel'}</span>
            </div>
            <p className="stock-company-name">{stock.name}</p>
          </div>
        </div>

        <div className="stock-header-price">
          <div className="main-price">
            {currencySymbol}{stock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`change-badge ${isPos ? 'pos' : 'neg'}`}>
            {isPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{isPos ? '+' : ''}{stock.dayChange}% (Günlük)</span>
          </div>
        </div>

        <div className="stock-header-actions">
          <Link to="/wallet" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Cüzdanıma Ekle</span>
          </Link>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <span className="stat-label">Günlük Değişim (24s)</span>
          <div className={`stat-val ${stock.dayChange >= 0 ? 'pos' : 'neg'}`}>
            {stock.dayChange >= 0 ? `+${stock.dayChange}%` : `${stock.dayChange}%`}
          </div>
          <span className="stat-sub">Önceki Kapanış: {currencySymbol}{stock.dailyPreviousClose}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">Aylık Performans (30g)</span>
          <div className={`stat-val ${stock.monthChange >= 0 ? 'pos' : 'neg'}`}>
            {stock.monthChange >= 0 ? `+${stock.monthChange}%` : `${stock.monthChange}%`}
          </div>
          <span className="stat-sub">Ay Başı Fiyat: {currencySymbol}{stock.monthAgoPrice}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">Yıllık Performans (1y)</span>
          <div className={`stat-val ${stock.yearChange >= 0 ? 'pos' : 'neg'}`}>
            {stock.yearChange >= 0 ? `+${stock.yearChange}%` : `${stock.yearChange}%`}
          </div>
          <span className="stat-sub">Yıl Başı Fiyat: {currencySymbol}{stock.yearAgoPrice}</span>
        </div>

        <div className="stat-card glass-panel">
          <span className="stat-label">52 Haftalık Aralık (Min - Max)</span>
          <div className="stat-val highlight">
            {currencySymbol}{stock.low52w} - {currencySymbol}{stock.high52w}
          </div>
          <span className="stat-sub">Borsa: {stock.exchange || 'BIST'}</span>
        </div>
      </div>

      {/* Interactive Price Chart Section */}
      <div className="chart-section glass-panel">
        <div className="chart-header">
          <div className="chart-title">
            <BarChart2 size={20} className="chart-icon" />
            <h3>Fiyat Grafiği ve Trend İncelemesi</h3>
          </div>

          <div className="timeframe-tabs">
            <button
              className={`tf-tab ${timeframe === '1M' ? 'active' : ''}`}
              onClick={() => setTimeframe('1M')}
            >
              1 Ay (30g)
            </button>
            <button
              className={`tf-tab ${timeframe === '1Y' ? 'active' : ''}`}
              onClick={() => setTimeframe('1Y')}
            >
              1 Yıl (1y)
            </button>
          </div>
        </div>

        {/* Chart SVG */}
        <div className="chart-svg-container">
          {hoveredPoint && (
            <div className="chart-tooltip" style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}>
              <span className="tt-date">{hoveredPoint.pt.date}</span>
              <span className="tt-price">{currencySymbol}{hoveredPoint.pt.price}</span>
            </div>
          )}

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="price-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPos ? '#10b981' : '#ef4444'} stopOpacity="0.35" />
                <stop offset="100%" stopColor={isPos ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background area fill */}
            {pathD && <path d={areaD} fill="url(#chartGradient)" />}

            {/* Trend line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={isPos ? '#10b981' : '#ef4444'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive hover points */}
            {svgPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                className="chart-dot"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
