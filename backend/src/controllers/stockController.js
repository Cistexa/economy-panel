const marketService = require('../services/marketService');

const getTopMovers = async (req, res, next) => {
  try {
    const period = req.query.period || 'day';
    const data = await marketService.getTopMovers('stock', period);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getStocks = async (req, res, next) => {
  try {
    const stocks = await marketService.getAllStocks();
    res.json(stocks);
  } catch (error) {
    next(error);
  }
};

const searchAssets = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const results = await marketService.searchAssets(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopMovers,
  getStocks,
  searchAssets,
};
