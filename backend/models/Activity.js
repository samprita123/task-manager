const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, required: true },
    time: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
