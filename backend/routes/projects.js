const express = require('express');

const router = express.Router();
const { projects, users, activityFeed, saveData } = require('../db');

// Get all projects
router.get('/', (req, res) => {
    // If not admin, only return assigned projects
    if (req.userRole !== 'Admin') {
        const userProjects = projects.filter(p => p.assignedMembers?.some(m => m.email === req.userEmail));
        return res.json(userProjects);
    }
    // Admin gets all
    return res.json(projects);
});

// Activity Feed
router.get('/activity', (req, res) => {
    return res.json(activityFeed);
});

// Update project progress/status (accessible by assigned members or admin)
router.patch('/:id/progress', (req, res) => {
    const { progress, status } = req.body;
    const project = projects.find(p => p.id === req.params.id);

    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (req.userRole !== 'Admin' && !project.assignedMembers.some(m => m.email === req.userEmail)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (progress !== undefined) project.progress = progress;
    if (status !== undefined) project.status = status;

    saveData();
    return res.json(project);
});

// Admin only: Create new project
router.post('/', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

    const { title, description, dueDate, priority, progress = 0 } = req.body;

    if (!title || !description || !dueDate || !priority) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProject = {
        id: String(Date.now()),
        title,
        description,
        status: 'Pending',
        progress,
        dueDate,
        priority,
        createdAt: new Date().toISOString(),
        assignedMembers: [] // Initially unassigned
    };

    projects.push(newProject);
    saveData();
    return res.status(201).json(newProject);
});

// Admin only: Assign member to project
router.post('/:id/assign', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

    const { memberEmail, role = 'Member' } = req.body;
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!project.assignedMembers.some(m => m.email === memberEmail)) {
        project.assignedMembers.push({ email: memberEmail, role });
    }
    saveData();
    return res.json(project);
});

// Member or Admin: Update project progress
router.patch('/:id/progress', (req, res) => {
    const { progress } = req.body;
    const project = projects.find(p => p.id === req.params.id);
    
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Check if user is assigned to this project or is Admin
    const isAssigned = project.assignedMembers.some(m => m.email === req.userEmail);

    if (!isAssigned && req.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Only assigned members or Admin can update progress.' });
    }

    const parsedProgress = Number(progress);
    project.progress = parsedProgress;
    
    if (parsedProgress === 0) {
        project.status = 'Pending';
    } else if (parsedProgress > 0 && parsedProgress < 100) {
        project.status = 'In Progress';
    } else if (parsedProgress >= 100) {
        project.status = 'Completed';
        project.completedAt = new Date().toISOString();
    }
    
    project.updatedAt = new Date().toISOString();
    saveData();
    
    return res.json(project);
});

// jo member h wohi krenge
router.post('/:id/actions', (req, res) => {
    const { phase, text, progress } = req.body;

    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const isAssigned = project.assignedMembers?.some(
        m => m.email === req.userEmail
    );

    if (!isAssigned) {
        return res.status(403).json({
            error: 'Only assigned members can add actions.'
        });
    }

    if (!project.actions) {
        project.actions = [];
    }

    const newAction = {
        user: req.userEmail,
        phase: phase || 'Development',
        text,
        progress: Number(progress),
        time: new Date().toISOString()
    };

    project.actions.push(newAction);
    // AUTO UPDATE PROGRESS + STATUS
    project.progress = progress;

    if (progress === 0) {
        project.status = 'Pending';
    }
    else if (progress > 0 && progress < 100) {
        project.status = 'In Progress';
    }
    else if (progress >= 100) {
        project.status = 'Completed';
    }

    project.progress = Number(progress);

    if (project.progress >= 100) {
        project.status = 'Completed';
        project.completedAt = new Date().toISOString();
    } else if (project.progress > 0) {
        project.status = 'In Progress';
    }

    saveData();

    return res.status(201).json(project);
});

// Only assigned members can add comments
router.post('/:id/comments', (req, res) => {
    const { text } = req.body;

    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const isAssigned = project.assignedMembers?.some(
        m => m.email === req.userEmail
    );

    if (!isAssigned) {
        return res.status(403).json({
            error: 'Only assigned members can comment.'
        });
    }

    if (!project.comments) {
        project.comments = [];
    }

    project.comments.push({
        user: req.userEmail,
        text,
        time: new Date().toISOString()
    });

    saveData();

    return res.status(201).json(project);
});
// Admin only: Cancel project
router.patch('/:id/cancel', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.status = 'Cancelled';
    project.updatedAt = new Date().toISOString();
    saveData();
    return res.json(project);
});

// Admin only: Monthly stats for line graph
router.get('/stats/monthly', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const stats = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = new Date(now.getFullYear(), now.getMonth(), i).toISOString().split('T')[0];

        const received = projects.filter(p => p.createdAt?.startsWith(dateStr)).length;
        const completed = projects.filter(p => p.completedAt?.startsWith(dateStr)).length;
        const cancelled = projects.filter(p => p.status === 'Cancelled' && (p.updatedAt?.startsWith(dateStr) || p.createdAt?.startsWith(dateStr))).length;
        const pending = projects.filter(p => p.status === 'Pending' && p.createdAt?.startsWith(dateStr)).length;

        stats.push({
            day: i,
            received,
            completed,
            pending,
            cancelled
        });
    }

    return res.json(stats);
});

// Admin only: Due Performance (On-time vs Late)
router.get('/stats/performance', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

    const totalCompleted = projects.filter(p => p.status === 'Completed').length;
    const onTime = projects.filter(p => p.status === 'Completed' && new Date(p.completedAt) <= new Date(p.dueDate)).length;
    const late = totalCompleted - onTime;

    return res.json({ onTime, late, total: totalCompleted });
});

// Analytics: Current Status Summary
router.get('/stats/summary', (req, res) => {
    const summary = {
        Completed: projects.filter(p => p.status === 'Completed').length,
        'In Progress': projects.filter(p => p.status === 'In Progress').length,
        Pending: projects.filter(p => p.status === 'Pending').length,
        Cancelled: projects.filter(p => p.status === 'Cancelled').length,
        Overdue: projects.filter(p => p.status === 'Overdue' || (p.status !== 'Completed' && new Date(p.dueDate) < new Date())).length
    };
    return res.json(summary);
});

// Admin only: Unassign member from project
router.delete('/:id/unassign', (req, res) => {
    if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

    const { memberEmail } = req.body;
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.assignedMembers = project.assignedMembers.filter(m => m.email !== memberEmail);

    saveData();
    return res.json(project);
});
// Admin only: Update due date
router.patch('/:id/due-date', (req, res) => {
    if (req.userRole !== 'Admin') {
        return res.status(403).json({ error: 'Admin only' });
    }

    const { dueDate } = req.body;

    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    project.dueDate = dueDate;
    project.updatedAt = new Date().toISOString();

    saveData();

    return res.json(project);
});
module.exports = router;