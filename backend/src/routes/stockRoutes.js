const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/top-movers', stockController.getTopMovers);
router.get('/', stockController.getStocks);
router.get('/search', stockController.searchAssets);
router.get('/:symbol', stockController.getStockDetail);

module.exports = router;
