const marketService = require('../services/marketService');

const getTopMovers = async (req, res, next) => {
  try {
    const period = req.query.period || 'day';
    const data = await marketService.getTopMovers('crypto', period);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getCryptos = async (req, res, next) => {
  try {
    const cryptos = await marketService.getAllCryptos();
    res.json(cryptos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopMovers,
  getCryptos,
};
