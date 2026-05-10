import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Edit, CheckCircle } from 'lucide-react';

export default function ProjectTable({ projects, role, setProjects }) {
  const statusColors = {
      'Completed': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Pending': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Overdue': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'In Progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };

  const calculateDaysLeft = (dueDate) => {
      const ms = new Date(dueDate) - new Date();
      return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm font-semibold border-b border-gray-800">
            <th className="px-6 py-4">Project Name</th>
            <th className="px-6 py-4">Assigned Member(s)</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Progress</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {projects.length === 0 ? (
            <tr>
               <td colSpan="7" className="text-center py-8 text-gray-500">No projects found.</td>
            </tr>
          ) : projects.map((project, idx) => (
            <motion.tr 
              key={project._id || project.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-surfaceHover/50 transition-colors group"
            >
              <td className="px-6 py-4">
                 <p className="text-white font-medium">{project.title}</p>
                 <p className="text-sm text-gray-400 truncate max-w-xs">{project.description}</p>
              </td>
              <td className="px-6 py-4">
                 <div className="flex -space-x-3">
                   {project.assignedMembers && project.assignedMembers.map((member, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-gray-700 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/50 transition" title={member.email}>
                         {member.email ? member.email.charAt(0).toUpperCase() : '?'}
                      </div>
                   ))}
                   {(!project.assignedMembers || project.assignedMembers.length === 0) && <span className="text-gray-500 text-sm">Unassigned</span>}
                 </div>
              </td>
              <td className="px-6 py-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${statusColors[project.status] || 'bg-gray-800 text-gray-300'}`}>
                    {project.status}
                 </span>
              </td>
              <td className="px-6 py-4">
                 <div className="flex items-center space-x-3">
                   <div className="w-full bg-gray-800 rounded-full h-2">
                     <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                   </div>
                   <span className="text-sm font-medium text-gray-300">{project.progress}%</span>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <p className="text-gray-300 text-sm">{new Date(project.dueDate).toLocaleDateString()}</p>
                 <p className="text-xs text-gray-500">{calculateDaysLeft(project.dueDate)} days left</p>
              </td>
              <td className="px-6 py-4">
                 <span className="text-sm text-gray-300 font-medium">{project.priority}</span>
              </td>
              <td className="px-6 py-4">
                 <button className="text-gray-400 hover:text-primary transition p-2 rounded-lg hover:bg-primary/10">
                    <Edit size={18} />
                 </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
