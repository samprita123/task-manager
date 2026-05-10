import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UserX, Briefcase, Mail, CheckCircle, ShieldAlert, Users, Info } from 'lucide-react';
import MemberDetailsDrawer from '../components/MemberDetailsDrawer';

export default function TeamMembers({ email }) {
   const [members, setMembers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedMember, setSelectedMember] = useState(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   useEffect(() => {
      const fetchMembers = async () => {
         try {
            const res = await fetch(`${API_BASE_URL}/members`, {
               headers: { 'x-user-role': 'Admin', 'x-user-email': email },
               cache: 'no-store'
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

      const interval = setInterval(fetchMembers, 10000);
      return () => clearInterval(interval);
   }, [email]);

   const handleMemberClick = (member) => {
      setSelectedMember(member);
      setIsDrawerOpen(true);
   };

   const removeMember = async (id) => {
      if (!window.confirm("Are you sure you want to remove this member?")) return;
      try {
         const res = await fetch(`${API_BASE_URL}/members/${id}`, {
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
         const res = await fetch(`${API_BASE_URL}/members/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin', 'x-user-email': email },
            body: JSON.stringify({ status: newStatus })
         });
         if (res.ok) {
            setMembers(m => m.map(u => u.id === id ? { ...u, status: newStatus } : u));
         }
      } catch (e) {
         console.error(e);
      }
   };

   const total = members?.length || 0;
   const involved = members.filter(member => member?.assignedProjects?.length > 0).length;
   const unassigned = Math.max(0, total - involved);

   if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Team Data...</p>
      </div>
   );

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between bg-surface p-6 rounded-3xl border border-gray-800 shadow-xl gap-4">
            <div>
               <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShieldAlert className="mr-3 text-primary" /> Team Governance Center
               </h2>
               <p className="text-gray-400 mt-1">Manage all team members and their project access dynamically.</p>
            </div>
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
               <span className="text-xs font-black text-primary uppercase tracking-widest">Dynamic Sync Active</span>
            </div>
         </div>

         {/* Engagement Summary row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-gray-800 flex items-center space-x-5 hover:border-primary/30 transition-all group">
               <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform"><Users size={24} /></div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Total Registry</p>
                  <p className="text-3xl font-black text-white">{total}</p>
               </div>
            </div>
            <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-gray-800 flex items-center space-x-5 hover:border-success/30 transition-all group">
               <div className="p-4 bg-success/10 rounded-2xl text-success group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Involved in Projects</p>
                  <p className="text-3xl font-black text-white">{involved}</p>
               </div>
            </div>
            <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-gray-800 flex items-center space-x-5 hover:border-warning/30 transition-all group">
               <div className="p-4 bg-warning/10 rounded-2xl text-warning group-hover:scale-110 transition-transform"><UserX size={24} /></div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Awaiting Assignment</p>
                  <p className="text-3xl font-black text-white">{unassigned}</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
               {members.map((member, idx) => (
                  <motion.div
                     key={member.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ delay: idx * 0.05 }}
                     onClick={() => handleMemberClick(member)}
                     className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-lg hover:border-primary/50 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  >
                     <div className={`absolute top-0 right-6 px-3 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-tighter ${member.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {member.status}
                     </div>

                     <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] group-hover:rotate-6 transition-transform">
                           <span className="text-2xl font-black">{member.name.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                           <h3 className="text-lg font-bold text-white truncate">{member.name}</h3>
                           <p className="text-[11px] text-primary font-bold uppercase tracking-widest truncate">
                              {member.position}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold uppercase tracking-widest">Email</span>
                           <span className="text-gray-300 truncate max-w-[150px]">{member.email}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold uppercase tracking-widest">Active Projects</span>
                           <div className="flex items-center text-white font-black bg-gray-900 px-2 py-1 rounded-lg">
                              <Briefcase size={12} className="mr-1.5 text-primary" /> {member.assignedProjects?.length || 0}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold uppercase tracking-widest">Ready Status</span>
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${(member.assignedProjects?.length || 0) < 3 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                              }`}>
                              {(member.assignedProjects?.length || 0) < 3 ? 'READY' : 'BUSY'}
                           </span>
                        </div>
                     </div>

                     <div className="flex items-center space-x-3 pt-6 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
                        <button
                           onClick={() => toggleStatus(member.id, member.status)}
                           className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition border ${member.status === 'Active' ? 'text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10' : 'text-green-500 border-green-500/20 hover:bg-green-500/10'}`}
                        >
                           {member.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                        <button
                           onClick={() => removeMember(member.id)}
                           className="p-2.5 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition"
                           title="Remove Member"
                        >
                           <Trash2 size={18} />
                        </button>
                        <div className="p-2.5 bg-gray-900 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <Info size={18} />
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         <MemberDetailsDrawer
            member={selectedMember}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            adminEmail={email}
         />
      </motion.div>
   );
}
