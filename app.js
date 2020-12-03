require('dotenv').config();
const Express = require('express');
const app = Express();
const db = require('./db');


db.sync();
app.use(require('./Middleware/headers'));
app.use(Express.json());


app.use('/user', require('./Controllers/userController'));


app.listen(process.env.PORT, () => console.log(`Server is running on Port ${process.env.PORT}`));