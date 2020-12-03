const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
});

db.authenticate()
    .then(() => console.log('Postgres db connected'))
    .catch(err => console.log(err));

module.exports = db;
