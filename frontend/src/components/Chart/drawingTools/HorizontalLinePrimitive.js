class HorizontalLinePaneView {
  constructor(primitive) {
    this._primitive = primitive;
  }

  update() {}

  renderer() {
    return {
      draw: (target) => {
        target.useBitmapCoordinateSpace((scope) => {
          const ctx = scope.context;
          const { price, color, isSelected } = this._primitive.getData();
          if (price === null || price === undefined) return;

          const series = this._primitive.series;
          const y = series.priceToCoordinate(price);
          if (y === null) return;

          const ratio = scope.horizontalPixelRatio;
          const width = scope.mediaSize.width;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, y * ratio);
          ctx.lineTo(width * ratio, y * ratio);
          ctx.strokeStyle = color || '#f59e0b';
          ctx.lineWidth = (isSelected ? 2.5 : 1.5) * ratio;
          ctx.setLineDash([6 * ratio, 4 * ratio]);
          ctx.stroke();

          // Render price tag at right
          const text = price.toFixed(2);
          ctx.font = `${Math.round(11 * ratio)}px sans-serif`;
          const textWidth = ctx.measureText(text).width;
          const padding = 6 * ratio;
          const boxWidth = textWidth + padding * 2;
          const boxHeight = 18 * ratio;
          const boxX = width * ratio - boxWidth - 10 * ratio;
          const boxY = y * ratio - boxHeight / 2;

          ctx.fillStyle = color || '#f59e0b';
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4 * ratio);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, boxX + boxWidth / 2, y * ratio);

          ctx.restore();
        });
      },
    };
  }
}

export class HorizontalLinePrimitive {
  constructor(id, price, color = '#f59e0b') {
    this.id = id;
    this._price = price;
    this._color = color;
    this._isSelected = false;

    this.chart = null;
    this.series = null;
    this._requestUpdate = null;
    this._paneView = new HorizontalLinePaneView(this);
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

  updatePrice(price) {
    this._price = price;
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
      price: this._price,
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
