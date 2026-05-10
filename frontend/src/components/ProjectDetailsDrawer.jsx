import { API_BASE_URL, ENDPOINTS } from '../api/config';
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

  const projectId = project._id || project.id;

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
            `${API_BASE_URL}/members`,
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
        `${API_BASE_URL}/projects/${projectId}/assign`,
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
        `${API_BASE_URL}/projects/${projectId}/unassign`,
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
        `${API_BASE_URL}/projects/${projectId}/due-date`,
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
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/progress`, {
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
        `${API_BASE_URL}/projects/${projectId}/actions`,
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
        `${API_BASE_URL}/projects/${projectId}/comments`,
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
            className="fixed top-0 right-0 h-full w-full sm:max-w-md lg:max-w-lg bg-surface z-[70] border-l border-gray-800 overflow-y-auto"
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
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm uppercase text-gray-400">
                      Summary
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      project.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                      project.status === 'In Progress' ? 'bg-primary/10 text-primary border border-primary/20' :
                      project.status === 'Cancelled' ? 'bg-danger/10 text-danger border border-danger/20' :
                      'bg-warning/10 text-warning border border-warning/20'
                    }`}>
                      {project.status || 'Pending'}
                    </div>
                  </div>

                  <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h4>

                    <p className="text-gray-300">
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
                      <label className="block text-xs text-gray-300 mb-2">
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
                        <span className="text-xs text-gray-300">
                          Current Progress
                        </span>
                        <span className="text-primary font-bold">
                          {project.progress || 0}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 ml-1">Phase</label>
                          <select
                            value={actionPhase}
                            onChange={(e) =>
                              setActionPhase(e.target.value)
                            }
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm"
                          >
                            {SDLC_PHASES.map((phase) => (
                              <option key={phase} value={phase}>
                                {phase}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 ml-1">Update Progress: {actionProgress}%</label>
                          <input 
                            type="range" 
                            min="0" max="100" 
                            value={actionProgress} 
                            onChange={(e) => setActionProgress(Number(e.target.value))}
                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary transition mt-2" 
                          />
                        </div>
                      </div>

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
                    <div className="flex items-center text-gray-400 mb-2">
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
                    <div className="flex items-center text-gray-400 mb-2">
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
                  <h3 className="text-sm uppercase text-gray-400 mb-4">
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

                          <span className="text-gray-400 text-[10px]">
                            {new Date(
                              c.time
                            ).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-200">
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
                  <h3 className="text-sm uppercase text-gray-400 mb-4">
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
                      <div className="text-center text-gray-400 py-4">
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