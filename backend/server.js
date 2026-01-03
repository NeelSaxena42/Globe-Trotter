const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
require('./models'); // ensure models are registered

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const communityRoutes = require('./routes/community');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

const startServer = async () => {
  try {
    console.log('Connecting to database...');

    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1); // crash loudly if DB fails
  }
};

startServer();

/* -------------------- KEEP ALIVE (DEV ONLY) -------------------- */
// Comment this out in production if you want
setInterval(() => {
  console.log('⏳ Server alive');
}, 15000);
