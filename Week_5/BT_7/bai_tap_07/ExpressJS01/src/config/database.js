require('dotenv').config();
const { Sequelize } = require('sequelize');

// Ưu tiên đọc từ .env, fallback về config.json nếu không có
const env = process.env.NODE_ENV || 'development';

// Đọc từ .env (ưu tiên) hoặc config.json (fallback)
const config = require('../../config/config.json');
const jsonConfig = config[env] || config.development;

const dbConfig = {
    host: process.env.DB_HOST || jsonConfig.host || '127.0.0.1',
    username: process.env.DB_USER || jsonConfig.username || 'root',
    password: process.env.DB_PASSWORD || jsonConfig.password || '',
    database: process.env.DB_NAME || jsonConfig.database || 'expressjs_db',
    dialect: jsonConfig.dialect || 'mysql'
};

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database via Sequelize');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

module.exports = { connection, sequelize };