const fs = require('fs');
const file = 'frontend/src/components/ProjectDetailsDrawer.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_BASE_URL}');
fs.writeFileSync(file, content);
