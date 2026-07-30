const { Wallet, WalletAsset } = require('../models');
const marketService = require('./marketService');

class WalletService {
  async getUserWallets(userId) {
    const wallets = await Wallet.findAll({
      where: { userId },
      include: [
        {
          model: WalletAsset,
          as: 'assets',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return await Promise.all(
      wallets.map(async (wallet) => {
        const plainWallet = wallet.toJSON();
        let totalValue = 0;
        let totalProfitLoss = 0;

        const enrichedAssets = await Promise.all(
          plainWallet.assets.map(async (asset) => {
            const currentPriceInfo = await marketService.getAssetPrice(asset.symbol);
            const currentPrice = currentPriceInfo.price;
            const totalCost = parseFloat(asset.quantity) * parseFloat(asset.avgBuyPrice);
            const currentValue = parseFloat(asset.quantity) * currentPrice;
            const profitLoss = currentValue - totalCost;
            const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

            totalValue += currentValue;
            totalProfitLoss += profitLoss;

            return {
              ...asset,
              currentPrice,
              totalCost: parseFloat(totalCost.toFixed(2)),
              currentValue: parseFloat(currentValue.toFixed(2)),
              profitLoss: parseFloat(profitLoss.toFixed(2)),
              profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
            };
          })
        );

        return {
          ...plainWallet,
          assets: enrichedAssets,
          totalValue: parseFloat(totalValue.toFixed(2)),
          totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
        };
      })
    );
  }

  async getWalletById(walletId, userId) {
    const wallet = await Wallet.findOne({
      where: { id: walletId, userId },
      include: [{ model: WalletAsset, as: 'assets' }],
    });

    if (!wallet) {
      throw new Error('Cüzdan bulunamadı veya erişim yetkiniz yok');
    }

    const plainWallet = wallet.toJSON();
    let totalValue = 0;
    let totalProfitLoss = 0;

    const enrichedAssets = await Promise.all(
      plainWallet.assets.map(async (asset) => {
        const currentPriceInfo = await marketService.getAssetPrice(asset.symbol);
        const currentPrice = currentPriceInfo.price;
        const totalCost = parseFloat(asset.quantity) * parseFloat(asset.avgBuyPrice);
        const currentValue = parseFloat(asset.quantity) * currentPrice;
        const profitLoss = currentValue - totalCost;
        const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

        totalValue += currentValue;
        totalProfitLoss += profitLoss;

        return {
          ...asset,
          currentPrice,
          totalCost: parseFloat(totalCost.toFixed(2)),
          currentValue: parseFloat(currentValue.toFixed(2)),
          profitLoss: parseFloat(profitLoss.toFixed(2)),
          profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
        };
      })
    );

    return {
      ...plainWallet,
      assets: enrichedAssets,
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
    };
  }

  async createWallet(userId, { name, description, currency }) {
    if (!name) {
      throw new Error('Cüzdan adı zorunludur');
    }

    const wallet = await Wallet.create({
      userId,
      name,
      description,
      currency: currency || 'USD',
    });

    return wallet;
  }

  async updateWallet(walletId, userId, { name, description, currency }) {
    const wallet = await Wallet.findOne({ where: { id: walletId, userId } });
    if (!wallet) {
      throw new Error('Cüzdan bulunamadı');
    }

    if (name) wallet.name = name;
    if (description !== undefined) wallet.description = description;
    if (currency) wallet.currency = currency;

    await wallet.save();
    return wallet;
  }

  async deleteWallet(walletId, userId) {
    const wallet = await Wallet.findOne({ where: { id: walletId, userId } });
    if (!wallet) {
      throw new Error('Cüzdan bulunamadı');
    }

    await wallet.destroy();
    return true;
  }

  async addAssetToWallet(walletId, userId, { symbol, name, assetType, quantity, avgBuyPrice }) {
    const wallet = await Wallet.findOne({ where: { id: walletId, userId } });
    if (!wallet) {
      throw new Error('Cüzdan bulunamadı');
    }

    if (!symbol || !quantity || !avgBuyPrice) {
      throw new Error('Sembol, miktar ve alış fiyatı girilmelidir');
    }

    const existingAsset = await WalletAsset.findOne({
      where: { walletId, symbol: symbol.toUpperCase() },
    });

    if (existingAsset) {
      const oldQty = parseFloat(existingAsset.quantity);
      const newQty = parseFloat(quantity);
      const oldAvg = parseFloat(existingAsset.avgBuyPrice);
      const newAvg = parseFloat(avgBuyPrice);

      const totalQty = oldQty + newQty;
      const weightedAvgPrice = ((oldQty * oldAvg) + (newQty * newAvg)) / totalQty;

      existingAsset.quantity = totalQty;
      existingAsset.avgBuyPrice = parseFloat(weightedAvgPrice.toFixed(4));
      await existingAsset.save();
      return existingAsset;
    }

    const marketInfo = await marketService.getAssetPrice(symbol);

    const asset = await WalletAsset.create({
      walletId,
      symbol: symbol.toUpperCase(),
      name: name || marketInfo.name || symbol.toUpperCase(),
      assetType: assetType || marketInfo.type || 'stock',
      quantity,
      avgBuyPrice,
    });

    return asset;
  }

  async removeAssetFromWallet(walletId, assetId, userId) {
    const wallet = await Wallet.findOne({ where: { id: walletId, userId } });
    if (!wallet) {
      throw new Error('Cüzdan bulunamadı');
    }

    const asset = await WalletAsset.findOne({ where: { id: assetId, walletId } });
    if (!asset) {
      throw new Error('Varlık bulunamadı');
    }

    await asset.destroy();
    return true;
  }
}

module.exports = new WalletService();
