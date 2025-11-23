const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const indexRouter = require('./index.routes');

const jwt = require('jsonwebtoken');
dotenv.config();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    async (req, res) => {
        const { username, email, password, phone } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Render form with error message
            return res.status(400).render('register', { error: errors.array()[0].msg });
        }
        try {
            // Check if user/email already exists
            const existingUser = await userModel.findOne({ $or: [ { username }, { email } ] });
            if (existingUser) {
                return res.status(400).render('register', { error: 'Username or email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                phone
            });
            await newUser.save();
            return res.render('register', { success: 'User registered successfully!' });
        } catch (err) {
            return res.status(500).render('register', { error: 'Server error' });
        }
    }  
);
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login',
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', { error: errors.array()[0].msg });
        }
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).render('login', { error: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).render('login', { error: 'Invalid email or password' });
            }
            // Optionally, set a session or JWT here
            return res.render('login', { success: 'Logged in successfully!' });
        } catch (err) {
            return res.status(500).render('login', { error: 'Server error' });
        }
        res.cookie('token',token)
        res.send('Logged in successfully');
    }
);

module.exports = router;
