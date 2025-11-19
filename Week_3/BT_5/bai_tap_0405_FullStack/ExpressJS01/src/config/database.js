const { Sequelize } = require('sequelize');
const config = require('../../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

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