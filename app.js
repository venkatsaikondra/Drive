const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);
app.get('/',(req, res) => {
    res.render('index');
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});