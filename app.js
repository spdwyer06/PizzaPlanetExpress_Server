require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');

// {force: true} inside .sync() "drops all tables" each time server runs
db.sync(); 
// db.sync({force: true});
app.use(require('./Middleware/headers'));
app.use(Express.json());


app.use('/user', require('./Controllers/userController'));
app.use('/menuItem', require('./Controllers/menuItemController'));
app.use('/customer', require('./Controllers/customerController'));
app.use('/order', require('./Controllers/orderController'));
// Currently Under Final Testing
app.use('/hours', require('./Controllers/hoursController'));


app.listen(process.env.PORT, () => console.log(`Server Is Running On Port ${process.env.PORT}`));