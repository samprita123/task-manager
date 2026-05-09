const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const FEED_FILE = path.join(DATA_DIR, 'activityFeed.json');

// data directory create kiya
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// save kiya hua data
const initialUsers = [
    {
        id: 'admin-1',
        name: 'Samprita patra',
        email: 'sam123@gmail.com',
        role: 'Admin',
        status: 'Active',
        empId: 'ADM-001',
        position: 'Chief Operations Officer',
        assignedProjects: ['p1', 'p2'],
        completedProjects: 12,
        lastActivity: new Date().toISOString()
    },
    { id: 'mem-1', name: 'Aarav Sharma', email: 'aarav@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-101', position: 'Lead Developer', assignedProjects: ['p1'], completedProjects: 4, lastActivity: new Date().toISOString() },
    { id: 'mem-2', name: 'Ishani Gupta', email: 'ishani@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-102', position: 'UI/UX Designer', assignedProjects: ['p1'], completedProjects: 3, lastActivity: new Date().toISOString() },
    { id: 'mem-3', name: 'Vihaan Reddy', email: 'vihaan@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-103', position: 'Backend Engineer', assignedProjects: ['p2'], completedProjects: 5, lastActivity: new Date().toISOString() },
    { id: 'mem-4', name: 'Ananya Iyer', email: 'ananya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-104', position: 'Product Manager', assignedProjects: [], completedProjects: 2, lastActivity: new Date().toISOString() },
    { id: 'mem-5', name: 'Arjun Malhotra', email: 'arjun@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-105', position: 'DevOps Lead', assignedProjects: [], completedProjects: 6, lastActivity: new Date().toISOString() },
    { id: 'mem-6', name: 'Sanya Kapoor', email: 'sanya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-106', position: 'Frontend Dev', assignedProjects: [], completedProjects: 1, lastActivity: new Date().toISOString() },
    { id: 'mem-7', name: 'Rohan Joshi', email: 'rohan@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-107', position: 'QA Automator', assignedProjects: [], completedProjects: 3, lastActivity: new Date().toISOString() },
    { id: 'mem-8', name: 'Kavya Singh', email: 'kavya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-108', position: 'Graphic Designer', assignedProjects: [], completedProjects: 2, lastActivity: new Date().toISOString() },
    { id: 'mem-9', name: 'Aditya Das', email: 'aditya@ethara.ai', role: 'Member', status: 'Inactive', empId: 'EMP-109', position: 'Data Scientist', assignedProjects: [], completedProjects: 0, lastActivity: new Date().toISOString() },
    { id: 'mem-10', name: 'Meera Nair', email: 'meera@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-110', position: 'HR Manager', assignedProjects: [], completedProjects: 4, lastActivity: new Date().toISOString() },
    { id: 'mem-11', name: 'Pranav Bajaj', email: 'pranav@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-111', position: 'System Admin', assignedProjects: [], completedProjects: 5, lastActivity: new Date().toISOString() },
    { id: 'mem-12', name: 'Diya Saxena', email: 'diya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-112', position: 'Mobile Dev', assignedProjects: [], completedProjects: 2, lastActivity: new Date().toISOString() },
    { id: 'mem-13', name: 'Kabir Bose', email: 'kabir@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-113', position: 'Security Engineer', assignedProjects: [], completedProjects: 3, lastActivity: new Date().toISOString() },
    { id: 'mem-14', name: 'Anika Choudhury', email: 'anika@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-114', position: 'Business Analyst', assignedProjects: [], completedProjects: 1, lastActivity: new Date().toISOString() },
    { id: 'mem-15', name: 'Siddharth Pillai', email: 'siddharth@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-115', position: 'Cloud Architect', assignedProjects: [], completedProjects: 4, lastActivity: new Date().toISOString() },
    { id: 'mem-16', name: 'Riya Sen', email: 'riya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-116', position: 'Fullstack Dev', assignedProjects: [], completedProjects: 3, lastActivity: new Date().toISOString() },
    { id: 'mem-17', name: 'Aryan Goel', email: 'aryan@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-117', position: 'Content Strategist', assignedProjects: [], completedProjects: 2, lastActivity: new Date().toISOString() },
    { id: 'mem-18', name: 'Zoya Khan', email: 'zoya@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-118', position: 'Digital Marketer', assignedProjects: [], completedProjects: 1, lastActivity: new Date().toISOString() },
    { id: 'mem-19', name: 'Dev Mukherjee', email: 'dev@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-119', position: 'Video Editor', assignedProjects: [], completedProjects: 2, lastActivity: new Date().toISOString() },
    { id: 'mem-20', name: 'Neha Gupta', email: 'neha@ethara.ai', role: 'Member', status: 'Active', empId: 'EMP-120', position: 'Accountant', assignedProjects: [], completedProjects: 3, lastActivity: new Date().toISOString() }
];

const initialProjects = [
    {
        id: 'p1',
        title: 'Dashboard Redesign',
        description: 'Update the main dashboard UI to be project-centric with advanced visualizations.',
        assignedMembers: [
            { email: 'zoya@ethara.ai', role: 'Project Lead' },
            { email: 'aarav@ethara.ai', role: 'Frontend Dev' },
            { email: 'ishani@ethara.ai', role: 'UI Designer' }
        ],
        status: 'In Progress',
        progress: 45,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        priority: 'High',
        comments: [
            { user: 'sam123@gmail.com', text: 'Please prioritize the chart animations.', time: '2026-05-01T10:00:00Z' }
        ],
        actions: [
            { phase: 'Design', text: 'Completed UI wireframes', user: 'ishani@ethara.ai', progress: 30, time: '2026-05-02T14:00:00Z' },
            { phase: 'Development', text: 'Initialized React project and basic routing', user: 'aarav@ethara.ai', progress: 45, time: '2026-05-03T16:00:00Z' }
        ]
    },
    {
        id: 'p2',
        title: 'Backend API Refactor',
        description: 'Implement secure RBAC authentication layers and optimize database queries.',
        assignedMembers: [
            { email: 'anika@ethara.ai', role: 'Lead Architect' },
            { email: 'vihaan@ethara.ai', role: 'Backend Dev' }
        ],
        status: 'Completed',
        progress: 100,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        priority: 'Medium',
        comments: [],
        actions: []
    }
];

const initialFeed = [
    { id: 1, user: 'Samprita patra', action: 'created', target: 'Dashboard Redesign', time: '2 hours ago' },
    { id: 2, user: 'Aarav Sharma', action: 'updated progress', target: 'Dashboard Redesign', time: '5 hours ago' }
];

// Helper to load or initialize
function initializeFile(file, data) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return data;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

let users = initializeFile(USERS_FILE, initialUsers);
let projects = initializeFile(PROJECTS_FILE, initialProjects);
let activityFeed = initializeFile(FEED_FILE, initialFeed);

function saveData() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    fs.writeFileSync(FEED_FILE, JSON.stringify(activityFeed, null, 2));
}

module.exports = { users, projects, activityFeed, saveData };
