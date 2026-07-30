const sequelize = require('../config/database');
const User = require('./User');
const Wallet = require('./Wallet');
const WalletAsset = require('./WalletAsset');

// Relationships
User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wallet.hasMany(WalletAsset, { foreignKey: 'walletId', as: 'assets', onDelete: 'CASCADE' });
WalletAsset.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

module.exports = {
  sequelize,
  User,
  Wallet,
  WalletAsset,
};
