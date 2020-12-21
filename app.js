require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');

//{force: true} inside .sync() "drops all tables" each time server runs. enter and delete in order to drop tables only once.
db.sync(); 
// db.sync({force: true});
app.use(require('./Middleware/headers'));
app.use(Express.json());


app.use('/user', require('./Controllers/userController'));
app.use('/menuItem', require('./Controllers/menuItemController'));
// Currently Under Final Testing
app.use('/order', require('./Controllers/orderController'));
app.use('/hours', require('./Controllers/hoursController'));
app.use('/customer', require('./Controllers/customerController'));


app.listen(process.env.PORT, () => console.log(`Server Is Running On Port ${process.env.PORT}`));