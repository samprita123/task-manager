const express = require('express');
const router = express.Router();
const { users, saveData } = require('../db');

// Get own profile (All roles)
router.get('/me', (req, res) => {
    const me = users.find(u => u.email === req.userEmail);
    if (!me) return res.status(404).json({ error: 'Profile not found' });
    return res.json(me);
});

// Admin only routes below
router.use((req, res, next) => {
    if (req.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required for member management' });
    }
    next();
});

// Get all members (excluding admins)
router.get('/', (req, res) => {
    return res.json(users.filter(u => u.role === 'Member'));
});

// Add a member
router.post('/', (req, res) => {
    const { name, email, role } = req.body;
    const newUser = {
        id: String(Date.now()),
        name,
        email,
        role: role || 'Member',
        status: 'Active',
        assignedProjects: [],
        completedProjects: 0,
        lastActivity: new Date().toISOString()
    };
    users.push(newUser);
    saveData();
    return res.status(201).json(newUser);
});

// Disable/Enable member
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.status = status;
    saveData();
    return res.json(user);
});

// Remove member
router.delete('/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    const deleted = users.splice(index, 1);
    saveData();
    return res.json(deleted[0]);
});

module.exports = router;
