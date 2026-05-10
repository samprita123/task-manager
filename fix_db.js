const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Project = require('./backend/models/Project');

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        // 1. Remove Duplicates
        const projects = await Project.find().sort({ createdAt: -1 });
        const seen = new Set();
        let deletedCount = 0;
        
        for (const p of projects) {
            if (seen.has(p.title)) {
                await Project.findByIdAndDelete(p._id);
                deletedCount++;
            } else {
                seen.add(p.title);
            }
        }
        console.log(`Deleted ${deletedCount} duplicate projects.`);
        
        // 2. Fix potential status/date issues
        const allProjects = await Project.find();
        for (const p of allProjects) {
            let updated = false;
            
            // Ensure status casing is correct
            if (p.status === 'in progress') { p.status = 'In Progress'; updated = true; }
            if (p.status === 'pending') { p.status = 'Pending'; updated = true; }
            if (p.status === 'completed') { p.status = 'Completed'; updated = true; }
            
            if (updated) await p.save();
        }
        
        console.log('Cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fix();
