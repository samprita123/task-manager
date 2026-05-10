const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

// Models
const User = require('./backend/models/User');
const Project = require('./backend/models/Project');
const Activity = require('./backend/models/Activity');

const DATA_DIR = path.join(__dirname, 'backend', 'data');

const migrate = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { 
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000 
        });
        console.log('Connected successfully.');

        // Migrate Users
        const usersFile = path.join(DATA_DIR, 'users.json');
        if (fs.existsSync(usersFile)) {
            console.log('Migrating users...');
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            for (const u of users) {
                // Remove id if it exists to avoid conflict with MongoDB _id
                const { id, ...userData } = u;
                await User.findOneAndUpdate({ email: u.email }, userData, { upsert: true, new: true });
            }
            console.log(`Migrated ${users.length} users.`);
        }

        // Migrate Projects
        const projectsFile = path.join(DATA_DIR, 'projects.json');
        if (fs.existsSync(projectsFile)) {
            console.log('Migrating projects...');
            const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
            for (const p of projects) {
                const { _id, id, ...projectData } = p;
                await Project.create(projectData);
            }
            console.log(`Migrated ${projects.length} projects.`);
        }

        // Migrate Activity
        const feedFile = path.join(DATA_DIR, 'activityFeed.json');
        if (fs.existsSync(feedFile)) {
            console.log('Migrating activity feed...');
            const activities = JSON.parse(fs.readFileSync(feedFile, 'utf8'));
            for (const a of activities) {
                const { id, ...activityData } = a;
                await Activity.create(activityData);
            }
            console.log(`Migrated ${activities.length} activity items.`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
