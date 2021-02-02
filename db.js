const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

db.authenticate()
    .then(() => console.log('Postgres db connected'))
    .catch(err => console.log(err));

User = db.import('./models/user');
Hours = db.import('./models/hours');
MenuItem = db.import('./models/menuItem');
Order = db.import('./models/order');
OrderItem = db.import('./models/orderItem');
Customer = db.import('./models/customer');

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
