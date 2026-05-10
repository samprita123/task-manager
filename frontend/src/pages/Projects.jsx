import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Briefcase,
  BarChart3,
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  Plus
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import ProjectDetailsDrawer from '../components/ProjectDetailsDrawer';
import AddProjectModal from '../components/AddProjectModal';

export default function Projects({ role, email }) {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState('list');

  const [editingId, setEditingId] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();

    // Auto-refresh every 10 seconds for dynamic updates
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, [role, email]);

  const fetchProjects = async () => {

    try {

      const res = await fetch('https://task-manager-kmh2.onrender.com/api/projects', {
        headers: {
          'x-user-role': role,
          'x-user-email': email
        }
      });

      if (res.ok) {

        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setProjects(sorted);
        } else {
          setProjects([]);
        }
      }

    } catch (err) {

      console.error('Fetch projects error:', err);
      setProjects([]);

    } finally {

      setLoading(false);

    }
  };

  const filteredProjects = projects.filter(project => {

    const matchesSearch =
      project?.title
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase());

    return matchesSearch;

  });

  const handleProjectClick = (project) => {

    try {

      setSelectedProject(project);
      setIsDrawerOpen(true);

    } catch (err) {

      console.error('Project open error:', err);

    }
  };

  const handleProjectAdded = (newProject) => {

    setProjects(prev => [newProject, ...prev]);

  };

  const handleProgressUpdate = async (id, value) => {

    try {

      const res = await fetch(
        `https://task-manager-kmh2.onrender.com/api/projects/${id}/progress`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': email
          },

          body: JSON.stringify({
            progress: value
          })
        }
      );

      if (res.ok) {

        const updated = await res.json();

        setProjects(prev =>
          prev.map(p =>
            p.id === id ? updated : p
          )
        );

        setEditingId(null);
      }

    } catch (err) {

      console.error('Progress update error:', err);

    }
  };

  const completedCount =
    projects.filter(p => p.progress >= 100).length;

  const inProgressCount =
    projects.filter(
      p => p.progress > 0 && p.progress < 100
    ).length;

  const pendingCount =
    projects.filter(p => p.progress === 0).length;

  const cancelledCount =
    projects.filter(p => p?.status === 'Cancelled').length;

  const projectStatsData = [
    {
      name: 'Completed',
      value: completedCount,
      color: '#10B981'
    },

    {
      name: 'In Progress',
      value: inProgressCount,
      color: '#3B82F6'
    },

    {
      name: 'Pending',
      value: pendingCount,
      color: '#F59E0B'
    },

    {
      name: 'Cancelled',
      value: cancelledCount,
      color: '#EF4444'
    }

  ].filter(d => d.value > 0);

  if (loading) {

    return (
      <div className="p-8 text-center text-gray-400">
        Loading Projects...
      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Project Governance
          </h2>

          <p className="text-gray-400 mt-1">
            Monitor projects and team execution.
          </p>

        </div>

        <div className="flex items-center gap-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="bg-surface border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-64"
            />

          </div>

          {/* VIEW TOGGLE */}

          <div className="flex bg-surface border border-gray-800 p-1 rounded-xl">

            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-gray-500'
                }`}
            >
              <List size={18} />
            </button>

          </div>

          {/* ADD PROJECT */}

          {role === 'Admin' && (

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold"
            >
              <Plus size={18} />
              <span>Project</span>
            </button>

          )}

        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-surface p-6 rounded-3xl border border-gray-800 flex items-center justify-between">

          <div className="w-1/2">

            <h3 className="text-xl font-bold text-white mb-4">
              Project Distribution
            </h3>

            <div className="space-y-3">

              {projectStatsData.map(d => (

                <div
                  key={d.name}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-2">

                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: d.color
                      }}
                    />

                    <span className="text-gray-400 text-sm">
                      {d.name}
                    </span>

                  </div>

                  <span className="text-white font-bold text-sm">
                    {d.value}
                  </span>

                </div>

              ))}

            </div>

          </div>

          <div className="w-1/2 h-48">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={projectStatsData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={70}
                >

                  {projectStatsData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={entry.color}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>
        </div>

        {/* HEALTH */}

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 flex flex-col justify-center">

          <div className="flex items-center gap-3 mb-4">

            <div className="p-3 bg-primary rounded-2xl text-white">

              <BarChart3 size={24} />

            </div>

            <div>

              <h4 className="text-white font-bold">
                Execution Health
              </h4>

              <p className="text-primary text-xs">
                Project Efficiency
              </p>

            </div>
          </div>

          <div className="space-y-3">

            <span className="text-3xl font-bold text-white">

              {projects.length > 0
                ? Math.round(
                  (completedCount / projects.length) * 100
                )
                : 0}%

            </span>

            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">

              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${projects.length > 0
                    ? (completedCount / projects.length) * 100
                    : 0
                    }%`
                }}
              />

            </div>

          </div>

        </div>
      </div>

      {/* GRID */}

      {viewMode === 'grid' ? (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredProjects.map((project, idx) => (

            <motion.div
              key={project?.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleProjectClick(project)}
              className="group bg-surface rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all cursor-pointer"
            >

              <div className="flex justify-between items-start mb-4">

                <div className="p-3 bg-gray-900 rounded-xl text-primary">

                  <Briefcase size={22} />

                </div>

                <div className="text-xs text-white font-bold">

                  {project?.priority || 'Low'}

                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">

                {project?.title || 'Untitled'}

              </h3>

              <p className="text-gray-400 text-sm mb-6 line-clamp-2">

                {project?.description || 'No description'}

              </p>

              <div className="pt-4 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                    Quick Progress: {editingId === project.id ? tempProgress : project.progress || 0}%
                  </span>
                  {(editingId === project.id && tempProgress !== project.progress) && (
                    <button
                      onClick={() => handleProgressUpdate(project.id, tempProgress)}
                      className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase"
                    >
                      Save
                    </button>
                  )}
                </div>

                {(role === 'Admin' || project.assignedMembers?.some(m => m.email === email)) ? (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingId === project.id ? tempProgress : project.progress || 0}
                    onChange={(e) => {
                      setEditingId(project.id);
                      setTempProgress(Number(e.target.value));
                    }}
                    onMouseUp={() => handleProgressUpdate(project.id, tempProgress)}
                    onTouchEnd={() => handleProgressUpdate(project.id, tempProgress)}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary transition mt-1"
                  />
                ) : (
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>

            </motion.div>

          ))}

        </div>

      ) : (

        <div className="bg-surface rounded-3xl border border-gray-800 overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-900/30 text-xs text-gray-500 uppercase">

              <tr>

                <th className="px-6 py-4">
                  Project
                </th>

                <th className="px-6 py-4">
                  Priority
                </th>

                <th className="px-6 py-4">
                  Due Date
                </th>

                <th className="px-6 py-4">
                  Progress
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  View
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-800">

              {filteredProjects.map((project, idx) => (

                <tr
                  key={project?.id || idx}
                  className="hover:bg-gray-800/10"
                >

                  <td className="px-6 py-5">

                    <div
                      className="cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >

                      <p className="font-bold text-white">

                        {project?.title || 'Untitled'}

                      </p>

                      <p className="text-gray-500 text-sm">

                        {project?.description || 'No description'}

                      </p>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-white">

                    {project?.priority || 'Low'}

                  </td>

                  <td className="px-6 py-5 text-gray-400">

                    {project?.dueDate
                      ? new Date(project.dueDate).toLocaleDateString()
                      : 'N/A'}

                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[150px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {editingId === project.id ? tempProgress : project.progress || 0}%
                          </span>
                          {(editingId === project.id && tempProgress !== project.progress) && (
                            <button
                              onClick={() => handleProgressUpdate(project.id, tempProgress)}
                              className="text-[9px] text-primary hover:underline font-bold uppercase"
                            >
                              Save
                            </button>
                          )}
                        </div>
                        {(role === 'Admin' || project.assignedMembers?.some(m => m.email === email)) ? (
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingId === project.id ? tempProgress : project.progress || 0}
                            onChange={(e) => {
                              setEditingId(project.id);
                              setTempProgress(Number(e.target.value));
                            }}
                            onMouseUp={() => handleProgressUpdate(project.id, tempProgress)}
                            onTouchEnd={() => handleProgressUpdate(project.id, tempProgress)}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary transition"
                          />
                        ) : (
                          <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-1000"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-primary font-semibold">

                    {project?.status || 'Pending'}

                  </td>

                  <td className="px-6 py-5 text-right">

                    <button
                      onClick={() => handleProjectClick(project)}
                      className="p-2 hover:bg-gray-800 rounded-xl text-gray-500 hover:text-white transition"
                    >

                      <MoreVertical size={16} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* DRAWER */}

      {selectedProject && (

        <ProjectDetailsDrawer
          project={selectedProject}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          role={role}
          adminEmail={email}
          onUpdate={(updated) => {

            setProjects(prev =>
              prev.map(p =>
                p.id === updated.id ? updated : p
              )
            );

            setSelectedProject(updated);
          }}
        />

      )}

      {/* ADD PROJECT */}

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={handleProjectAdded}
        adminEmail={email}
      />

    </div>
  );
}