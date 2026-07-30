import React, { useState } from 'react';
import { User, Shield, Globe, Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [currency, setCurrency] = useState(user?.preferredCurrency || 'USD');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        fullName,
        preferredCurrency: currency,
      });
      updateUserProfile(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Ayarlar kaydedilemedi');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Hesap Ayarları</h1>
          <p>Profil bilgilerinizi ve tercihlerinizi özelleştirin</p>
        </div>
      </div>

      <div className="settings-content glass-panel">
        <form onSubmit={handleSave} className="settings-form">
          <div className="setting-section">
            <h3><User size={18} /> Profil Bilgileri</h3>
            
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input type="text" value={user?.username || ''} disabled className="disabled-input" />
              <small>Kullanıcı adı değiştirilemez.</small>
            </div>

            <div className="form-group">
              <label>E-posta Adresi</label>
              <input type="email" value={user?.email || ''} disabled className="disabled-input" />
            </div>

            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız ve soyadınız"
              />
            </div>
          </div>

          <div className="setting-section">
            <h3><Globe size={18} /> Bölgesel Tercihler</h3>

            <div className="form-group">
              <label>Varsayılan Para Birimi</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD - Amerikan Doları ($)</option>
                <option value="TRY">TRY - Türk Lirası (₺)</option>
                <option value="EUR">EUR - Euro (€)</option>
              </select>
            </div>
          </div>

          <div className="settings-footer">
            {saved && (
              <span className="save-success">
                <Check size={16} /> Değişiklikler kaydedildi!
              </span>
            )}
            <button type="submit" className="btn btn-primary">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
