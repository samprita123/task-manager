const express = require('express');
const router = express.Router();
const User = require('../models/User');

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        // Find user
        const user = await User.findOne({ email: trimmedEmail });

        // User not found
        if (!user) {
            return res.status(401).json({ error: 'Account not found. Please signup.' });
        }

        // Password check (plain text as requested/existing logic, but recommend hashing in future)
        if (user.password !== trimmedPassword) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // Role check
        if (user.role !== role) {
            return res.status(403).json({ error: `Access denied. Your account is registered as ${user.role}.` });
        }

        // Save login session
        user.lastActivity = new Date();
        await user.save();

        return res.json({
            success: true,
            message: 'Login successful',
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        // Check existing user
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'You already have an account. Please login.' });
        }

        // Only one admin
        if (role === 'Admin') {
            const adminExists = await User.findOne({ role: 'Admin' });
            if (adminExists) {
                return res.status(403).json({ error: 'Admin already exists. Only one admin allowed.' });
            }
        }

        // Create new user
        const newUser = new User({
            name,
            email: trimmedEmail,
            password, // Plain text as per existing logic
            role,
            status: 'Active',
            empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            position: role === 'Admin' ? 'Administrator' : 'Software Engineer',
            assignedProjects: [],
            completedProjects: 0,
            lastActivity: new Date()
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: newUser
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// GET ALL USERS
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;