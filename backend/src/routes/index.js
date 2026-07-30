const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const walletRoutes = require('./walletRoutes');
const stockRoutes = require('./stockRoutes');
const cryptoRoutes = require('./cryptoRoutes');

router.use('/auth', authRoutes);
router.use('/wallets', walletRoutes);
router.use('/stocks', stockRoutes);
router.use('/crypto', cryptoRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;
