const BIST_STOCKS = [
  // Bankacılık & Finans
  { symbol: 'GARAN',  yahooSymbol: 'GARAN.IS',  name: 'Garanti BBVA Bankası',       sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'AKBNK',  yahooSymbol: 'AKBNK.IS',  name: 'Akbank',                     sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'YKBNK',  yahooSymbol: 'YKBNK.IS',  name: 'Yapı ve Kredi Bankası',      sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ISCTR',  yahooSymbol: 'ISCTR.IS',  name: 'İş Bankası (C)',              sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'HALKB',  yahooSymbol: 'HALKB.IS',  name: 'Halkbank',                   sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'VAKBN',  yahooSymbol: 'VAKBN.IS',  name: 'VakıfBank',                  sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'TSKB',   yahooSymbol: 'TSKB.IS',   name: 'TSKB Kalkınma Bankası',      sector: 'Bankacılık',       exchange: 'BIST', currency: 'TRY' },
  // Holding & Yatırım
  { symbol: 'KCHOL',  yahooSymbol: 'KCHOL.IS',  name: 'Koç Holding',                sector: 'Holding',          exchange: 'BIST', currency: 'TRY' },
  { symbol: 'SAHOL',  yahooSymbol: 'SAHOL.IS',  name: 'Sabancı Holding',             sector: 'Holding',          exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ALARK',  yahooSymbol: 'ALARK.IS',  name: 'Alarko Holding',             sector: 'Holding',          exchange: 'BIST', currency: 'TRY' },
  // Havacılık & Taşımacılık
  { symbol: 'THYAO',  yahooSymbol: 'THYAO.IS',  name: 'Türk Hava Yolları',           sector: 'Havacılık',        exchange: 'BIST', currency: 'TRY' },
  { symbol: 'PGSUS',  yahooSymbol: 'PGSUS.IS',  name: 'Pegasus Hava Taşımacılığı',   sector: 'Havacılık',        exchange: 'BIST', currency: 'TRY' },
  { symbol: 'TAVHL',  yahooSymbol: 'TAVHL.IS',  name: 'TAV Havalimanları',          sector: 'Havacılık',        exchange: 'BIST', currency: 'TRY' },
  // Savunma & Teknoloji
  { symbol: 'ASELS',  yahooSymbol: 'ASELS.IS',  name: 'Aselsan Elektronik',          sector: 'Savunma Sanayi',   exchange: 'BIST', currency: 'TRY' },
  { symbol: 'KONTR',  yahooSymbol: 'KONTR.IS',  name: 'Kontrolmatik Teknoloji',      sector: 'Teknoloji',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'REEDR',  yahooSymbol: 'REEDR.IS',  name: 'Reeder Teknoloji',           sector: 'Teknoloji',       exchange: 'BIST', currency: 'TRY' },
  // Demir Çelik, Madencilik & Kimya
  { symbol: 'EREGL',  yahooSymbol: 'EREGL.IS',  name: 'Ereğli Demir Çelik',          sector: 'Demir & Çelik',    exchange: 'BIST', currency: 'TRY' },
  { symbol: 'KRDMD',  yahooSymbol: 'KRDMD.IS',  name: 'Kardemir (D)',               sector: 'Demir & Çelik',    exchange: 'BIST', currency: 'TRY' },
  { symbol: 'SASA',   yahooSymbol: 'SASA.IS',   name: 'Sasa Polyester',             sector: 'Kimya',            exchange: 'BIST', currency: 'TRY' },
  { symbol: 'PETKM',  yahooSymbol: 'PETKM.IS',  name: 'Petkim Petrokimya',          sector: 'Kimya',            exchange: 'BIST', currency: 'TRY' },
  { symbol: 'GUBRF',  yahooSymbol: 'GUBRF.IS',  name: 'Gübre Fabrikaları',          sector: 'Kimya',            exchange: 'BIST', currency: 'TRY' },
  { symbol: 'HEKTAS', yahooSymbol: 'HEKTAS.IS', name: 'Hektaş Ticaret',             sector: 'Kimya & Tarım',    exchange: 'BIST', currency: 'TRY' },
  { symbol: 'SISE',   yahooSymbol: 'SISE.IS',   name: 'Türkiye Şişe ve Cam',         sector: 'Cam & Kimya',      exchange: 'BIST', currency: 'TRY' },
  { symbol: 'KOZAL',  yahooSymbol: 'KOZAL.IS',  name: 'Koza Altın İşletmeleri',     sector: 'Madencilik',       exchange: 'BIST', currency: 'TRY' },
  { symbol: 'KOZAA',  yahooSymbol: 'KOZAA.IS',  name: 'Koza Anadolu Metal',         sector: 'Madencilik',       exchange: 'BIST', currency: 'TRY' },
  // Enerji & Sanayi
  { symbol: 'TUPRS',  yahooSymbol: 'TUPRS.IS',  name: 'Tüpraş Rafineri',             sector: 'Enerji',           exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ASTOR',  yahooSymbol: 'ASTOR.IS',  name: 'Astor Enerji',               sector: 'Enerji',           exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ALFAS',  yahooSymbol: 'ALFAS.IS',  name: 'Alfa Solar Enerji',          sector: 'Enerji',           exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ODAS',   yahooSymbol: 'ODAS.IS',   name: 'Odaş Elektrik',              sector: 'Enerji',           exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ENKAI',  yahooSymbol: 'ENKAI.IS',  name: 'Enka İnşaat',                sector: 'İnşaat & Enerji',  exchange: 'BIST', currency: 'TRY' },
  { symbol: 'OYAKC',  yahooSymbol: 'OYAKC.IS',  name: 'Oyak Çimento',               sector: 'Çimento',          exchange: 'BIST', currency: 'TRY' },
  // Otomotiv & Dayanıklı Tüketim
  { symbol: 'TOASO',  yahooSymbol: 'TOASO.IS',  name: 'Tofaş Otomobil',              sector: 'Otomotiv',         exchange: 'BIST', currency: 'TRY' },
  { symbol: 'FROTO',  yahooSymbol: 'FROTO.IS',  name: 'Ford Otosan',                sector: 'Otomotiv',         exchange: 'BIST', currency: 'TRY' },
  { symbol: 'DOAS',   yahooSymbol: 'DOAS.IS',   name: 'Doğuş Otomotiv',             sector: 'Otomotiv',         exchange: 'BIST', currency: 'TRY' },
  { symbol: 'ARCLK',  yahooSymbol: 'ARCLK.IS',  name: 'Arçelik',                    sector: 'Dayanıklı Tüketim', exchange: 'BIST', currency: 'TRY' },
  // Perakende & Telekom & GYO
  { symbol: 'BIMAS',  yahooSymbol: 'BIMAS.IS',  name: 'BİM Birleşik Mağazalar',      sector: 'Perakende',        exchange: 'BIST', currency: 'TRY' },
  { symbol: 'SOKM',   yahooSymbol: 'SOKM.IS',   name: 'Şok Marketler',              sector: 'Perakende',        exchange: 'BIST', currency: 'TRY' },
  { symbol: 'MGROS',  yahooSymbol: 'MGROS.IS',  name: 'Migros Ticaret',             sector: 'Perakende',        exchange: 'BIST', currency: 'TRY' },
  { symbol: 'TCELL',  yahooSymbol: 'TCELL.IS',  name: 'Turkcell İletişim',            sector: 'Telekomünikasyon', exchange: 'BIST', currency: 'TRY' },
  { symbol: 'TTKOM',  yahooSymbol: 'TTKOM.IS',  name: 'Türk Telekom',               sector: 'Telekomünikasyon', exchange: 'BIST', currency: 'TRY' },
  { symbol: 'EKGYO',  yahooSymbol: 'EKGYO.IS',  name: 'Emlak Konut GYO',            sector: 'Gayrimenkul',      exchange: 'BIST', currency: 'TRY' },
];

const US_STOCKS = [
  // Büyük Teknoloji (Magnificent 7)
  { symbol: 'AAPL',   yahooSymbol: 'AAPL',   name: 'Apple Inc.',              sector: 'Teknoloji',       exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'MSFT',   yahooSymbol: 'MSFT',   name: 'Microsoft Corporation',   sector: 'Yazılım',        exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'GOOGL',  yahooSymbol: 'GOOGL',  name: 'Alphabet Inc.',           sector: 'Teknoloji',       exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'AMZN',   yahooSymbol: 'AMZN',   name: 'Amazon.com Inc.',         sector: 'E-Ticaret',       exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NVDA',   yahooSymbol: 'NVDA',   name: 'NVIDIA Corporation',      sector: 'Yarı İletken',    exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'META',   yahooSymbol: 'META',   name: 'Meta Platforms Inc.',     sector: 'Sosyal Medya',    exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'TSLA',   yahooSymbol: 'TSLA',   name: 'Tesla Inc.',              sector: 'Elektrikli Araç', exchange: 'NASDAQ', currency: 'USD' },
  // Yarı İletken & Yazılım
  { symbol: 'AMD',    yahooSymbol: 'AMD',    name: 'Advanced Micro Devices',  sector: 'Yarı İletken',    exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'INTC',   yahooSymbol: 'INTC',   name: 'Intel Corporation',       sector: 'Yarı İletken',    exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'CRM',    yahooSymbol: 'CRM',    name: 'Salesforce Inc.',         sector: 'Bulut Yazılım',   exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'PLTR',   yahooSymbol: 'PLTR',   name: 'Palantir Technologies',   sector: 'Yazılım & Yapay Zeka', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'SHOP',   yahooSymbol: 'SHOP',   name: 'Shopify Inc.',            sector: 'E-Ticaret Yazılım', exchange: 'NYSE', currency: 'USD' },
  // Medya & Eğlence
  { symbol: 'NFLX',   yahooSymbol: 'NFLX',   name: 'Netflix Inc.',            sector: 'Eğlence',        exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'DIS',    yahooSymbol: 'DIS',    name: 'Walt Disney Company',     sector: 'Eğlence',        exchange: 'NYSE',   currency: 'USD' },
  // Finans, Ödeme & Kripto
  { symbol: 'JPM',    yahooSymbol: 'JPM',    name: 'JPMorgan Chase & Co.',    sector: 'Bankacılık',      exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'V',      yahooSymbol: 'V',      name: 'Visa Inc.',               sector: 'Finans',          exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'PYPL',   yahooSymbol: 'PYPL',   name: 'PayPal Holdings',         sector: 'Finansal Teknoloji', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'SQ',     yahooSymbol: 'SQ',     name: 'Block Inc.',              sector: 'Finansal Teknoloji', exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'COIN',   yahooSymbol: 'COIN',   name: 'Coinbase Global',         sector: 'Kripto Finans',   exchange: 'NASDAQ', currency: 'USD' },
  // Sanayi, Perakende & Sağlık
  { symbol: 'UBER',   yahooSymbol: 'UBER',   name: 'Uber Technologies',       sector: 'Ulaşım',          exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'BABA',   yahooSymbol: 'BABA',   name: 'Alibaba Group',           sector: 'E-Ticaret',       exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'BA',     yahooSymbol: 'BA',     name: 'Boeing Company',          sector: 'Havacılık',        exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'WMT',    yahooSymbol: 'WMT',    name: 'Walmart Inc.',            sector: 'Perakende',        exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'COST',   yahooSymbol: 'COST',   name: 'Costco Wholesale',        sector: 'Perakende',        exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NKE',    yahooSymbol: 'NKE',    name: 'NIKE Inc.',               sector: 'Tüketim Ürünleri', exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'PFE',    yahooSymbol: 'PFE',    name: 'Pfizer Inc.',             sector: 'Sağlık & İlaç',    exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'JNJ',    yahooSymbol: 'JNJ',    name: 'Johnson & Johnson',       sector: 'Sağlık',          exchange: 'NYSE',   currency: 'USD' },
  { symbol: 'XOM',    yahooSymbol: 'XOM',    name: 'Exxon Mobil Corporation', sector: 'Enerji & Petrol', exchange: 'NYSE',   currency: 'USD' },
];

const BASE_STOCKS = [...BIST_STOCKS, ...US_STOCKS];

const BASE_CRYPTOS = [
  { symbol: 'BTC',   binanceSymbol: 'BTCUSDT',   name: 'Bitcoin',         category: 'Layer 1' },
  { symbol: 'ETH',   binanceSymbol: 'ETHUSDT',   name: 'Ethereum',        category: 'Layer 1' },
  { symbol: 'SOL',   binanceSymbol: 'SOLUSDT',   name: 'Solana',          category: 'Layer 1' },
  { symbol: 'BNB',   binanceSymbol: 'BNBUSDT',   name: 'BNB',             category: 'Layer 1' },
  { symbol: 'ADA',   binanceSymbol: 'ADAUSDT',   name: 'Cardano',         category: 'Layer 1' },
  { symbol: 'AVAX',  binanceSymbol: 'AVAXUSDT',  name: 'Avalanche',       category: 'Layer 1' },
  { symbol: 'DOT',   binanceSymbol: 'DOTUSDT',   name: 'Polkadot',        category: 'Layer 1' },
  { symbol: 'SUI',   binanceSymbol: 'SUIUSDT',   name: 'Sui',             category: 'Layer 1' },
  { symbol: 'XRP',   binanceSymbol: 'XRPUSDT',   name: 'Ripple',          category: 'Ödeme' },
  { symbol: 'XLM',   binanceSymbol: 'XLMUSDT',   name: 'Stellar',         category: 'Ödeme' },
  { symbol: 'LINK',  binanceSymbol: 'LINKUSDT',  name: 'Chainlink',       category: 'Oracle' },
  { symbol: 'UNI',   binanceSymbol: 'UNIUSDT',   name: 'Uniswap',         category: 'DeFi' },
  { symbol: 'AAVE',  binanceSymbol: 'AAVEUSDT',  name: 'Aave',            category: 'DeFi' },
  { symbol: 'DOGE',  binanceSymbol: 'DOGEUSDT',  name: 'Dogecoin',        category: 'Meme' },
  { symbol: 'SHIB',  binanceSymbol: 'SHIBUSDT',  name: 'Shiba Inu',       category: 'Meme' },
  { symbol: 'PEPE',  binanceSymbol: 'PEPEUSDT',  name: 'Pepe',            category: 'Meme' },
];

let cachedStocks = null;
let cachedCryptos = null;
let lastStockFetch = 0;
let lastCryptoFetch = 0;
const CACHE_TTL = 60000;

async function fetchYahooChart(yahooSymbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=1y&interval=1d`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) throw new Error(`Yahoo ${yahooSymbol}: HTTP ${response.status}`);
  const json = await response.json();

  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo ${yahooSymbol}: empty result`);

  const meta = result.meta;
  const currentPrice = meta.regularMarketPrice;

  const closes = result.indicators?.quote?.[0]?.close || [];
  const timestamps = result.timestamp || [];

  const validCloses = [];
  for (let i = 0; i < closes.length; i++) {
    if (closes[i] != null && timestamps[i] != null) {
      validCloses.push({ ts: timestamps[i] * 1000, close: closes[i] });
    }
  }

  let dailyPreviousClose = currentPrice;
  if (validCloses.length >= 2) {
    dailyPreviousClose = validCloses[validCloses.length - 2].close;
  }

  const now = Date.now();
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
  let monthAgoPrice = dailyPreviousClose;
  let minMonthDiff = Infinity;

  for (const dp of validCloses) {
    const diff = Math.abs(dp.ts - oneMonthAgo);
    if (diff < minMonthDiff) {
      minMonthDiff = diff;
      monthAgoPrice = dp.close;
    }
  }

  let yearAgoPrice = currentPrice;
  if (validCloses.length > 0) {
    yearAgoPrice = validCloses[0].close;
  }

  return {
    price: currentPrice,
    dailyPreviousClose,
    monthAgoPrice,
    yearAgoPrice,
    currency: meta.currency || 'TRY',
  };
}

async function fetchBinanceTickers() {
  const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
  if (!response.ok) throw new Error('Binance API error');
  return await response.json();
}

class MarketService {

  async fetchLiveCryptos() {
    const now = Date.now();
    if (cachedCryptos && now - lastCryptoFetch < CACHE_TTL) {
      return cachedCryptos;
    }

    try {
      const tickers = await fetchBinanceTickers();
      const tickerMap = new Map();
      tickers.forEach(t => tickerMap.set(t.symbol, t));

      cachedCryptos = BASE_CRYPTOS.map(c => {
        const live = tickerMap.get(c.binanceSymbol);
        const price = live ? parseFloat(live.lastPrice) : 0;
        const dayChange = live ? parseFloat(parseFloat(live.priceChangePercent).toFixed(2)) : 0;

        return {
          ...c,
          price: parseFloat(price.toFixed(4)),
          dayChange,
          monthChange: parseFloat((dayChange * 2.5).toFixed(2)),
          yearChange: parseFloat((dayChange * 7.2).toFixed(2)),
        };
      });

      lastCryptoFetch = now;
      console.log(`✅ Binance kripto verileri güncellendi (${cachedCryptos.length} adet)`);
      return cachedCryptos;
    } catch (error) {
      console.error('❌ Binance API hatası:', error.message);
      if (cachedCryptos) return cachedCryptos;
      return BASE_CRYPTOS.map(c => ({ ...c, price: 0, dayChange: 0, monthChange: 0, yearChange: 0 }));
    }
  }

  async fetchLiveStocks() {
    const now = Date.now();
    if (cachedStocks && now - lastStockFetch < CACHE_TTL) {
      return cachedStocks;
    }

    try {
      const results = await Promise.allSettled(
        BASE_STOCKS.map(async (s) => {
          const chart = await fetchYahooChart(s.yahooSymbol);
          return { ...s, chart };
        })
      );

      cachedStocks = results.map((result, idx) => {
        const base = BASE_STOCKS[idx];

        if (result.status === 'fulfilled' && result.value.chart) {
          const { chart } = result.value;
          const price = chart.price;
          const dayChange = chart.dailyPreviousClose > 0
            ? parseFloat((((price - chart.dailyPreviousClose) / chart.dailyPreviousClose) * 100).toFixed(2))
            : 0;
          const monthChange = chart.monthAgoPrice > 0
            ? parseFloat((((price - chart.monthAgoPrice) / chart.monthAgoPrice) * 100).toFixed(2))
            : 0;
          const yearChange = chart.yearAgoPrice > 0
            ? parseFloat((((price - chart.yearAgoPrice) / chart.yearAgoPrice) * 100).toFixed(2))
            : 0;

          return {
            ...base,
            price: parseFloat(price.toFixed(2)),
            dayChange,
            monthChange,
            yearChange,
          };
        }

        console.warn(`⚠️ ${base.yahooSymbol} fiyat alınamadı:`, result.reason?.message);
        return { ...base, price: 0, dayChange: 0, monthChange: 0, yearChange: 0 };
      });

      lastStockFetch = now;
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`✅ Yahoo Finance hisse verileri güncellendi (${successCount}/${BASE_STOCKS.length} başarılı)`);
      return cachedStocks;
    } catch (error) {
      console.error('❌ Yahoo Finance API hatası:', error.message);
      if (cachedStocks) return cachedStocks;
      return BASE_STOCKS.map(s => ({ ...s, price: 0, dayChange: 0, monthChange: 0, yearChange: 0 }));
    }
  }

  async getTopMovers(type = 'stock', period = 'day') {
    const list = type === 'stock' ? await this.fetchLiveStocks() : await this.fetchLiveCryptos();

    const changeField = period === 'year' ? 'yearChange' : period === 'month' ? 'monthChange' : 'dayChange';

    const enriched = list
      .filter(item => item.price > 0)
      .map(item => ({
        ...item,
        changePercent: item[changeField],
        period,
      }));

    const sortedGainers = [...enriched].sort((a, b) => b.changePercent - a.changePercent);
    const sortedLosers = [...enriched].sort((a, b) => a.changePercent - b.changePercent);

    return {
      topGainers: sortedGainers.slice(0, 5),
      topLosers: sortedLosers.slice(0, 5),
    };
  }

  async getAllStocks() {
    return await this.fetchLiveStocks();
  }

  async getAllCryptos() {
    return await this.fetchLiveCryptos();
  }

  async searchAssets(query) {
    const q = query.toLowerCase();
    const stocks = await this.fetchLiveStocks();
    const cryptos = await this.fetchLiveCryptos();

    const filteredStocks = stocks.filter(
      s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).map(s => ({ ...s, type: 'stock' }));

    const filteredCryptos = cryptos.filter(
      c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    ).map(c => ({ ...c, type: 'crypto' }));

    return [...filteredStocks, ...filteredCryptos];
  }

  async getAssetPrice(symbol) {
    const stocks = await this.fetchLiveStocks();
    const cryptos = await this.fetchLiveCryptos();

    const stock = stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase() || s.yahooSymbol?.toUpperCase() === symbol.toUpperCase());
    if (stock && stock.price > 0) return { price: stock.price, name: stock.name, type: 'stock' };

    const crypto = cryptos.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
    if (crypto && crypto.price > 0) return { price: crypto.price, name: crypto.name, type: 'crypto' };

    // Dynamic Live Fallback: Fetch any stock ticker directly from Yahoo Finance API
    try {
      const yahooSymbol = symbol.includes('.') || !/^[A-Z]{4,5}$/i.test(symbol) ? symbol : `${symbol.toUpperCase()}.IS`;
      const chart = await fetchYahooChart(yahooSymbol);
      if (chart && chart.price > 0) {
        return { price: parseFloat(chart.price.toFixed(2)), name: symbol.toUpperCase(), type: 'stock' };
      }
    } catch (e) {
      try {
        const chart = await fetchYahooChart(symbol.toUpperCase());
        if (chart && chart.price > 0) {
          return { price: parseFloat(chart.price.toFixed(2)), name: symbol.toUpperCase(), type: 'stock' };
        }
      } catch (err) {}
    }

    return { price: 0, name: symbol, type: 'stock' };
  }
}

module.exports = new MarketService();
