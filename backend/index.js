const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const projectsRouter = require('./routes/projects');
const membersRouter = require('./routes/members');
const authRouter = require('./routes/auth');

const app = express();

connectDB().then(async () => {
    try {
        const Project = require('./models/Project');
        const projects = await Project.find().sort({ createdAt: -1 });
        const seen = new Set();
        for (const p of projects) {
            if (seen.has(p.title)) {
                await Project.findByIdAndDelete(p._id);
            } else {
                seen.add(p.title);
            }
        }
    } catch (err) {
        console.error('Initial data check failed:', err.message);
    }
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-email']
}));
app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api', (req, res, next) => {
    const role = req.headers['x-user-role'];
    const email = req.headers['x-user-email'];
    if (!role || !email) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }
    req.userRole = role;
    req.userEmail = email;
    next();
});

app.use('/api/projects', projectsRouter);
app.use('/api/members', membersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
