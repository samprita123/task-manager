const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects
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

// Update project progress
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

// Admin only: Create new project
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
            status: 'Pending',
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

// Admin only: Assign member to project
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

// Add Action
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

// Add Comment
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

// Admin only: Cancel project
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

// Admin only: Stats routes (simplified for MongoDB)
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const summary = {
            Completed: 0,
            'In Progress': 0,
            Pending: 0,
            Cancelled: 0,
            Overdue: await Project.countDocuments({ 
                status: { $ne: 'Completed' }, 
                dueDate: { $lt: new Date() } 
            })
        };

        stats.forEach(s => {
            if (summary.hasOwnProperty(s._id)) {
                summary[s._id] = s.count;
            }
        });

        return res.json(summary);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Admin only: Unassign member
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

// Admin only: Update due date
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