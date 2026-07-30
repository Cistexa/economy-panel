const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_economy_panel_2026', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  async register({ username, email, password, fullName }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanılıyor');
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new Error('Bu kullanıcı adı zaten alınmış');
    }

    const user = await User.create({
      username,
      email,
      password,
      fullName,
    });

    const token = this.generateToken(user.id);
    return { user: user.toSafeObject(), token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const token = this.generateToken(user.id);
    return { user: user.toSafeObject(), token };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    return user.toSafeObject();
  }

  async updateProfile(userId, { fullName, preferredCurrency }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (preferredCurrency !== undefined) user.preferredCurrency = preferredCurrency;

    await user.save();
    return user.toSafeObject();
  }
}

module.exports = new AuthService();
