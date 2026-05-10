const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        const user = await User.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(401).json({ error: 'Account not found. Please signup.' });
        }

        if (user.password !== trimmedPassword) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        if (user.role !== role) {
            return res.status(403).json({ error: `Access denied. Your account is registered as ${user.role}.` });
        }

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

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'You already have an account. Please login.' });
        }

        if (role === 'Admin') {
            const adminExists = await User.findOne({ role: 'Admin' });
            if (adminExists) {
                return res.status(403).json({ error: 'Admin already exists. Only one admin allowed.' });
            }
        }

        const newUser = new User({
            name,
            email: trimmedEmail,
            password, 
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

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
