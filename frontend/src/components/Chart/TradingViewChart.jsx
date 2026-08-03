import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeries,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  CrosshairMode,
} from 'lightweight-charts';
import {
  MousePointer,
  TrendingUp,
  Minus,
  Eraser,
  Trash2,
  BarChart2,
  Activity,
  Layers,
} from 'lucide-react';
import { DrawingManager } from './drawingTools/DrawingManager';
import './TradingViewChart.css';

// Indicator calculations
function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += data[j].close;
    }
    result.push({ time: data[i].time, value: parseFloat((sum / period).toFixed(2)) });
  }
  return result;
}

function calculateEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let prevEma = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    if (prevEma === null) {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += data[j].close;
      }
      prevEma = sum / period;
    } else {
      prevEma = data[i].close * k + prevEma * (1 - k);
    }
    result.push({ time: data[i].time, value: parseFloat(prevEma.toFixed(2)) });
  }
  return result;
}

function calculateRSI(data, period = 14) {
  const result = [];
  if (data.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);
  result.push({ time: data[period].time, value: parseFloat(rsi.toFixed(2)) });

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);
    result.push({ time: data[i].time, value: parseFloat(rsi.toFixed(2)) });
  }

  return result;
}

const TradingViewChart = ({ chartHistory = [], symbol = '', isPositive = true, currency = '₺' }) => {
  const containerRef = useRef(null);

  // States
  const [chartType, setChartType] = useState('area'); // 'area' | 'line' | 'candlestick'
  const [timeframe, setTimeframe] = useState('1Y'); // '1M' | '3M' | '6M' | '1Y'
  const [activeTool, setActiveTool] = useState('pointer'); // 'pointer' | 'trendline' | 'hline' | 'eraser'
  
  // Toggles
  const [showVolume, setShowVolume] = useState(true);
  const [showSMA20, setShowSMA20] = useState(false);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showRSI, setShowRSI] = useState(false);

  const [drawingsCount, setDrawingsCount] = useState(0);

  // Refs for Chart & Managers
  const chartRef = useRef(null);
  const drawingManagerRef = useRef(null);

  // Format chartHistory
  const getPreparedData = () => {
    let filtered = [...chartHistory];
    if (timeframe === '1M') filtered = filtered.slice(-30);
    else if (timeframe === '3M') filtered = filtered.slice(-90);
    else if (timeframe === '6M') filtered = filtered.slice(-180);

    const formatted = filtered
      .filter((pt) => pt.fullDate && pt.price !== undefined)
      .map((pt) => ({
        time: pt.fullDate,
        value: pt.price,
        open: pt.open !== undefined ? pt.open : pt.price,
        high: pt.high !== undefined ? pt.high : pt.price,
        low: pt.low !== undefined ? pt.low : pt.price,
        close: pt.price,
        volume: pt.volume || 0,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    // Deduplicate dates
    const unique = [];
    const seen = new Set();
    for (const item of formatted) {
      if (!seen.has(item.time)) {
        seen.add(item.time);
        unique.push(item);
      }
    }
    return unique;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean previous chart
    containerRef.current.innerHTML = '';

    const data = getPreparedData();
    if (data.length === 0) return;

    // Determine container height
    let height = 380;
    if (showVolume) height += 100;
    if (showRSI) height += 120;

    // Create chart
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: 'rgba(99, 102, 241, 0.4)', labelBackgroundColor: '#1e293b' },
        horzLine: { color: 'rgba(99, 102, 241, 0.4)', labelBackgroundColor: '#1e293b' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Main Price Series (Pane 0)
    let mainSeries;
    const color = isPositive ? '#10b981' : '#ef4444';

    if (chartType === 'candlestick') {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
      mainSeries.setData(data.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })));
    } else if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2.5,
      });
      mainSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    } else {
      // Default: Area
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
        lineColor: color,
        lineWidth: 2.5,
      });
      mainSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    }

    // SMA 20 Overlay
    if (showSMA20) {
      const smaData = calculateSMA(data, 20);
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#f59e0b', // Amber
        lineWidth: 1.5,
        title: 'SMA 20',
      });
      smaSeries.setData(smaData);
    }

    // EMA 50 Overlay
    if (showEMA50) {
      const emaData = calculateEMA(data, 50);
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#ec4899', // Pink
        lineWidth: 1.5,
        title: 'EMA 50',
      });
      emaSeries.setData(emaData);
    }

    let nextPaneIndex = 1;

    // Volume Panel
    if (showVolume) {
      const volumeSeries = chart.addSeries(
        HistogramSeries,
        {
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume',
        },
        nextPaneIndex
      );
      volumeSeries.setData(
        data.map((d) => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }))
      );
      nextPaneIndex++;
    }

    // RSI Panel
    if (showRSI) {
      const rsiData = calculateRSI(data, 14);
      const rsiSeries = chart.addSeries(
        LineSeries,
        {
          color: '#8b5cf6', // Purple
          lineWidth: 2,
          title: 'RSI (14)',
          priceScaleId: 'rsi',
        },
        nextPaneIndex
      );
      rsiSeries.setData(rsiData);

      // Overbought 70 & Oversold 30 lines
      const line70 = chart.addSeries(
        LineSeries,
        {
          color: 'rgba(239, 68, 68, 0.5)',
          lineWidth: 1,
          lineStyle: 2, // Dashed
          priceScaleId: 'rsi',
        },
        nextPaneIndex
      );
      line70.setData(rsiData.map((d) => ({ time: d.time, value: 70 })));

      const line30 = chart.addSeries(
        LineSeries,
        {
          color: 'rgba(16, 185, 129, 0.5)',
          lineWidth: 1,
          lineStyle: 2, // Dashed
          priceScaleId: 'rsi',
        },
        nextPaneIndex
      );
      line30.setData(rsiData.map((d) => ({ time: d.time, value: 30 })));
    }

    // Initialize DrawingManager
    const manager = new DrawingManager(symbol);
    manager.init(chart, mainSeries, (count) => setDrawingsCount(count));
    manager.setTool(activeTool);
    drawingManagerRef.current = manager;

    // Resize listener
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (drawingManagerRef.current) {
        drawingManagerRef.current.destroy();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [
    chartHistory,
    chartType,
    timeframe,
    showVolume,
    showSMA20,
    showEMA50,
    showRSI,
    symbol,
  ]);

  // Handle Tool Change
  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setTool(tool);
    }
  };

  const handleClearDrawings = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.clearAll(true);
    }
  };

  return (
    <div className="tv-chart-container">
      {/* Top Toolbar */}
      <div className="tv-toolbar">
        {/* Timeframe Tabs */}
        <div className="tv-group">
          <span className="tv-group-label">Aralık:</span>
          {['1M', '3M', '6M', '1Y'].map((tf) => (
            <button
              key={tf}
              className={`tv-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="tv-divider" />

        {/* Chart Type Selection */}
        <div className="tv-group">
          <span className="tv-group-label">Grafik:</span>
          <button
            className={`tv-btn ${chartType === 'area' ? 'active' : ''}`}
            onClick={() => setChartType('area')}
            title="Alan Grafiği"
          >
            <Activity size={15} />
            <span>Alan</span>
          </button>
          <button
            className={`tv-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
            title="Çizgi Grafiği"
          >
            <TrendingUp size={15} />
            <span>Çizgi</span>
          </button>
          <button
            className={`tv-btn ${chartType === 'candlestick' ? 'active' : ''}`}
            onClick={() => setChartType('candlestick')}
            title="Mum Grafiği (OHLC)"
          >
            <BarChart2 size={15} />
            <span>Mum</span>
          </button>
        </div>

        <div className="tv-divider" />

        {/* Indicator Toggles */}
        <div className="tv-group">
          <span className="tv-group-label">İndikatörler:</span>
          <button
            className={`tv-btn ${showVolume ? 'active' : ''}`}
            onClick={() => setShowVolume(!showVolume)}
          >
            <span>Hacim</span>
          </button>
          <button
            className={`tv-btn ${showSMA20 ? 'active-amber' : ''}`}
            onClick={() => setShowSMA20(!showSMA20)}
          >
            <span>SMA 20</span>
          </button>
          <button
            className={`tv-btn ${showEMA50 ? 'active-pink' : ''}`}
            onClick={() => setShowEMA50(!showEMA50)}
          >
            <span>EMA 50</span>
          </button>
          <button
            className={`tv-btn ${showRSI ? 'active-purple' : ''}`}
            onClick={() => setShowRSI(!showRSI)}
          >
            <span>RSI (14)</span>
          </button>
        </div>

        <div className="tv-divider" />

        {/* Drawing Tools */}
        <div className="tv-group">
          <span className="tv-group-label">Çizim Araçları:</span>
          <button
            className={`tv-btn ${activeTool === 'pointer' ? 'active' : ''}`}
            onClick={() => handleToolSelect('pointer')}
            title="Normal İşaretçi"
          >
            <MousePointer size={15} />
            <span>İşaretçi</span>
          </button>
          <button
            className={`tv-btn ${activeTool === 'trendline' ? 'active-indigo' : ''}`}
            onClick={() => handleToolSelect('trendline')}
            title="Trend Çizgisi (2 Tıklama)"
          >
            <TrendingUp size={15} />
            <span>Trend</span>
          </button>
          <button
            className={`tv-btn ${activeTool === 'hline' ? 'active-amber' : ''}`}
            onClick={() => handleToolSelect('hline')}
            title="Yatay Çizgi (1 Tıklama)"
          >
            <Minus size={15} />
            <span>Yatay</span>
          </button>
          <button
            className={`tv-btn ${activeTool === 'eraser' ? 'active-red' : ''}`}
            onClick={() => handleToolSelect('eraser')}
            title="Çizim Silgi"
          >
            <Eraser size={15} />
            <span>Silgi</span>
          </button>
          {drawingsCount > 0 && (
            <button
              className="tv-btn tv-btn-danger"
              onClick={handleClearDrawings}
              title="Tüm Çizimleri Sil"
            >
              <Trash2 size={15} />
              <span>Temizle ({drawingsCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Drawing Mode Banner if active */}
      {activeTool !== 'pointer' && (
        <div className="tv-mode-banner">
          {activeTool === 'trendline' && '✏️ Trend Çizgisi Modu: Başlangıç ve bitiş için 2 noktaya tıklayın.'}
          {activeTool === 'hline' && '➖ Yatay Çizgi Modu: İstenen fiyat seviyesine tıklayın.'}
          {activeTool === 'eraser' && '🗑️ Silgi Modu: Silmek istediğiniz çizginin üzerine tıklayın.'}
        </div>
      )}

      {/* Canvas Element Wrapper */}
      <div className="tv-chart-view" ref={containerRef} />
    </div>
  );
};

export default TradingViewChart;
