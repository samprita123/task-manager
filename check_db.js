const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Project = require('./backend/models/Project');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const projects = await Project.find();
        console.log(`Total Projects: ${projects.length}`);
        
        const statuses = projects.map(p => p.status);
        const counts = {};
        statuses.forEach(s => counts[s] = (counts[s] || 0) + 1);
        console.log('Status counts:', counts);
        
        const duplicates = {};
        projects.forEach(p => {
            duplicates[p.title] = (duplicates[p.title] || 0) + 1;
        });
        const dupeTitles = Object.keys(duplicates).filter(t => duplicates[t] > 1);
        console.log('Duplicate titles:', dupeTitles);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
