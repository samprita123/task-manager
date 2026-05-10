import { API_BASE_URL, ENDPOINTS } from '../api/config';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Briefcase, CheckCircle, User, BarChart, Calendar } from 'lucide-react';

export default function MemberDetailsDrawer({ member, isOpen, onClose, adminEmail }) {
  const [memberProjects, setMemberProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      fetchMemberProjects();
    }
  }, [isOpen, member]);

  const fetchMemberProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: { 
          'x-user-role': 'Admin', 
          'x-user-email': adminEmail 
        }
      });
      if (res.ok) {
        const allProjects = await res.json();
        // Filter projects where this member is assigned
        const assigned = allProjects.filter(p => 
          p.assignedMembers?.some(m => m.email === member.email)
        );
        setMemberProjects(assigned);
      }
    } catch (err) {
      console.error('Failed to fetch projects for member:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  const activeProjects = memberProjects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled');
  const totalProgress = memberProjects.length > 0 
    ? memberProjects.reduce((acc, p) => acc + (p.progress || 0), 0) / memberProjects.length 
    : 0;
    
  const isReadyForMore = activeProjects.length < 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md lg:max-w-lg bg-surface z-[90] shadow-2xl border-l border-gray-800 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <User size={22} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Member Insights</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Profile Header */}
                <section className="text-center bg-gray-900/40 p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-surface mx-auto mb-4 flex items-center justify-center text-primary text-3xl font-bold shadow-xl">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                  <p className="text-primary font-medium text-sm uppercase tracking-widest mt-1">{member.position}</p>
                  <div className="flex items-center justify-center space-x-2 mt-3 text-gray-300 text-sm">
                    <Mail size={14} />
                    <span>{member.email}</span>
                  </div>
                </section>

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Availability Status</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isReadyForMore ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className={`text-sm font-bold ${isReadyForMore ? 'text-green-400' : 'text-yellow-400'}`}>
                        {isReadyForMore ? 'Ready for Projects' : 'At Capacity'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Emp ID</p>
                    <p className="text-sm font-mono text-white">{member.empId}</p>
                  </div>
                </div>

                {/* Contribution Metrics */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
                    <BarChart size={16} className="mr-2 text-primary" /> Performance metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-900/20 p-4 rounded-2xl border border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-300 uppercase font-bold">Average Progress Contribution</span>
                        <span className="text-primary font-black">{Math.round(totalProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${totalProgress}%` }}
                          className="bg-primary h-full rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                        <p className="text-[10px] text-green-500/80 uppercase font-black">Success Rate</p>
                        <p className="text-xl font-bold text-green-400">
                          {member.completedProjects > 0 ? '94%' : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                        <p className="text-[10px] text-blue-500/80 uppercase font-black">Completed</p>
                        <p className="text-xl font-bold text-blue-400">{member.completedProjects}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Active Projects List */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center">
                      <Briefcase size={16} className="mr-2 text-primary" /> Active Assignments
                    </h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      {activeProjects.length} Projects
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-4 text-gray-500 text-xs italic">Loading project details...</div>
                    ) : activeProjects.length > 0 ? (
                      activeProjects.map((p, i) => (
                        <div key={i} className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 hover:border-primary/30 transition group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition">{p.title}</h4>
                            <span className="text-[10px] text-gray-400">{new Date(p.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-primary">{p.progress}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-gray-900/20 rounded-2xl border border-dashed border-gray-800">
                        <p className="text-xs text-gray-500 italic">No active projects assigned.</p>
                      </div>
                    )}
                  </div>
                </section>
                
                {/* Ready Status Detail */}
                <div className={`p-4 rounded-2xl border ${isReadyForMore ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                  <h4 className={`text-xs font-bold mb-1 flex items-center ${isReadyForMore ? 'text-green-400' : 'text-yellow-400'}`}>
                    <CheckCircle size={14} className="mr-2" /> 
                    {isReadyForMore ? 'Available for Assignment' : 'Workload Advisory'}
                  </h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">
                    {isReadyForMore 
                      ? 'This member has high bandwidth and is ready to take on new initiatives and complex projects.' 
                      : 'This member is currently handling multiple high-priority tasks. It is recommended to consult before assigning more work.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
