import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UserX, Briefcase, Mail, CheckCircle, ShieldAlert, Users } from 'lucide-react';

export default function TeamMembers({ email }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/members', {
            headers: { 'x-user-role': 'Admin', 'x-user-email': email }
        });
        if (res.ok) {
           setMembers(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const removeMember = async (id) => {
    if(!window.confirm("Are you sure you want to remove this member?")) return;
    try {
        const res = await fetch(`http://localhost:5000/api/members/${id}`, {
            method: 'DELETE',
            headers: { 'x-user-role': 'Admin', 'x-user-email': email }
        });
        if (res.ok) setMembers(m => m.filter(user => user.id !== id));
    } catch (e) {
        console.error(e);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      try {
          const res = await fetch(`http://localhost:5000/api/members/${id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin', 'x-user-email': email },
              body: JSON.stringify({ status: newStatus })
          });
          if (res.ok) {
              setMembers(m => m.map(u => u.id === id ? { ...u, status: newStatus } : u));
          }
      } catch(e) {
          console.error(e);
      }
  };

  const total = members.length;
  const involved = members.filter(m => (m.assignedProjects || []).length > 0).length;
  const unassigned = total - involved;

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Members...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
       <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-gray-800 shadow-xl">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <ShieldAlert className="mr-3 text-primary" /> Admin Center: Team Members
            </h2>
            <p className="text-gray-400 mt-1">Manage all team members and their project access.</p>
         </div>
         <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-400 transition transform hover:-translate-y-0.5">
            + Add New Member
         </button>
       </div>

       {/* Engagement Summary row */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface/30 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
             <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Users size={20}/></div>
             <div>
                <p className="text-xs text-gray-500 uppercase font-black">Total In Registry</p>
                <p className="text-xl font-bold text-white">{total}</p>
             </div>
          </div>
          <div className="bg-surface/30 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
             <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><CheckCircle size={20}/></div>
             <div>
                <p className="text-xs text-gray-500 uppercase font-black">Involved in Projects</p>
                <p className="text-xl font-bold text-white">{involved}</p>
             </div>
          </div>
          <div className="bg-surface/30 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
             <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500"><UserX size={20}/></div>
             <div>
                <p className="text-xs text-gray-500 uppercase font-black">Awaiting Assignment</p>
                <p className="text-xl font-bold text-white">{unassigned}</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence>
            {members.map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg hover:border-gray-600 transition duration-300 relative overflow-hidden group"
              >
                 <div className={`absolute top-0 w-full h-1 left-0 ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 
                  <div className="flex items-center space-x-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
                        <Users size={28} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white">{member.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center mt-1">
                           <Mail size={14} className="mr-1" /> {member.email}
                        </p>
                     </div>
                  </div>

                 <div className="space-y-3 mb-6">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Position</span>
                        <span className="text-primary font-semibold">{member.position}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Employee ID</span>
                        <span className="text-white font-mono text-xs">{member.empId}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Role</span>
                        <span className="text-white font-semibold">{member.role}</span>
                     </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Assigned Projects</span>
                       <span className="text-white font-semibold flex items-center">
                           <Briefcase size={14} className="mr-1 text-primary"/> {member.assignedProjects.length}
                       </span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Completed Projects</span>
                       <span className="text-white font-semibold flex items-center">
                           <CheckCircle size={14} className="mr-1 text-green-400"/> {member.completedProjects}
                       </span>
                    </div>
                 </div>

                 <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
                    <button 
                       onClick={() => toggleStatus(member.id, member.status)}
                       className={`flex-1 py-2 text-sm font-semibold rounded-lg transition border ${member.status === 'Active' ? 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10' : 'text-green-500 border-green-500/30 hover:bg-green-500/10'}`}
                    >
                       {member.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                       onClick={() => removeMember(member.id)}
                       className="py-2 px-3 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition"
                       title="Remove Member"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>
       </div>
    </motion.div>
  );
}
