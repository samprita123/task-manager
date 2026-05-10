const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get own profile (All roles)
router.get('/me', async (req, res) => {
    try {
        const me = await User.findOne({ email: req.userEmail });
        if (!me) return res.status(404).json({ error: 'Profile not found' });
        return res.json(me);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Admin only middleware
router.use((req, res, next) => {
    if (req.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required for member management' });
    }
    next();
});

// Get all members (excluding admins)
router.get('/', async (req, res) => {
    try {
        const members = await User.find({ role: 'Member' });
        return res.json(members);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Add a member (Admin manually adds)
router.post('/', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const newUser = new User({
            name,
            email,
            role: role || 'Member',
            status: 'Active',
            assignedProjects: [],
            completedProjects: 0,
            lastActivity: new Date(),
            password: 'member123' // Default password for manually added members
        });
        await newUser.save();
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Disable/Enable member
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Remove member
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        return res.json(deleted);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
