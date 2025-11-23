const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator');
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register',
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    
    (req, res) => {
    // Handle registration logic here
    console.log(req.body);
    res.send('User registered successfully!');
}
);

module.exports = router;
