const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Project = require('./backend/models/Project');

const fix = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI, { 
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000 
        });
        console.log('Connected. Fetching projects...');
        
        const projects = await Project.find().sort({ createdAt: -1 });
        console.log(`Found ${projects.length} projects.`);
        
        const seen = new Set();
        let deletedCount = 0;
        
        for (const p of projects) {
            if (seen.has(p.title)) {
                console.log(`Deleting duplicate: ${p.title}`);
                await Project.findByIdAndDelete(p._id);
                deletedCount++;
            } else {
                seen.add(p.title);
            }
        }
        console.log(`Deleted ${deletedCount} duplicate projects.`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fix();
