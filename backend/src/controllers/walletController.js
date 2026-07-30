const walletService = require('../services/walletService');

const getWallets = async (req, res, next) => {
  try {
    const wallets = await walletService.getUserWallets(req.user.id);
    res.json(wallets);
  } catch (error) {
    next(error);
  }
};

const getWalletById = async (req, res, next) => {
  try {
    const wallet = await walletService.getWalletById(req.params.id, req.user.id);
    res.json(wallet);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const createWallet = async (req, res, next) => {
  try {
    const { name, description, currency } = req.body;
    const wallet = await walletService.createWallet(req.user.id, { name, description, currency });
    res.status(201).json(wallet);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateWallet = async (req, res, next) => {
  try {
    const { name, description, currency } = req.body;
    const wallet = await walletService.updateWallet(req.params.id, req.user.id, { name, description, currency });
    res.json(wallet);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const deleteWallet = async (req, res, next) => {
  try {
    await walletService.deleteWallet(req.params.id, req.user.id);
    res.json({ message: 'Cüzdan başarıyla silindi' });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const addAsset = async (req, res, next) => {
  try {
    const { symbol, name, assetType, quantity, avgBuyPrice } = req.body;
    const asset = await walletService.addAssetToWallet(req.params.id, req.user.id, {
      symbol,
      name,
      assetType,
      quantity,
      avgBuyPrice,
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const removeAsset = async (req, res, next) => {
  try {
    await walletService.removeAssetFromWallet(req.params.id, req.params.assetId, req.user.id);
    res.json({ message: 'Varlık cüzdandan kaldırıldı' });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  getWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  addAsset,
  removeAsset,
};
