const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/db');
const indexRouter = require('./routes/index.routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
connectDB();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});