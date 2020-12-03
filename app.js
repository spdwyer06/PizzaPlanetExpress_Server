require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');


db.sync(); //{force: true} inside .sync() "drops all tables" each time server runs. enter and delete in order to drop tables only once. 
app.use(require('./Middleware/headers'));
app.use(Express.json());


app.use('/user', require('./Controllers/userController'));


app.listen(process.env.PORT, () => console.log(`Server is running on Port ${process.env.PORT}`));