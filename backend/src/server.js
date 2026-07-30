const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sync Database
    await sequelize.authenticate();
    console.log('✅ PostgreSQL veritabanı bağlantısı başarılı.');

    await sequelize.sync({ alter: true });
    console.log('✅ Veritabanı modelleri senkronize edildi.');

    app.listen(PORT, () => {
      console.log(`🚀 Economy Panel Backend servisi ${PORT} portunda çalışıyor.`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılamadı:', error);
    process.exit(1);
  }
}

startServer();
