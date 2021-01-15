const Sequelize = require('sequelize');
// const customer = require('./Models/customer');

// const db = new Sequelize(process.env.DB_NAME, 'postgres', process.env.PASS, {
//     host: 'localhost',
//     dialect: 'postgres'
//     // dialectOptions: {
//     //     decimalNumbers: true
//     // }
// });

const db = new Sequelize(process.env.DATABASE_URL, {
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
Customer = db.import('./Models/customer');

// User 1:M Hours
User.hasMany(Hours);
Hours.belongsTo(User);

// User 1:M Order
User.hasMany(Order);
Order.belongsTo(User);
// User.hasMany(Order, {as: 'Employee'});
// Order.belongsTo(User, {as: 'Employee'});

// Customer 1:M Order
Customer.hasMany(Order);
Order.belongsTo(Customer)

// Order M:M MenuItem
Order.belongsToMany(MenuItem, {through: OrderItem});
MenuItem.belongsToMany(Order, {through: OrderItem});
// Order.belongsToMany(MenuItem, {through: {model: OrderItem, unique: false}, constraints: false});
// MenuItem.belongsToMany(Order, {through: {model: OrderItem, unique: false}, constraints: false});



module.exports = db;
