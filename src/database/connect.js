const knex = require('knex');
require('dotenv').config();

const connection = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    }
};

const db = knex(connection);
module.exports = db;