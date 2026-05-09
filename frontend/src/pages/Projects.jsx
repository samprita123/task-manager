// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Briefcase, BarChart3, PieChart as PieIcon, MoreVertical, Calendar, User, Search, LayoutGrid, List, Plus } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
// import ProjectDetailsDrawer from '../components/ProjectDetailsDrawer';
// import AddProjectModal from '../components/AddProjectModal';

// export default function Projects({ role, email }) {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
//   const [editingId, setEditingId] = useState(null);
//   const [tempProgress, setTempProgress] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/projects', {
//           headers: { 'x-user-role': role, 'x-user-email': email }
//         });
//         if (res.ok) setProjects(await res.json());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, [role, email]);

//   const filteredProjects = projects.filter(p => {
//     const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
//     const isVisible = role === 'Admin' || p.assignedMembers?.some(m => m.email === email);
//     return matchesSearch && isVisible;
//   });

//   const handleProjectClick = (project) => {
//     setSelectedProject(project);
//     setIsDrawerOpen(true);
//   };

//   const handleProjectAdded = (newProject) => {
//     setProjects([newProject, ...projects]);
//   };

//   const handleProgressUpdate = async (id, val) => {
//      try {
//        const res = await fetch(`http://localhost:5000/api/projects/${id}/progress`, {
//          method: 'PATCH',
//          headers: { 
//             'Content-Type': 'application/json',
//             'x-user-role': role,
//             'x-user-email': email
//          },
//          body: JSON.stringify({ progress: val })
//        });
//        if (res.ok) {
//          const updated = await res.json();
//          setProjects(projects.map(p => p.id === id ? updated : p));
//          setEditingId(null);
//        }
//      } catch (err) {
//        console.error(err);
//      }
//   };

//   const completedCount = projects.filter(p => p.status === 'Completed').length;
//   const inProgressCount = projects.filter(p => p.status === 'In Progress').length;
//   const pendingCount = projects.filter(p => p.status === 'Pending').length;
//   const cancelledCount = projects.filter(p => p.status === 'Cancelled').length;

//   const projectStatsData = [
//     { name: 'Completed', value: completedCount, color: '#10B981' },
//     { name: 'In Progress', value: inProgressCount, color: '#3B82F6' },
//     { name: 'Pending', value: pendingCount, color: '#F59E0B' },
//     { name: 'Cancelled', value: cancelledCount, color: '#EF4444' }
//   ].filter(d => d.value > 0);

//   if (loading) return <div className="p-8 text-center text-gray-400">Loading Projects...</div>;

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold text-white tracking-tighter">Project Governance</h2>
//           <p className="text-gray-400 mt-1">High-fidelity project management and status auditing.</p>
//         </div>
//         <div className="flex items-center space-x-3">
//           {/* Stats Summary Bubble */}
//           <div className="hidden xl:flex items-center space-x-6 bg-surface p-3 px-6 rounded-2xl border border-gray-800 mr-4">
//              <div className="text-center">
//                 <p className="text-[10px] text-gray-500 font-black uppercase">Total</p>
//                 <p className="text-lg font-bold text-white leading-none">{projects.length}</p>
//              </div>
//              <div className="w-px h-8 bg-gray-800" />
//              <div className="text-center">
//                 <p className="text-[10px] text-green-500 font-black uppercase">Done</p>
//                 <p className="text-lg font-bold text-white leading-none">{completedCount}</p>
//              </div>
//              <div className="w-px h-8 bg-gray-800" />
//              <div className="text-center">
//                 <p className="text-[10px] text-orange-500 font-black uppercase">Live</p>
//                 <p className="text-lg font-bold text-white leading-none">{inProgressCount + pendingCount}</p>
//              </div>
//           </div>
//           <div className="relative">
//              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//              <input
//               type="text"
//               placeholder="Search registry..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-surface border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-64 transition"
//              />
//           </div>
//           <div className="flex bg-surface border border-gray-800 p-1 rounded-xl">
//              <button 
//                 onClick={() => setViewMode('grid')}
//                 className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}
//              >
//                 <LayoutGrid size={18} />
//              </button>
//              <button 
//                 onClick={() => setViewMode('list')}
//                 className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}
//              >
//                 <List size={18} />
//              </button>
//           </div>
//           {role === 'Admin' && (
//             <button 
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center space-x-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 transition"
//             >
//               <Plus size={18} />
//               <span>Project</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Project Completion focus chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//          <div className="lg:col-span-2 bg-surface p-6 rounded-3xl border border-gray-800 flex items-center justify-between">
//             <div className="w-1/2">
//                <h3 className="text-xl font-bold text-white mb-2">Completion Distribution</h3>
//                <p className="text-gray-500 text-sm mb-4">A visualization of the project lifecycle states across the entire registry.</p>
//                <div className="space-y-3">
//                   {projectStatsData.map(d => (
//                      <div key={d.name} className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
//                            <span className="text-xs text-gray-400">{d.name}</span>
//                         </div>
//                         <span className="text-xs font-bold text-white">{d.value} Projects</span>
//                      </div>
//                   ))}
//                </div>
//             </div>
//             <div className="w-1/2 h-48">
//                <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                      <Pie
//                         data={projectStatsData}
//                         innerRadius={50}
//                         outerRadius={70}
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                      >
//                         {projectStatsData.map((entry, index) => (
//                            <Cell key={index} fill={entry.color} />
//                         ))}
//                      </Pie>
//                      <Tooltip 
//                         contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
//                         itemStyle={{ color: '#fff', fontSize: '12px' }}
//                      />
//                   </PieChart>
//                </ResponsiveContainer>
//             </div>
//          </div>

//          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 flex flex-col justify-center">
//             <div className="flex items-center space-x-3 mb-4">
//                <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
//                   <BarChart3 size={24} />
//                </div>
//                <div>
//                   <h4 className="text-white font-bold">Execution Health</h4>
//                   <p className="text-primary text-xs">Registry Efficiency</p>
//                </div>
//             </div>
//             <div className="space-y-4">
//                <div className="flex justify-between items-end">
//                   <span className="text-2xl font-bold text-white">
//                      {projects.length > 0 ? Math.round((completedCount / projects.length) * 100) : 0}%
//                   </span>
//                   <span className="text-xs text-gray-500 font-black uppercase mb-1">Audit Success Rate</span>
//                </div>
//                <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
//                   <div 
//                     className="bg-primary h-full rounded-full transition-all duration-1000" 
//                     style={{ width: `${projects.length > 0 ? (completedCount / projects.length) * 100 : 0}%` }} 
//                   />
//                </div>
//             </div>
//          </div>
//       </div>

//       {viewMode === 'grid' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredProjects.map((project, idx) => (
//             <motion.div
//               key={project.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.05 }}
//               onClick={() => handleProjectClick(project)}
//               className="group bg-surface rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all cursor-pointer relative"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div className="p-3 bg-gray-900 rounded-xl text-primary">
//                   <Briefcase size={22} />
//                 </div>
//                 <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
//                   project.priority === 'High' ? 'bg-red-400/10 text-red-400' : 'bg-blue-400/10 text-blue-400'
//                 }`}>
//                   {project.priority}
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
//               <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>
//               <div className="pt-4 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-xs font-bold text-gray-500">QUICK UPDATE: {editingId === project.id ? tempProgress : project.progress}%</span>
//                   {(editingId === project.id && tempProgress !== project.progress) && (
//                      <button onClick={() => handleProgressUpdate(project.id, tempProgress)} className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-lg shadow-primary/20">Save</button>
//                   )}
//                 </div>
//                 <input 
//                    type="range" 
//                    min="0" max="100" 
//                    value={editingId === project.id ? tempProgress : project.progress} 
//                    onChange={(e) => {
//                       setEditingId(project.id);
//                       setTempProgress(Number(e.target.value));
//                    }}
//                    onMouseUp={() => handleProgressUpdate(project.id, tempProgress)}
//                    onTouchEnd={() => handleProgressUpdate(project.id, tempProgress)}
//                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary transition mt-1" 
//                 />
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-surface rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
//            <table className="w-full text-left">
//               <thead className="bg-gray-900/30 text-[10px] font-black text-gray-500 uppercase tracking-widest">
//                  <tr>
//                     <th className="px-6 py-5">Project Information</th>
//                     <th className="px-6 py-5">Priority</th>
//                     <th className="px-6 py-5">Due Date</th>
//                     <th className="px-6 py-5 w-64">Completion Progress</th>
//                     <th className="px-6 py-5">Status</th>
//                     <th className="px-6 py-5 text-right">Actions</th>
//                  </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800 text-xs">
//                  {filteredProjects.map(p => (
//                     <tr key={p.id} className="hover:bg-gray-800/10 group">
//                        <td className="px-6 py-5">
//                           <div className="cursor-pointer" onClick={() => handleProjectClick(p)}>
//                              <p className="font-bold text-white group-hover:text-primary transition">{p.title}</p>
//                              <p className="text-gray-500 mt-0.5 max-w-xs truncate">{p.description}</p>
//                           </div>
//                        </td>
//                        <td className="px-6 py-5">
//                           <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
//                              p.priority === 'High' ? 'bg-red-400/10 text-red-400' : 
//                              p.priority === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'
//                           }`}>{p.priority}</span>
//                        </td>
//                        <td className="px-6 py-5 text-gray-400 font-mono">
//                           {new Date(p.dueDate).toLocaleDateString()}
//                        </td>
//                        <td className="px-6 py-5">
//                           <div className="w-full relative group">
//                              <div className="flex justify-between items-center mb-1.5">
//                                 <span className="font-black text-white">{editingId === p.id ? tempProgress : p.progress}%</span>
//                                 {(editingId === p.id && tempProgress !== p.progress) && (
//                                    <button onClick={() => handleProgressUpdate(p.id, tempProgress)} className="text-green-500 hover:text-green-400 text-[10px] uppercase font-bold">Save</button>
//                                 )}
//                              </div>
//                              <input 
//                                 type="range" 
//                                 min="0" max="100" 
//                                 value={editingId === p.id ? tempProgress : p.progress} 
//                                 onChange={(e) => {
//                                    setEditingId(p.id);
//                                    setTempProgress(Number(e.target.value));
//                                 }}
//                                 onMouseUp={() => handleProgressUpdate(p.id, tempProgress)}
//                                 onTouchEnd={() => handleProgressUpdate(p.id, tempProgress)}
//                                 className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary opacity-50 group-hover:opacity-100 transition" 
//                              />
//                           </div>
//                        </td>
//                        <td className="px-6 py-5">
//                           <span className={`text-[10px] font-black uppercase tracking-tighter ${
//                              p.status === 'Completed' ? 'text-green-500' : 'text-orange-500'
//                           }`}>{p.status}</span>
//                        </td>
//                        <td className="px-6 py-5 text-right">
//                           <button 
//                              onClick={() => handleProjectClick(p)}
//                              className="p-2 hover:bg-gray-800 rounded-xl text-gray-500 hover:text-white transition"
//                           >
//                              <MoreVertical size={16} />
//                           </button>
//                        </td>
//                     </tr>
//                  ))}
//                  {filteredProjects.length === 0 && (
//                     <tr>
//                        <td colSpan="6" className="px-6 py-10 text-center text-gray-600 italic">No project matches your search.</td>
//                     </tr>
//                  )}
//               </tbody>
//            </table>
//         </div>
//       )}

//       <ProjectDetailsDrawer 
//         project={selectedProject} 
//         isOpen={isDrawerOpen} 
//         onClose={() => setIsDrawerOpen(false)} 
//         role={role}
//         adminEmail={email}
//         onUpdate={(updated) => {
//           setProjects(projects.map(p => p.id === updated.id ? updated : p));
//           setSelectedProject(updated);
//         }}
//       />
//       <AddProjectModal 
//         isOpen={isAddModalOpen} 
//         onClose={() => setIsAddModalOpen(false)} 
//         onProjectAdded={handleProjectAdded} 
//         adminEmail={email}
//       />
//     </div>
//   );
// }
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
  }, [role, email]);

  const fetchProjects = async () => {

    try {

      const res = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'x-user-role': role,
          'x-user-email': email
        }
      });

      if (res.ok) {

        const data = await res.json();

        if (Array.isArray(data)) {
          setProjects(data);
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
        `http://localhost:5000/api/projects/${id}/progress`,
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
    projects.filter(p => p?.status === 'Completed').length;

  const inProgressCount =
    projects.filter(p => p?.status === 'In Progress').length;

  const pendingCount =
    projects.filter(p => p?.status === 'Pending').length;

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

              <div className="pt-4 border-t border-gray-800">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-400">
                    Progress
                  </span>

                  <span className="text-white font-bold">
                    {project?.progress || 0}%
                  </span>

                </div>

                <div className="w-full bg-gray-800 rounded-full h-2 mt-3">

                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${project?.progress || 0}%`
                    }}
                  />

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      ) : (

        <div className="bg-surface rounded-3xl border border-gray-800 overflow-hidden">

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

                      <div className="w-32 bg-gray-800 rounded-full h-2">

                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${project?.progress || 0}%`
                          }}
                        />

                      </div>

                      <span className="text-white text-sm font-bold">

                        {project?.progress || 0}%

                      </span>

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