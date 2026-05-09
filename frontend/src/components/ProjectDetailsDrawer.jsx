// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Calendar, Clock, Users, Briefcase, BarChart3, Plus, UserPlus } from 'lucide-react';

// export default function ProjectDetailsDrawer({ project, isOpen, onClose, role, adminEmail, onUpdate }) {
//   const [allMembers, setAllMembers] = useState([]);
//   const [selectedMember, setSelectedMember] = useState('');
//   const [selectedMemberRole, setSelectedMemberRole] = useState('Member');
//   const [isAssigning, setIsAssigning] = useState(false);
//   const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [isCommenting, setIsCommenting] = useState(false);
//   const [error, setError] = useState('');

//   // Action Log Form States
//   const [actionPhase, setActionPhase] = useState('Development');
//   const [actionText, setActionText] = useState('');
//   const [actionProgress, setActionProgress] = useState(project?.progress || 0);
//   const [isLoggingAction, setIsLoggingAction] = useState(false);
//   const [newDueDate, setNewDueDate] = useState('');
//   const [isSavingDate, setIsSavingDate] = useState(false);

//   useEffect(() => {
//     if (project) {
//       setNewDueDate(project.dueDate || '');
//     }
//   }, [project]);  
//   // Phases for SDLC
//   const SDLC_PHASES = ['Requirement', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];

//   useEffect(() => {
//     if (project) {
//       setActionProgress(project.progress);
//     }
//   }, [project?.id]);


//   // Use adminEmail as the "currentUserEmail"
//   const isUserAssigned = project?.assignedMembers?.some(
//     m => m.email === adminEmail
//   );
//   const canUpdateProgress = role === 'Member' && isUserAssigned;

//   useEffect(() => {
//     if (isOpen && role === 'Admin') {
//       const fetchMembers = async () => {
//         try {
//           const res = await fetch('http://localhost:5000/api/members', {
//             headers: { 'x-user-role': role, 'x-user-email': adminEmail }
//           });
//           if (res.ok) setAllMembers(await res.json());
//         } catch (err) {
//           console.error('Failed to fetch members:', err);
//         }
//       };
//       fetchMembers();
//     }
//   }, [isOpen, role, adminEmail]);
//   if (!project) return null;
//   const handleAssign = async () => {
//     if (!selectedMember) return;
//     setIsAssigning(true);
//     setError('');

//     try {
//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/assign`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({ memberEmail: selectedMember, role: selectedMemberRole })
//       });

//       if (res.ok) {
//         const updatedProject = await res.json();
//         onUpdate(updatedProject);
//         setSelectedMember('');
//       } else {
//         const data = await res.json();
//         setError(data.error || 'Failed to assign member');
//       }
//     } catch (err) {
//       setError('Connection error');
//     } finally {
//       setIsAssigning(false);
//     }
//   };
//   const handleDueDateUpdate = async () => {
//     try {
//       setIsSavingDate(true);

//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/due-date`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({
//           dueDate: newDueDate
//         })
//       });

//       if (res.ok) {
//         const updated = await res.json();
//         onUpdate(updated);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsSavingDate(false);
//     }
//   };
//   const handleUnassign = async (memberEmail) => {
//     if (!window.confirm(`Are you sure you want to remove ${memberEmail} from this project?`)) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/unassign`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({ memberEmail })
//       });

//       if (res.ok) {
//         onUpdate(await res.json());
//       }
//     } catch (err) {
//       console.error('Failed to unassign:', err);
//     }
//   };

//   const handleLogAction = async () => {
//     if (!actionText.trim()) return;
//     setIsLoggingAction(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/actions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({
//           phase: actionPhase,
//           text: actionText,
//           progress: actionProgress
//         })
//       });
//       if (res.ok) {
//         onUpdate(await res.json());
//         setActionText('');
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoggingAction(false);
//     }
//   };

//   const handleProgressUpdate = async (val) => {
//     setIsUpdatingProgress(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/progress`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({ progress: val })
//       });
//       if (res.ok) {
//         onUpdate(await res.json());
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsUpdatingProgress(false);
//     }
//   };

//   const handlePostComment = async () => {
//     if (!newComment.trim()) return;
//     setIsCommenting(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/projects/${project.id}/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-user-role': role,
//           'x-user-email': adminEmail
//         },
//         body: JSON.stringify({ text: newComment })
//       });
//       if (res.ok) {
//         onUpdate(await res.json());
//         setNewComment('');
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsCommenting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
//           />

//           {/* Drawer */}
//           <motion.div
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//             className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface z-[70] shadow-2xl border-l border-gray-800 overflow-y-auto"
//           >
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-8">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
//                     <Briefcase size={22} />
//                   </div>
//                   <h2 className="text-2xl font-bold text-white">Project Details</h2>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="space-y-8">
//                 {/* Summary Section */}
//                 <section>
//                   <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Summary</h3>
//                   <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
//                     <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
//                     <p className="text-gray-400 leading-relaxed shadow-sm">{project.description}</p>
//                   </div>
//                 </section>

//                 {/* Log New Action Section (NEW) */}
//                 {canUpdateProgress && (
//                   <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
//                     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
//                       <Plus size={18} className="mr-2 text-primary" /> Log New Action
//                     </h3>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Phase</label>
//                           <select
//                             value={actionPhase}
//                             onChange={(e) => setActionPhase(e.target.value)}
//                             className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none"
//                           >
//                             {SDLC_PHASES.map(phase => <option key={phase} value={phase}>{phase}</option>)}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Update Progress: {actionProgress}%</label>
//                           <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={actionProgress}
//                             onChange={(e) => setActionProgress(Number(e.target.value))}
//                             className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Action Description</label>
//                         <textarea
//                           placeholder="Describe what you did..."
//                           value={actionText}
//                           onChange={(e) => setActionText(e.target.value)}
//                           rows="2"
//                           className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white focus:border-primary outline-none resize-none"
//                         />
//                       </div>
//                       <button
//                         onClick={handleLogAction}
//                         disabled={isLoggingAction || !actionText.trim()}
//                         className="w-full py-2.5 bg-primary hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-primary/20"
//                       >
//                         {isLoggingAction ? 'Logging...' : 'Submit Action Update'}
//                       </button>
//                     </div>
//                   </section>
//                 )}

//                 {/* Activity Timeline (NEW) */}
//                 <section>
//                   <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Project History (SDLC)</h3>
//                   <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-800">
//                     {project.actions?.slice().reverse().map((action, i) => (
//                       <div key={i} className="relative pl-10 flex flex-col group">
//                         <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-900 border-2 border-primary flex items-center justify-center z-10 group-hover:scale-110 transition">
//                           <div className="w-2 h-2 rounded-full bg-primary" />
//                         </div>
//                         <div className="flex justify-between items-start mb-1">
//                           <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{action.phase}</span>
//                           <span className="text-[9px] text-gray-500 font-medium">{new Date(action.time).toLocaleDateString()}</span>
//                         </div>
//                         <p className="text-xs text-white font-medium mb-1 line-clamp-2">{action.text}</p>
//                         <div className="flex items-center space-x-2 text-[10px] text-gray-500">
//                           <span className="font-bold text-gray-400">{action.user?.split('@')[0] || 'Unknown'}</span>
//                           <span>•</span>
//                           <span>Reached {action.progress}%</span>
//                         </div>
//                       </div>
//                     ))}
//                     {(!project.actions || project.actions.length === 0) && (
//                       <div className="text-center py-4 bg-gray-900/20 rounded-xl border border-dashed border-gray-800">
//                         <p className="text-xs text-gray-600 italic">No activity logged yet.</p>
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 {/* Progress bar (Simplified visual-only for non-editors) */}
//                 {!canUpdateProgress && (
//                   <section>
//                     <div className="flex justify-between items-center mb-3">
//                       <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overall Progress</h3>
//                       <span className="text-primary font-bold">{project.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-800 rounded-full h-3">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${project.progress}%` }}
//                         transition={{ duration: 1, ease: 'easeOut' }}
//                         className="bg-primary h-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
//                       />
//                     </div>
//                   </section>
//                 )}
//                 {/* Admin Project Control */}
//                 {role === 'Admin' && (
//                   <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
//                     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
//                       Admin Project Control
//                     </h3>

//                     <div className="space-y-5">

//                       {/* Due Date Edit */}
//                       <div>
//                         <label className="block text-xs text-gray-400 mb-2">
//                           Edit Due Date
//                         </label>

//                         <div className="flex items-center gap-3">
//                           <input
//                             type="date"
//                             value={newDueDate?.split('T')[0]}
//                             onChange={(e) => setNewDueDate(e.target.value)}
//                             className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:border-primary outline-none"
//                           />

//                           <button
//                             onClick={handleDueDateUpdate}
//                             disabled={isSavingDate}
//                             className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition"
//                           >
//                             {isSavingDate ? 'Saving...' : 'Update'}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Project Tracking */}
//                       <div>
//                         <div className="flex justify-between mb-2">
//                           <span className="text-gray-400 text-xs uppercase">
//                             Current Progress
//                           </span>

//                           <span className="text-primary font-bold">
//                             {project.progress}%
//                           </span>
//                         </div>

//                         <div className="w-full bg-gray-800 rounded-full h-3">
//                           <div
//                             className="bg-primary h-3 rounded-full transition-all duration-500"
//                             style={{ width: `${project.progress}%` }}
//                           />
//                         </div>
//                       </div>

//                       {/* Project Status */}
//                       <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-4 border border-gray-800">
//                         <div>
//                           <p className="text-gray-400 text-xs uppercase mb-1">
//                             Current Status
//                           </p>

//                           <p className="text-white font-bold">
//                             {project.status}
//                           </p>
//                         </div>

//                         <div className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'Completed'
//                           ? 'bg-green-500/10 text-green-400'
//                           : project.status === 'Pending'
//                             ? 'bg-yellow-500/10 text-yellow-400'
//                             : 'bg-blue-500/10 text-blue-400'
//                           }`}>
//                           Active
//                         </div>
//                       </div>
//                     </div>
//                   </section>
//                 )}
//                 {/* Grid items */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <div className="flex items-center text-gray-400 mb-2">
//                       <Calendar size={16} className="mr-2" />
//                       <span className="text-xs font-medium uppercase text-gray-500">Due Date</span>
//                     </div>
//                     <p className="text-white font-semibold">{new Date(project.dueDate).toLocaleDateString()}</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <div className="flex items-center text-gray-400 mb-2">
//                       <BarChart3 size={16} className="mr-2" />
//                       <span className="text-xs font-medium uppercase text-gray-500">Priority</span>
//                     </div>
//                     <p className={`font-semibold ${project.priority === 'High' ? 'text-red-400' :
//                       project.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
//                       }`}>{project.priority}</p>
//                   </div>
//                 </div>

//                 {/* Comments & Requirements Section (NEW) */}
//                 <section>
//                   <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Comments & Requirements</h3>
//                   <div className="bg-gray-900/10 p-5 rounded-2xl border border-gray-800 space-y-4">
//                     <div className="max-h-48 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
//                       {project.comments?.map((c, i) => (
//                         <div key={i} className="flex space-x-3 group">
//                           <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-700">
//                             {c.user?.charAt(0).toUpperCase() || 'U'}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-center mb-1">
//                               <span className="text-[11px] font-bold text-primary">{c.user}</span>
//                               <span className="text-[10px] text-gray-500">{new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                             </div>
//                             <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/40 p-2 rounded-lg rounded-tl-none border border-gray-800/50">{c.text}</p>
//                           </div>
//                         </div>
//                       ))}
//                       {(!project.comments || project.comments.length === 0) && (
//                         <p className="text-xs text-gray-600 italic text-center py-4">No comments yet. Start the conversation.</p>
//                       )}
//                     </div>

//                     <div className="flex items-center space-x-2 pt-2 border-t border-gray-800">
//                       <input
//                         type="text"
//                         placeholder="Add a comment or requirement..."
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
//                       />
//                       <button
//                         onClick={handlePostComment}
//                         disabled={isCommenting || !newComment.trim()}
//                         className="p-2 bg-primary hover:bg-blue-600 text-white rounded-xl transition disabled:opacity-50"
//                       >
//                         <Plus size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Assignment Section (Admin Only) */}
//                 {role === 'Admin' && (
//                   <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
//                     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
//                       <UserPlus size={16} className="mr-2 text-primary" /> Assign New Member
//                     </h3>
//                     <div className="space-y-4">
//                       {error && <p className="text-red-400 text-xs">{error}</p>}
//                       <div className="grid grid-cols-1 gap-3">
//                         <select
//                           value={selectedMember}
//                           onChange={(e) => setSelectedMember(e.target.value)}
//                           className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
//                         >
//                           <option value="">Select a team member...</option>
//                           {allMembers
//                             .filter(m => !project.assignedMembers.some(am => am.email === m.email))
//                             .map(m => (
//                               <option key={m.email} value={m.email}>{m.name} ({m.email})</option>
//                             ))
//                           }
//                         </select>
//                         <input
//                           type="text"
//                           placeholder="Role (e.g. Lead Dev)"
//                           value={selectedMemberRole}
//                           onChange={(e) => setSelectedMemberRole(e.target.value)}
//                           className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
//                         />
//                       </div>
//                       <button
//                         onClick={handleAssign}
//                         disabled={isAssigning || !selectedMember}
//                         className="w-full py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
//                       >
//                         {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
//                       </button>
//                     </div>
//                   </section>
//                 )}

//                 {/* Members & Roles */}
//                 <section>
//                   <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
//                     <span>Project Team</span>
//                     <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{project.assignedMembers?.length || 0} Members</span>
//                   </h3>
//                   <div className="space-y-3">
//                     {project.assignedMembers && project.assignedMembers.map((member, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-800 hover:border-gray-700 transition duration-300 group">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
//                             {member.email ? member.email.charAt(0).toUpperCase() : '?'}
//                           </div>
//                           <div>
//                             <p className="text-white font-medium text-sm">{member.email}</p>
//                             <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">{member.role}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="px-2 py-1 bg-green-400/10 text-green-400 text-[9px] font-black rounded uppercase tracking-tighter">Active</div>
//                           {role === 'Admin' && (
//                             <button
//                               onClick={() => handleUnassign(member.email)}
//                               className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
//                               title="Remove Member"
//                             >
//                               <X size={14} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     {(!project.assignedMembers || project.assignedMembers.length === 0) && (
//                       <p className="text-gray-500 italic text-center py-4 bg-gray-900/10 rounded-xl border border-dashed border-gray-800">No members assigned yet.</p>
//                     )}
//                   </div>
//                 </section>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  BarChart3,
  Plus,
  UserPlus,
  Briefcase
} from 'lucide-react';

export default function ProjectDetailsDrawer({
  project,
  isOpen,
  onClose,
  role,
  adminEmail,
  onUpdate
}) {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMemberRole, setSelectedMemberRole] = useState('Member');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [tempAdminProgress, setTempAdminProgress] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState('');

  // Action states
  const [actionPhase, setActionPhase] = useState('Development');
  const [actionText, setActionText] = useState('');
  const [actionProgress, setActionProgress] = useState(0);
  const [isLoggingAction, setIsLoggingAction] = useState(false);

  // Due date
  const [newDueDate, setNewDueDate] = useState('');
  const [isSavingDate, setIsSavingDate] = useState(false);

  const SDLC_PHASES = [
    'Requirement',
    'Design',
    'Development',
    'Testing',
    'Deployment',
    'Maintenance'
  ];

  // SAFE RETURN
  if (!project) return null;

  // SAFE DEFAULTS
  const assignedMembers = project?.assignedMembers || [];
  const comments = project?.comments || [];
  const actions = project?.actions || [];

  const isUserAssigned = assignedMembers.some(
    (m) => m.email === adminEmail
  );

  const canUpdateProgress =
    role === 'Member' && isUserAssigned;

  useEffect(() => {
    if (project) {
      setActionProgress(project.progress || 0);
      setTempAdminProgress(project.progress || 0);
      setNewDueDate(project.dueDate || '');
    }
  }, [project]);

  // Fetch members
  useEffect(() => {
    if (isOpen && role === 'Admin') {
      const fetchMembers = async () => {
        try {
          const res = await fetch(
            'http://localhost:5000/api/members',
            {
              headers: {
                'x-user-role': role,
                'x-user-email': adminEmail
              }
            }
          );

          if (res.ok) {
            const data = await res.json();
            setAllMembers(data);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchMembers();
    }
  }, [isOpen, role, adminEmail]);

  // Assign member
  const handleAssign = async () => {
    if (!selectedMember) return;

    setIsAssigning(true);
    setError('');

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${project.id}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': adminEmail
          },
          body: JSON.stringify({
            memberEmail: selectedMember,
            role: selectedMemberRole
          })
        }
      );

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        setSelectedMember('');
      } else {
        const data = await res.json();
        setError(data.error || 'Assignment failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection Error');
    } finally {
      setIsAssigning(false);
    }
  };

  // Unassign
  const handleUnassign = async (memberEmail) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${project.id}/unassign`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': adminEmail
          },
          body: JSON.stringify({ memberEmail })
        }
      );

      if (res.ok) {
        onUpdate(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Due date update
  const handleDueDateUpdate = async () => {
    try {
      setIsSavingDate(true);

      const res = await fetch(
        `http://localhost:5000/api/projects/${project.id}/due-date`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': adminEmail
          },
          body: JSON.stringify({
            dueDate: newDueDate
          })
        }
      );

      if (res.ok) {
        onUpdate(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleAdminProgressUpdate = async (val) => {
    try {
      setIsUpdatingProgress(true);
      const res = await fetch(`http://localhost:5000/api/projects/${project.id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
          'x-user-email': adminEmail
        },
        body: JSON.stringify({ progress: val })
      });
      if (res.ok) {
        onUpdate(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Action log
  const handleLogAction = async () => {
    if (!actionText.trim()) return;

    setIsLoggingAction(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${project.id}/actions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': adminEmail
          },
          body: JSON.stringify({
            phase: actionPhase,
            text: actionText,
            progress: actionProgress
          })
        }
      );

      if (res.ok) {
        onUpdate(await res.json());
        setActionText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingAction(false);
    }
  };

  // Comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    setIsCommenting(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${project.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            'x-user-email': adminEmail
          },
          body: JSON.stringify({
            text: newComment
          })
        }
      );

      if (res.ok) {
        onUpdate(await res.json());
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface z-[70] border-l border-gray-800 overflow-y-auto"
          >
            <div className="p-8">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Briefcase size={22} />
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    Project Details
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-8">

                {/* SUMMARY */}
                <section>
                  <h3 className="text-sm uppercase text-gray-500 mb-3">
                    Summary
                  </h3>

                  <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h4>

                    <p className="text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </section>

                {/* ADMIN CONTROLS */}
                {role === 'Admin' && (
                  <section className="bg-primary/5 p-5 rounded-2xl border border-primary/20">

                    <h3 className="text-sm font-bold text-white mb-5 uppercase">
                      Admin Controls
                    </h3>

                    {/* Due Date */}
                    <div className="mb-6">
                      <label className="block text-xs text-gray-400 mb-2">
                        Edit Due Date
                      </label>

                      <div className="flex gap-3">
                        <input
                          type="date"
                          value={
                            newDueDate
                              ? newDueDate.split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setNewDueDate(e.target.value)
                          }
                          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white"
                        />

                        <button
                          onClick={handleDueDateUpdate}
                          disabled={isSavingDate}
                          className="px-4 py-2 bg-primary text-white rounded-xl"
                        >
                          {isSavingDate
                            ? 'Saving...'
                            : 'Update'}
                        </button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          Edit Progress
                        </span>

                        <div className="flex items-center space-x-2">
                           <span className="text-primary font-bold">
                             {tempAdminProgress}%
                           </span>
                           {tempAdminProgress !== project.progress && (
                              <button 
                                onClick={() => handleAdminProgressUpdate(tempAdminProgress)}
                                disabled={isUpdatingProgress}
                                className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                              >
                                {isUpdatingProgress ? '...' : 'Save'}
                              </button>
                           )}
                        </div>
                      </div>

                      <input 
                         type="range" 
                         min="0" max="100" 
                         value={tempAdminProgress} 
                         onChange={(e) => setTempAdminProgress(Number(e.target.value))}
                         onMouseUp={() => handleAdminProgressUpdate(tempAdminProgress)}
                         onTouchEnd={() => handleAdminProgressUpdate(tempAdminProgress)}
                         className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary transition mt-1" 
                      />
                    </div>
                  </section>
                )}

                {/* ACTION LOG */}
                {canUpdateProgress && (
                  <section className="bg-primary/5 p-5 rounded-2xl border border-primary/20">
                    <h3 className="text-white font-bold mb-4 flex items-center">
                      <Plus size={18} className="mr-2" />
                      Log Action
                    </h3>

                    <div className="space-y-4">

                      <select
                        value={actionPhase}
                        onChange={(e) =>
                          setActionPhase(e.target.value)
                        }
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white"
                      >
                        {SDLC_PHASES.map((phase) => (
                          <option key={phase} value={phase}>
                            {phase}
                          </option>
                        ))}
                      </select>

                      <textarea
                        placeholder="Describe update..."
                        value={actionText}
                        onChange={(e) =>
                          setActionText(e.target.value)
                        }
                        rows="3"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white"
                      />

                      <button
                        onClick={handleLogAction}
                        disabled={isLoggingAction}
                        className="w-full py-3 bg-primary rounded-xl text-white font-bold"
                      >
                        {isLoggingAction
                          ? 'Submitting...'
                          : 'Submit Action'}
                      </button>
                    </div>
                  </section>
                )}

                {/* PROJECT INFO */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center text-gray-500 mb-2">
                      <Calendar size={15} className="mr-2" />
                      <span className="text-xs uppercase">
                        Due Date
                      </span>
                    </div>

                    <p className="text-white font-semibold">
                      {project?.dueDate
                        ? new Date(
                          project.dueDate
                        ).toLocaleDateString()
                        : 'No Due Date'}
                    </p>
                  </div>

                  <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center text-gray-500 mb-2">
                      <BarChart3 size={15} className="mr-2" />
                      <span className="text-xs uppercase">
                        Priority
                      </span>
                    </div>

                    <p className="text-white font-semibold">
                      {project.priority}
                    </p>
                  </div>
                </div>

                {/* COMMENTS */}
                <section>
                  <h3 className="text-sm uppercase text-gray-500 mb-4">
                    Comments
                  </h3>

                  <div className="space-y-4">
                    {comments.map((c, i) => (
                      <div
                        key={i}
                        className="bg-gray-900/40 p-4 rounded-xl border border-gray-800"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-primary text-xs font-bold">
                            {c.user}
                          </span>

                          <span className="text-gray-500 text-[10px]">
                            {new Date(
                              c.time
                            ).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300">
                          {c.text}
                        </p>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add comment..."
                        value={newComment}
                        onChange={(e) =>
                          setNewComment(e.target.value)
                        }
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white"
                      />

                      <button
                        onClick={handlePostComment}
                        className="px-4 bg-primary text-white rounded-xl"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* ASSIGN MEMBER */}
                {role === 'Admin' && (
                  <section className="bg-primary/5 p-5 rounded-2xl border border-primary/20">

                    <h3 className="text-white font-bold mb-4 flex items-center">
                      <UserPlus size={18} className="mr-2" />
                      Assign Member
                    </h3>

                    {error && (
                      <p className="text-red-400 text-sm mb-3">
                        {error}
                      </p>
                    )}

                    <div className="space-y-3">

                      <select
                        value={selectedMember}
                        onChange={(e) =>
                          setSelectedMember(e.target.value)
                        }
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white"
                      >
                        <option value="">
                          Select member
                        </option>

                        {allMembers
                          .filter(
                            (m) =>
                              !assignedMembers.some(
                                (am) =>
                                  am.email === m.email
                              )
                          )
                          .map((m) => (
                            <option
                              key={m.email}
                              value={m.email}
                            >
                              {m.name} ({m.email})
                            </option>
                          ))}
                      </select>

                      <input
                        type="text"
                        value={selectedMemberRole}
                        onChange={(e) =>
                          setSelectedMemberRole(
                            e.target.value
                          )
                        }
                        placeholder="Role"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white"
                      />

                      <button
                        onClick={handleAssign}
                        disabled={
                          isAssigning || !selectedMember
                        }
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold"
                      >
                        {isAssigning
                          ? 'Assigning...'
                          : 'Assign Member'}
                      </button>
                    </div>
                  </section>
                )}

                {/* MEMBERS */}
                <section>
                  <h3 className="text-sm uppercase text-gray-500 mb-4">
                    Project Team
                  </h3>

                  <div className="space-y-3">

                    {assignedMembers.map((member, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-900/40 p-4 rounded-xl border border-gray-800"
                      >
                        <div>
                          <p className="text-white text-sm">
                            {member.email}
                          </p>

                          <p className="text-primary text-xs">
                            {member.role}
                          </p>
                        </div>

                        {role === 'Admin' && (
                          <button
                            onClick={() =>
                              handleUnassign(member.email)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}

                    {assignedMembers.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        No members assigned.
                      </div>
                    )}
                  </div>
                </section>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}