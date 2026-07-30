const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', walletController.getWallets);
router.post('/', walletController.createWallet);
router.get('/:id', walletController.getWalletById);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

router.post('/:id/assets', walletController.addAsset);
router.delete('/:id/assets/:assetId', walletController.removeAsset);

module.exports = router;
