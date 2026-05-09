// const express = require('express');
// const router = express.Router();
// const { users, saveData } = require('../db');

// // Login Endpoint
// router.post('/login', (req, res) => {
//     const { email, password, role } = req.body;
    
//     if (!email || !password || !role) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Since this is mock backend, we don't check password currently, just simulate user matching.
//     const user = users.find(u => u.email === email);
    
//     if (!user) {
//         return res.status(401).json({ error: 'Invalid email or password.' });
//     }

//     if (user.role !== role) {
//         return res.status(403).json({ error: `Access denied. Your account is registered as ${user.role}, not ${role}.` });
//     }

//     return res.json({ message: 'Login successful', user });
// });

// // Signup Endpoint
// router.post('/signup', (req, res) => {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//         return res.status(400).json({ error: 'All fields are required.' });
//     }
    
//     if (password.length < 6) {
//         return res.status(400).json({ error: 'Password must be at least 6 characters.' });
//     }

//     const existingUser = users.find(u => u.email === email);
//     if (existingUser) {
//         return res.status(409).json({ error: 'You already have an account. Please login.' });
//     }

//     if (role === 'Admin') {
//         const adminExists = users.some(u => u.role === 'Admin');
//         if (adminExists) {
//             return res.status(403).json({ error: 'An Admin already exists. Only one admin is allowed.' });
//         }
//     }

//     const newUser = {
//         id: String(Date.now()),
//         name,
//         email,
//         role,
//         status: 'Active',
//         empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
//         position: role === 'Admin' ? 'Administrator' : 'Software Engineer',
//         assignedProjects: [],
//         completedProjects: 0,
//         lastActivity: new Date().toISOString()
//     };
    
//     users.push(newUser);
//     saveData();

//     return res.status(201).json({ message: 'Account created successfully', user: newUser });
// });

// module.exports = router;


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

    // Find user
    const user = users.find(
        u => u.email === email
    );

    // User not found
    if (!user) {
        return res.status(401).json({
            error: 'Account not found. Please signup.'
        });
    }

    // Password check
    if (user.password !== password) {
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

    if (password.length < 6) {

        return res.status(400).json({
            error: 'Password must be at least 6 characters.'
        });
    }

    // Check existing user
    const existingUser = users.find(
        u => u.email === email
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