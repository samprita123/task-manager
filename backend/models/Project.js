const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    user: String,
    phase: String,
    text: String,
    progress: Number,
    time: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    user: String,
    text: String,
    time: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedMembers: [{
        email: String,
        role: String
    }],
    status: { type: String, default: 'Pending' },
    progress: { type: Number, default: 0 },
    dueDate: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    completedAt: { type: Date },
    comments: [commentSchema],
    actions: [actionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
