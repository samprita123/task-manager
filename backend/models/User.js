const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    status: { type: String, default: 'Active' },
    empId: { type: String },
    position: { type: String },
    assignedProjects: [{ type: String }], // Array of project IDs
    completedProjects: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
