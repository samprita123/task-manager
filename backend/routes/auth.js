const express = require('express');
const router = express.Router();

const { users, saveData } = require('../db');


// LOGIN
router.post('/login', (req, res) => {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Find user
    const user = users.find(
        u => u.email.trim().toLowerCase() === trimmedEmail
    );

    // User not found
    if (!user) {
        return res.status(401).json({
            error: 'Account not found. Please signup.'
        });
    }

    // Password check
    if (user.password !== trimmedPassword) {
        return res.status(401).json({
            error: 'Incorrect password.'
        });
    }

    // Role check
    if (user.role !== role) {
        return res.status(403).json({
            error:
                `Access denied. Your account is registered as ${user.role}.`
        });
    }

    // Save login session
    user.lastActivity = new Date().toISOString();

    saveData();

    return res.json({
        success: true,
        message: 'Login successful',
        user
    });
});


// SIGNUP
router.post('/signup', (req, res) => {

    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {

        return res.status(400).json({
            error: 'All fields are required.'
        });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 6) {

        return res.status(400).json({
            error: 'Password must be at least 6 characters.'
        });
    }

    // Check existing user
    const existingUser = users.find(
        u => u.email.trim().toLowerCase() === trimmedEmail
    );

    if (existingUser) {

        return res.status(409).json({
            error: 'You already have an account. Please login.'
        });
    }

    // Only one admin
    if (role === 'Admin') {

        const adminExists = users.some(
            u => u.role === 'Admin'
        );

        if (adminExists) {

            return res.status(403).json({
                error:
                    'Admin already exists. Only one admin allowed.'
            });
        }
    }

    // Create new user
    const newUser = {

        id: `mem-${Date.now()}`,

        name,

        email,

        password,

        role,

        status: 'Active',

        empId:
            `EMP-${Math.floor(
                1000 + Math.random() * 9000
            )}`,

        position:
            role === 'Admin'
                ? 'Administrator'
                : 'Software Engineer',

        assignedProjects: [],

        completedProjects: 0,

        lastActivity: new Date().toISOString()
    };

    // Add user
    users.push(newUser);

    // SAVE FOREVER
    saveData();

    return res.status(201).json({

        success: true,

        message: 'Account created successfully',

        user: newUser
    });
});


// GET ALL USERS
router.get('/users', (req, res) => {

    return res.json(users);
});


module.exports = router;