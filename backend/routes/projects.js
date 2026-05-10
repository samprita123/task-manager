const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
    try {
        let projects;
        if (req.userRole !== 'Admin') {
            projects = await Project.find({ 'assignedMembers.email': req.userEmail }).sort({ createdAt: -1 });
        } else {
            projects = await Project.find().sort({ createdAt: -1 });
        }
        return res.json(projects);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/activity', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(20);
        return res.json(activities);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/progress', async (req, res) => {
    try {
        const { progress } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ error: 'Project not found' });

        if (req.userRole === 'Admin') {
            return res.status(403).json({ error: 'Admins can only view progress, not edit it.' });
        }

        const isAssigned = project.assignedMembers?.some(m => m.email === req.userEmail);
        if (!isAssigned) {
            return res.status(403).json({ error: 'Only assigned members can update progress.' });
        }

        if (progress !== undefined) {
            const parsedProgress = Number(progress);
            project.progress = parsedProgress;

            if (parsedProgress === 0) {
                project.status = 'Pending';
            } else if (parsedProgress > 0 && parsedProgress < 100) {
                project.status = 'In Progress';
            } else if (parsedProgress >= 100) {
                project.status = 'Completed';
                project.completedAt = new Date();
            }
        }

        await project.save();
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const { title, description, dueDate, priority, progress = 0 } = req.body;

        if (!title || !description || !dueDate || !priority) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProject = new Project({
            title,
            description,
            status: progress === 0 ? 'Pending' : (progress < 100 ? 'In Progress' : 'Completed'),
            progress,
            dueDate,
            priority,
            assignedMembers: [],
            comments: [],
            actions: []
        });

        await newProject.save();
        return res.status(201).json(newProject);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/:id/assign', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const { memberEmail, role = 'Member' } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        if (!project.assignedMembers.some(m => m.email === memberEmail)) {
            project.assignedMembers.push({ email: memberEmail, role });

            const user = await User.findOne({ email: memberEmail });
            if (user) {
                if (!user.assignedProjects.includes(project._id.toString())) {
                    user.assignedProjects.push(project._id.toString());
                    await user.save();
                }
            }
        }
        await project.save();
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/:id/actions', async (req, res) => {
    try {
        const { phase, text, progress } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ error: 'Project not found' });

        const isAssigned = project.assignedMembers?.some(m => m.email === req.userEmail);
        if (!isAssigned) return res.status(403).json({ error: 'Only assigned members can add actions.' });

        const newAction = {
            user: req.userEmail,
            phase: phase || 'Development',
            text,
            progress: Number(progress),
            time: new Date()
        };

        project.actions.push(newAction);

        const newProgress = Number(progress);
        if (!isNaN(newProgress)) {
            project.progress = newProgress;
            if (newProgress >= 100) {
                project.status = 'Completed';
                project.completedAt = new Date();
            } else if (newProgress > 0) {
                project.status = 'In Progress';
            } else {
                project.status = 'Pending';
            }
        }

        await project.save();
        return res.status(201).json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/:id/comments', async (req, res) => {
    try {
        const { text } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ error: 'Project not found' });

        const isAssigned = project.assignedMembers?.some(m => m.email === req.userEmail);
        if (!isAssigned) return res.status(403).json({ error: 'Only assigned members can comment.' });

        project.comments.push({
            user: req.userEmail,
            text,
            time: new Date()
        });

        await project.save();
        return res.status(201).json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/cancel', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        project.status = 'Cancelled';
        await project.save();
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/stats/monthly', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const projects = await Project.find();
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const stats = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = new Date(now.getFullYear(), now.getMonth(), i).toDateString();
            
            const received = projects.filter(p => new Date(p.createdAt).toDateString() === dateStr).length;
            const completed = projects.filter(p => p.completedAt && new Date(p.completedAt).toDateString() === dateStr).length;
            const cancelled = projects.filter(p => p.status === 'Cancelled' && new Date(p.updatedAt).toDateString() === dateStr).length;
            const pending = projects.filter(p => p.status === 'Pending' && new Date(p.createdAt).toDateString() === dateStr).length;

            stats.push({ day: i, received, completed, pending, cancelled });
        }

        return res.json(stats);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/stats/performance', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const projects = await Project.find({ status: 'Completed' });
        const onTime = projects.filter(p => new Date(p.completedAt) <= new Date(p.dueDate)).length;
        const late = projects.length - onTime;

        return res.json({ onTime, late, total: projects.length });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/stats/summary', async (req, res) => {
    try {
        const projects = await Project.find();
        
        const summary = {
            Completed: projects.filter(p => p.status === 'Completed').length,
            'In Progress': projects.filter(p => p.status === 'In Progress').length,
            Pending: projects.filter(p => p.status === 'Pending').length,
            Cancelled: projects.filter(p => p.status === 'Cancelled').length,
            Overdue: projects.filter(p => p.status !== 'Completed' && new Date(p.dueDate) < new Date()).length
        };

        return res.json(summary);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/:id/unassign', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const { memberEmail } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        project.assignedMembers = project.assignedMembers.filter(m => m.email !== memberEmail);

        const user = await User.findOne({ email: memberEmail });
        if (user) {
            user.assignedProjects = user.assignedProjects.filter(pid => pid !== project._id.toString());
            await user.save();
        }

        await project.save();
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/due-date', async (req, res) => {
    try {
        if (req.userRole !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const { dueDate } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.id, { dueDate }, { new: true });

        if (!project) return res.status(404).json({ error: 'Project not found' });

        return res.json(project);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;