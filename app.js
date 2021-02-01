require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');

// {force: true} inside .sync() "drops all tables" each time server runs
db.sync(); 
// db.sync({force: true});
app.use(require('./middleware/headers'));
app.use(Express.json());


app.use('/user', require('./controllers/userController'));
app.use('/menuItem', require('./controllers/menuItemController'));
app.use('/customer', require('./controllers/customerController'));
app.use('/order', require('./controllers/orderController'));
app.use('/hours', require('./controllers/hoursController'));


app.listen(process.env.PORT, () => console.log(`Server Is Running On Port ${process.env.PORT}`));