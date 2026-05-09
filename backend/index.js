const express = require('express');
const cors = require('cors');

const projectsRouter = require('./routes/projects');
const membersRouter = require('./routes/members');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-email']
}));
app.use(express.json());

app.use('/api/auth', authRouter);

// Mock Role-Based Access Control Middleware for protected routes
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
