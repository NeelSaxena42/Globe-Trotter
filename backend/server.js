const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const models = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const communityRoutes = require('./routes/community');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync models (force: false means it won't drop tables if they exist)
        await sequelize.sync({ force: false });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
