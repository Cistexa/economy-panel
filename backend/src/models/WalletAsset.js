const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WalletAsset = sequelize.define('WalletAsset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'wallets',
      key: 'id',
    },
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assetType: {
    type: DataTypes.ENUM('stock', 'crypto'),
    allowNull: false,
    defaultValue: 'stock',
  },
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0,
  },
  avgBuyPrice: {
    type: DataTypes.DECIMAL(18, 4),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'wallet_assets',
});

module.exports = WalletAsset;
