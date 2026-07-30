const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/top-movers', stockController.getTopMovers);
router.get('/', stockController.getStocks);
router.get('/search', stockController.searchAssets);

module.exports = router;
