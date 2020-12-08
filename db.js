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
OrderItem = db.import('./Models/orderItem');

// User 1:M Hours
User.hasMany(Hours);
Hours.belongsTo(User);

// User 1:M Order
User.hasMany(Order);
Order.belongsTo(User);

// Order M:M MenuItem
Order.belongsToMany(MenuItem, {through: OrderItem});
MenuItem.belongsToMany(Order, {through: OrderItem});



module.exports = db;
