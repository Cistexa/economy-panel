class TrendLinePaneView {
  constructor(primitive) {
    this._primitive = primitive;
  }

  update() {}

  renderer() {
    return {
      draw: (target) => {
        target.useBitmapCoordinateSpace((scope) => {
          const ctx = scope.context;
          const { p1, p2, color, isSelected } = this._primitive.getData();
          if (!p1 || !p2) return;

          const timeScale = this._primitive.chart.timeScale();
          const series = this._primitive.series;

          const x1 = timeScale.timeToCoordinate(p1.time);
          const x2 = timeScale.timeToCoordinate(p2.time);
          const y1 = series.priceToCoordinate(p1.price);
          const y2 = series.priceToCoordinate(p2.price);

          if (x1 === null || x2 === null || y1 === null || y2 === null) return;

          const ratio = scope.horizontalPixelRatio;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x1 * ratio, y1 * ratio);
          ctx.lineTo(x2 * ratio, y2 * ratio);
          ctx.strokeStyle = color || '#6366f1';
          ctx.lineWidth = (isSelected ? 3 : 2) * ratio;
          if (isSelected) {
            ctx.setLineDash([4 * ratio, 4 * ratio]);
          }
          ctx.stroke();

          // Render handles at endpoints
          [ { x: x1, y: y1 }, { x: x2, y: y2 } ].forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x * ratio, pt.y * ratio, 5 * ratio, 0, Math.PI * 2);
            ctx.fillStyle = color || '#6366f1';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5 * ratio;
            ctx.stroke();
          });

          ctx.restore();
        });
      },
    };
  }
}

export class TrendLinePrimitive {
  constructor(id, p1, p2, color = '#6366f1') {
    this.id = id;
    this._p1 = p1;
    this._p2 = p2;
    this._color = color;
    this._isSelected = false;

    this.chart = null;
    this.series = null;
    this._requestUpdate = null;
    this._paneView = new TrendLinePaneView(this);
  }

  attached({ chart, series, requestUpdate }) {
    this.chart = chart;
    this.series = series;
    this._requestUpdate = requestUpdate;
  }

  detached() {
    this.chart = null;
    this.series = null;
    this._requestUpdate = null;
  }

  updatePoints(p1, p2) {
    this._p1 = p1;
    this._p2 = p2;
    this.requestUpdate();
  }

  setSelected(selected) {
    this._isSelected = selected;
    this.requestUpdate();
  }

  requestUpdate() {
    if (this._requestUpdate) {
      this._requestUpdate();
    }
  }

  getData() {
    return {
      p1: this._p1,
      p2: this._p2,
      color: this._color,
      isSelected: this._isSelected,
    };
  }

  updateAllViews() {
    this._paneView.update();
  }

  paneViews() {
    return [this._paneView];
  }

  priceAxisViews() {
    return [];
  }

  timeAxisViews() {
    return [];
  }

  autoscaleInfo() {
    return null;
  }
}
