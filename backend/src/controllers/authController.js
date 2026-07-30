const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;
    const data = await authService.register({ username, email, password, fullName });
    res.status(201).json(data);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, preferredCurrency } = req.body;
    const user = await authService.updateProfile(req.user.id, { fullName, preferredCurrency });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
