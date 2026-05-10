const fs = require('fs');

const files = [
    'frontend/src/pages/Dashboard.jsx',
    'frontend/src/pages/Login.jsx',
    'frontend/src/pages/Profile.jsx',
    'frontend/src/pages/Projects.jsx',
    'frontend/src/pages/Signup.jsx',
    'frontend/src/pages/TeamMembers.jsx',
    'frontend/src/components/AddProjectModal.jsx',
    'frontend/src/components/ProjectDetailsDrawer.jsx',
    'frontend/src/components/MemberDetailsDrawer.jsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Add imports if needed
    let importPath = file.includes('components') ? '../api/config' : '../api/config';
    if (!content.includes('import { ENDPOINTS, API_BASE_URL }') && !content.includes('import { API_BASE_URL }')) {
        content = `import { API_BASE_URL, ENDPOINTS } from '${importPath}';\n` + content;
    }
    
    // Replace localhost URLs
    content = content.replace(/['"]http:\/\/localhost:5000\/api(.*?)['"]/g, '`${API_BASE_URL}$1`');
    // Replace hardcoded render URLs
    content = content.replace(/['"]https:\/\/task-manager-kmh2\.onrender\.com\/api(.*?)['"]/g, '`${API_BASE_URL}$1`');
    
    fs.writeFileSync(file, content);
    console.log('Processed', file);
});
