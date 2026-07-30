import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import './CustomAssetSelect.css';

const CustomAssetSelect = ({
  options = [],
  value,
  onChange,
  loading,
  placeholder = 'Varlık Seçin',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.symbol === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      opt.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
      >
        {loading ? (
          <span className="select-placeholder">Varlıklar yükleniyor...</span>
        ) : selectedOption ? (
          <div className="selected-val-content">
            <span className="sel-sym">{selectedOption.symbol}</span>
            <span className="sel-name">- {selectedOption.name}</span>
            <span className="sel-price">
              ({selectedOption.currency === 'TRY' ? '₺' : '$'}
              {selectedOption.price?.toLocaleString()})
            </span>
          </div>
        ) : (
          <span className="select-placeholder">{placeholder}</span>
        )}
        <ChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && !loading && (
        <div className="custom-select-menu">
          <div className="select-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Ara (Sembol veya İsim)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="custom-select-options">
            {filteredOptions.length === 0 ? (
              <div className="no-options">Sonuç bulunamadı</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.symbol}
                  className={`custom-select-option ${opt.symbol === value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.symbol);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  <div className="opt-left">
                    <span className="opt-sym">{opt.symbol}</span>
                    <span className="opt-name">{opt.name}</span>
                  </div>
                  <div className="opt-right">
                    <span className="opt-price">
                      {opt.currency === 'TRY' ? '₺' : '$'}
                      {opt.price?.toLocaleString()}
                    </span>
                    {opt.symbol === value && <Check size={16} className="check-icon" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAssetSelect;
