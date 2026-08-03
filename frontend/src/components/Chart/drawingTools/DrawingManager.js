import { TrendLinePrimitive } from './TrendLinePrimitive';
import { HorizontalLinePrimitive } from './HorizontalLinePrimitive';

export class DrawingManager {
  constructor(symbol) {
    this.symbol = symbol;
    this.chart = null;
    this.series = null;

    this.activeTool = 'pointer'; // 'pointer' | 'trendline' | 'hline' | 'eraser'
    this.drawings = []; // array of { id, type, p1, p2, price, color, primitive }
    this.tempPoint = null; // { time, price } for 2-step trendline

    this._onDrawingsChangeCallback = null;
    this._clickHandler = this._handleClick.bind(this);
  }

  init(chart, series, onDrawingsChange = null) {
    this.chart = chart;
    this.series = series;
    this._onDrawingsChangeCallback = onDrawingsChange;

    this.chart.subscribeClick(this._clickHandler);
    this.loadFromStorage();
  }

  destroy() {
    if (this.chart) {
      this.chart.unsubscribeClick(this._clickHandler);
    }
    this.clearAll(false); // remove primitives
    this.chart = null;
    this.series = null;
  }

  setTool(tool) {
    this.activeTool = tool;
    this.tempPoint = null;
  }

  setOnDrawingsChange(cb) {
    this._onDrawingsChangeCallback = cb;
  }

  _notifyChange() {
    if (this._onDrawingsChangeCallback) {
      this._onDrawingsChangeCallback(this.drawings.length);
    }
  }

  _handleClick(param) {
    if (!param.point || !param.time || !this.series || this.activeTool === 'pointer') {
      return;
    }

    const price = this.series.coordinateToPrice(param.point.y);
    if (price === null) return;

    const time = param.time;

    if (this.activeTool === 'trendline') {
      if (!this.tempPoint) {
        this.tempPoint = { time, price };
      } else {
        const id = 'tl_' + Date.now();
        const p1 = this.tempPoint;
        const p2 = { time, price };
        const color = '#6366f1';

        const primitive = new TrendLinePrimitive(id, p1, p2, color);
        this.series.attachPrimitive(primitive);

        this.drawings.push({
          id,
          type: 'trendline',
          p1,
          p2,
          color,
          primitive,
        });

        this.tempPoint = null;
        this.saveToStorage();
        this._notifyChange();
      }
    } else if (this.activeTool === 'hline') {
      const id = 'hl_' + Date.now();
      const color = '#f59e0b';

      const primitive = new HorizontalLinePrimitive(id, price, color);
      this.series.attachPrimitive(primitive);

      this.drawings.push({
        id,
        type: 'hline',
        price,
        color,
        primitive,
      });

      this.saveToStorage();
      this._notifyChange();
    } else if (this.activeTool === 'eraser') {
      // Find drawing closest to click point y
      const clickY = param.point.y;
      let closestIdx = -1;
      let minDistance = 25; // 25px threshold

      this.drawings.forEach((item, idx) => {
        if (item.type === 'hline') {
          const y = this.series.priceToCoordinate(item.price);
          if (y !== null) {
            const dist = Math.abs(y - clickY);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = idx;
            }
          }
        } else if (item.type === 'trendline') {
          const y1 = this.series.priceToCoordinate(item.p1.price);
          const y2 = this.series.priceToCoordinate(item.p2.price);
          const timeScale = this.chart.timeScale();
          const x1 = timeScale.timeToCoordinate(item.p1.time);
          const x2 = timeScale.timeToCoordinate(item.p2.time);

          if (y1 !== null && y2 !== null && x1 !== null && x2 !== null) {
            // Distance from point to line segment
            const clickX = param.point.x;
            const dist = pointToLineDistance(clickX, clickY, x1, y1, x2, y2);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = idx;
            }
          }
        }
      });

      if (closestIdx !== -1) {
        const item = this.drawings[closestIdx];
        if (item.primitive) {
          this.series.detachPrimitive(item.primitive);
        }
        this.drawings.splice(closestIdx, 1);
        this.saveToStorage();
        this._notifyChange();
      }
    }
  }

  clearAll(save = true) {
    this.drawings.forEach((item) => {
      if (item.primitive) {
        this.series.detachPrimitive(item.primitive);
      }
    });
    this.drawings = [];
    this.tempPoint = null;
    if (save) {
      this.saveToStorage();
      this._notifyChange();
    }
  }

  saveToStorage() {
    if (!this.symbol) return;
    const dataToSave = this.drawings.map((item) => ({
      id: item.id,
      type: item.type,
      p1: item.p1,
      p2: item.p2,
      price: item.price,
      color: item.color,
    }));
    try {
      localStorage.setItem(`lc_drawings_${this.symbol}`, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save drawings to storage:', e);
    }
  }

  loadFromStorage() {
    if (!this.symbol || !this.series) return;
    try {
      const saved = localStorage.getItem(`lc_drawings_${this.symbol}`);
      if (!saved) return;
      const parsed = JSON.parse(saved);

      parsed.forEach((item) => {
        if (item.type === 'trendline' && item.p1 && item.p2) {
          const primitive = new TrendLinePrimitive(item.id, item.p1, item.p2, item.color);
          this.series.attachPrimitive(primitive);
          this.drawings.push({ ...item, primitive });
        } else if (item.type === 'hline' && item.price !== undefined) {
          const primitive = new HorizontalLinePrimitive(item.id, item.price, item.color);
          this.series.attachPrimitive(primitive);
          this.drawings.push({ ...item, primitive });
        }
      });
      this._notifyChange();
    } catch (e) {
      console.error('Failed to load drawings from storage:', e);
    }
  }
}

function pointToLineDistance(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
