const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
});

db.authenticate()
    .then(() => console.log('Postgres db connected'))
    .catch(err => console.log(err));

User = db.import('./Models/user');
Hours = db.import('./Models/hours');
MenuItem = db.import('./Models/menuItem');
Order = db.import('./Models/order');

Hours.belongsTo(User);
User.hasMany(Hours);



module.exports = db;
