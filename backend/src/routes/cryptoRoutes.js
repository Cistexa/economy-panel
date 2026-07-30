const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

router.get('/top-movers', cryptoController.getTopMovers);
router.get('/', cryptoController.getCryptos);

module.exports = router;
