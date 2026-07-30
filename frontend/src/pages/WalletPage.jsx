import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Layers, X } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CustomAssetSelect from '../components/common/CustomAssetSelect';
import './WalletPage.css';

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWalletId, setActiveWalletId] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  // New Wallet form
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletDesc, setNewWalletDesc] = useState('');
  const [newWalletCurrency, setNewWalletCurrency] = useState('USD');

  // New Asset form
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [assetQuantity, setAssetQuantity] = useState('');
  const [assetAvgPrice, setAssetAvgPrice] = useState('');

  // Asset lists for dropdowns
  const [stocksList, setStocksList] = useState([]);
  const [cryptosList, setCryptosList] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);

  const fetchWallets = async () => {
    try {
      const res = await api.get('/wallets');
      setWallets(res.data);
      if (res.data.length > 0 && !activeWalletId) {
        setActiveWalletId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch wallets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  useEffect(() => {
    if (showAddAssetModal) {
      fetchAvailableAssets();
    }
  }, [showAddAssetModal]);

  const fetchAvailableAssets = async () => {
    setAssetsLoading(true);
    try {
      const [stocksRes, cryptosRes] = await Promise.all([
        api.get('/stocks'),
        api.get('/crypto'),
      ]);
      const stocks = stocksRes.data || [];
      const cryptos = cryptosRes.data || [];
      setStocksList(stocks);
      setCryptosList(cryptos);

      const currentList = assetType === 'stock' ? stocks : cryptos;
      if (currentList && currentList.length > 0) {
        setAssetSymbol(currentList[0].symbol);
        if (currentList[0].price) {
          setAssetAvgPrice(currentList[0].price.toString());
        }
      }
    } catch (err) {
      console.error('Varlık listesi yüklenemedi:', err);
    } finally {
      setAssetsLoading(false);
    }
  };

  const handleAssetTypeChange = (newType) => {
    setAssetType(newType);
    const currentList = newType === 'stock' ? stocksList : cryptosList;
    if (currentList && currentList.length > 0) {
      setAssetSymbol(currentList[0].symbol);
      if (currentList[0].price) {
        setAssetAvgPrice(currentList[0].price.toString());
      }
    } else {
      setAssetSymbol('');
      setAssetAvgPrice('');
    }
  };

  const handleAssetSelect = (symbol) => {
    setAssetSymbol(symbol);
    const currentList = assetType === 'stock' ? stocksList : cryptosList;
    const selectedObj = currentList.find((item) => item.symbol === symbol);
    if (selectedObj && selectedObj.price) {
      setAssetAvgPrice(selectedObj.price.toString());
    }
  };

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;

    try {
      const res = await api.post('/wallets', {
        name: newWalletName,
        description: newWalletDesc,
        currency: newWalletCurrency,
      });
      setShowCreateModal(false);
      setNewWalletName('');
      setNewWalletDesc('');
      await fetchWallets();
      setActiveWalletId(res.data.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Cüzdan oluşturulamadı');
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (!window.confirm('Bu cüzdanı ve içindeki tüm varlıkları silmek istediğinizden emin misiniz?')) return;

    try {
      await api.delete(`/wallets/${walletId}`);
      setActiveWalletId(null);
      await fetchWallets();
    } catch (err) {
      alert(err.response?.data?.message || 'Cüzdan silinemedi');
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    if (!activeWalletId || !assetSymbol || !assetQuantity || !assetAvgPrice) return;

    const currentList = assetType === 'stock' ? stocksList : cryptosList;
    const selectedObj = currentList.find((item) => item.symbol === assetSymbol);

    try {
      await api.post(`/wallets/${activeWalletId}/assets`, {
        symbol: assetSymbol,
        name: selectedObj?.name || assetSymbol,
        assetType,
        quantity: parseFloat(assetQuantity),
        avgBuyPrice: parseFloat(assetAvgPrice),
      });
      setShowAddAssetModal(false);
      setAssetSymbol('');
      setAssetQuantity('');
      setAssetAvgPrice('');
      await fetchWallets();
    } catch (err) {
      alert(err.response?.data?.message || 'Varlık eklenemedi');
    }
  };

  const handleRemoveAsset = async (walletId, assetId) => {
    try {
      await api.delete(`/wallets/${walletId}/assets/${assetId}`);
      await fetchWallets();
    } catch (err) {
      alert(err.response?.data?.message || 'Varlık silinemedi');
    }
  };

  const activeWallet = wallets.find((w) => w.id === activeWalletId);

  return (
    <div className="wallet-page">
      <div className="page-header">
        <div>
          <h1>Cüzdanlarım</h1>
          <p>Kişisel cüzdanlarınızı yönetin, varlıklarınızı ve kar/zarar durumunuzu takip edin</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>Yeni Cüzdan Oluştur</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Cüzdanlar yükleniyor..." />
      ) : wallets.length === 0 ? (
        <div className="empty-state glass-panel">
          <Wallet size={48} className="empty-icon" />
          <h3>Henüz bir cüzdanınız yok</h3>
          <p>Yatırım portföyünüzü ve kar/zarar durumunuzu takip etmek için ilk cüzdanınızı oluşturun.</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            <span>Cüzdan Oluştur</span>
          </button>
        </div>
      ) : (
        <div className="wallet-container">
          {/* Left: Wallets Selector List */}
          <div className="wallets-sidebar glass-panel">
            <div className="wallets-sidebar-header">
              <h3>Cüzdan Listesi</h3>
              <span className="badge badge-success">{wallets.length} Cüzdan</span>
            </div>

            <div className="wallets-list">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className={`wallet-selector-item ${w.id === activeWalletId ? 'active' : ''}`}
                  onClick={() => setActiveWalletId(w.id)}
                >
                  <div className="wallet-item-top">
                    <span className="wallet-item-name">{w.name}</span>
                    <span className="wallet-item-currency">{w.currency}</span>
                  </div>
                  <div className="wallet-item-val">${w.totalValue?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Active Wallet Details & Assets */}
          {activeWallet && (
            <div className="wallet-details glass-panel">
              <div className="wallet-details-header">
                <div>
                  <h2>{activeWallet.name}</h2>
                  {activeWallet.description && <p>{activeWallet.description}</p>}
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={() => setShowAddAssetModal(true)}>
                    <Plus size={16} />
                    <span>Varlık Ekle</span>
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteWallet(activeWallet.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="wallet-summary-cards">
                <div className="summary-card">
                  <span className="sc-label">Toplam Portföy Değeri</span>
                  <div className="sc-value">${activeWallet.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>

                <div className="summary-card">
                  <span className="sc-label">Toplam Kar / Zarar</span>
                  <div className={`sc-value ${activeWallet.totalProfitLoss >= 0 ? 'pos' : 'neg'}`}>
                    {activeWallet.totalProfitLoss >= 0 ? `+$${activeWallet.totalProfitLoss}` : `-$${Math.abs(activeWallet.totalProfitLoss)}`}
                  </div>
                </div>
              </div>

              {/* Assets Table */}
              <div className="assets-section">
                <h3>Cüzdandaki Varlıklar ({activeWallet.assets?.length || 0})</h3>

                {activeWallet.assets?.length === 0 ? (
                  <div className="no-assets-text">Bu cüzdanda henüz eklenmiş bir varlık bulunmuyor.</div>
                ) : (
                  <div className="assets-table-wrapper">
                    <table className="assets-table">
                      <thead>
                        <tr>
                          <th>Varlık</th>
                          <th>Tür</th>
                          <th>Miktar</th>
                          <th>Ort. Alış</th>
                          <th>Anlık Fiyat</th>
                          <th>Toplam Değer</th>
                          <th>Kar / Zarar</th>
                          <th>İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeWallet.assets.map((asset) => (
                          <tr key={asset.id}>
                            <td className="asset-symbol-cell">
                              <span className="asset-sym">{asset.symbol}</span>
                              <span className="asset-name">{asset.name}</span>
                            </td>
                            <td>
                              <span className={`asset-type-badge ${asset.assetType}`}>
                                {asset.assetType === 'stock' ? 'Hisse' : 'Kripto'}
                              </span>
                            </td>
                            <td>{parseFloat(asset.quantity)}</td>
                            <td>${parseFloat(asset.avgBuyPrice).toFixed(2)}</td>
                            <td>${asset.currentPrice?.toFixed(2)}</td>
                            <td className="bold-cell">${asset.currentValue?.toLocaleString()}</td>
                            <td>
                              <span className={`change-pill ${asset.profitLoss >= 0 ? 'pos' : 'neg'}`}>
                                {asset.profitLoss >= 0 ? `+$${asset.profitLoss} (+${asset.profitLossPercent}%)` : `-$${Math.abs(asset.profitLoss)} (${asset.profitLossPercent}%)`}
                              </span>
                            </td>
                            <td>
                              <button
                                className="icon-btn-sm danger"
                                title="Varlığı Kaldır"
                                onClick={() => handleRemoveAsset(activeWallet.id, asset.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Wallet */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Yeni Cüzdan Oluştur</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateWallet} className="modal-body">
              <div className="form-group">
                <label>Cüzdan Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Teknoloji Hisseleri, Kripto Portföyüm"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Açıklama (İsteğe bağlı)</label>
                <textarea
                  placeholder="Cüzdan hedefiniz veya notlarınız..."
                  value={newWalletDesc}
                  onChange={(e) => setNewWalletDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Para Birimi</label>
                <select value={newWalletCurrency} onChange={(e) => setNewWalletCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="TRY">TRY (₺)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Asset */}
      {showAddAssetModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Cüzdana Varlık Ekle</h3>
              <button className="close-btn" onClick={() => setShowAddAssetModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="modal-body">
              <div className="form-group">
                <label>Varlık Türü</label>
                <select value={assetType} onChange={(e) => handleAssetTypeChange(e.target.value)}>
                  <option value="stock">Hisse Senedi (BIST & NASDAQ)</option>
                  <option value="crypto">Kripto Para (Binance)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Varlık Seçin ({assetType === 'stock' ? 'Hisse Senedi' : 'Kripto Para'})</label>
                <CustomAssetSelect
                  options={assetType === 'stock' ? stocksList : cryptosList}
                  value={assetSymbol}
                  onChange={handleAssetSelect}
                  loading={assetsLoading}
                  placeholder="Varlık seçin veya arayın..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adet / Miktar</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Örn: 10"
                    value={assetQuantity}
                    onChange={(e) => setAssetQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Ortalama Alış Fiyatı (
                    {assetType === 'stock' && stocksList.find((s) => s.symbol === assetSymbol)?.currency === 'TRY'
                      ? '₺'
                      : '$'}
                    )
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Örn: 150.50"
                    value={assetAvgPrice}
                    onChange={(e) => setAssetAvgPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddAssetModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" disabled={assetsLoading || !assetSymbol}>
                  Varlığı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
