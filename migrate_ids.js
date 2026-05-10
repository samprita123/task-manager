const fs = require('fs');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, 'backend', 'data', 'projects.json');

if (fs.existsSync(PROJECTS_FILE)) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
    const migrated = data.map(p => {
        if (p.id && !p._id) {
            p._id = p.id;
        }
        return p;
    });
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(migrated, null, 2));
    console.log('Migrated projects.json successfully.');
} else {
    console.log('projects.json not found.');
}
