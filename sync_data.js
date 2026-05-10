const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, 'backend', 'data', 'users.json');
const projectsPath = path.join(__dirname, 'backend', 'data', 'projects.json');

const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

// Clear assignedProjects for all users first to start fresh
users.forEach(u => {
    u.assignedProjects = [];
});

// Sync from projects
projects.forEach(p => {
    if (p.assignedMembers) {
        p.assignedMembers.forEach(am => {
            const user = users.find(u => u.email === am.email);
            if (user) {
                if (!user.assignedProjects.includes(p.id)) {
                    user.assignedProjects.push(p.id);
                }
            }
        });
    }
});

fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
console.log('Synchronized users assignedProjects with projects data.');
