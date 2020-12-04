require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');


db.sync(); //{force: true} inside .sync() "drops all tables" each time server runs. enter and delete in order to drop tables only once. 
app.use(require('./Middleware/headers'));
app.use(Express.json());


app.use('/user', require('./Controllers/userController'));
app.use('/menuItem', require('./Controllers/menuItemController'));
//? Need to research db associations
// app.use('/order', require('./Controllers/orderController'));


app.listen(process.env.PORT, () => console.log(`Server is running on Port ${process.env.PORT}`));