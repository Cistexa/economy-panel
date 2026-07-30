import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  PlusCircle, 
  BarChart2
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

  const [searchInput, setSearchInput] = useState('');
  const [timeframe, setTimeframe] = useState('1Y');
  const [hoverIndex, setHoverIndex] = useState(null);

  const chartContainerRef = useRef(null);

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

  // Filter chart points based on timeframe tab
  const rawChart = stock.chartHistory || [];
  const chartPoints = timeframe === '1M' ? rawChart.slice(-30) : rawChart;

  const prices = chartPoints.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : stock.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : stock.price;
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions & scaling
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingTop = 25;
  const paddingBottom = 35;
  const paddingLeft = 15;
  const paddingRight = 15;

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Compute SVG coordinates
  const pointsCoords = chartPoints.map((pt, idx) => {
    const x = paddingLeft + (idx / Math.max(chartPoints.length - 1, 1)) * chartInnerWidth;
    const y = paddingTop + (1 - (pt.price - minPrice) / priceRange) * chartInnerHeight;
    return { x, y, pt };
  });

  const pathD = pointsCoords.reduce(
    (acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
    ''
  );

  const areaD = pointsCoords.length > 0
    ? `${pathD} L ${pointsCoords[pointsCoords.length - 1].x.toFixed(1)} ${svgHeight - paddingBottom} L ${paddingLeft} ${svgHeight - paddingBottom} Z`
    : '';

  // Handle MouseMove on SVG container for interactive crosshair tracking
  const handleMouseMove = (e) => {
    if (!chartContainerRef.current || pointsCoords.length === 0) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * svgWidth;

    // Find nearest point
    let closestIdx = 0;
    let minDiff = Infinity;
    pointsCoords.forEach((p, idx) => {
      const diff = Math.abs(p.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activePoint = hoverIndex !== null ? pointsCoords[hoverIndex] : null;

  return (
    <div className="stock-detail-page">
      {/* Top Bar: Navigation */}
      <div className="detail-top-bar">
        <button className="btn-back" onClick={() => navigate('/stocks')}>
          <ArrowLeft size={18} />
          <span>Hisseler Listesi</span>
        </button>
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
        <div
          className="chart-svg-container"
          ref={chartContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {activePoint && (
            <div
              className="chart-tooltip"
              style={{
                left: `${(activePoint.x / svgWidth) * 100}%`,
                top: `${(activePoint.y / svgHeight) * 100}%`,
              }}
            >
              <span className="tt-date">{activePoint.pt.date}</span>
              <span className="tt-price">{currencySymbol}{activePoint.pt.price}</span>
            </div>
          )}

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="price-svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPos ? '#10b981' : '#ef4444'} stopOpacity="0.4" />
                <stop offset="100%" stopColor={isPos ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            <line x1={paddingLeft} y1={paddingTop} x2={svgWidth - paddingRight} y2={paddingTop} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={paddingTop + chartInnerHeight * 0.5} x2={svgWidth - paddingRight} y2={paddingTop + chartInnerHeight * 0.5} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1={paddingLeft} y1={svgHeight - paddingBottom} x2={svgWidth - paddingRight} y2={svgHeight - paddingBottom} stroke="rgba(255,255,255,0.06)" />

            {/* Background area fill */}
            {areaD && <path d={areaD} fill="url(#chartGradient)" />}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={isPos ? '#10b981' : '#ef4444'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Active Hover Crosshair Line */}
            {activePoint && (
              <>
                <line
                  x1={activePoint.x}
                  y1={paddingTop}
                  x2={activePoint.x}
                  y2={svgHeight - paddingBottom}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="6"
                  fill={isPos ? '#10b981' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>

          {/* Date Axis Footer Labels */}
          <div className="chart-date-axis">
            {chartPoints.length > 0 && (
              <>
                <span>{chartPoints[0].date}</span>
                <span>{chartPoints[Math.floor(chartPoints.length * 0.25)]?.date}</span>
                <span>{chartPoints[Math.floor(chartPoints.length * 0.5)]?.date}</span>
                <span>{chartPoints[Math.floor(chartPoints.length * 0.75)]?.date}</span>
                <span>{chartPoints[chartPoints.length - 1].date}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;
