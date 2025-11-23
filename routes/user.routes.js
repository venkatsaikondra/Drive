const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
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

module.exports = router;
