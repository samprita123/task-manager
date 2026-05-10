import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Award, TrendingUp, CheckCircle, Clock, Shield } from 'lucide-react';

export default function Profile({ email, role }) {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            const res = await fetch(`${API_BASE_URL}/members/me`, {
               headers: { 'x-user-role': role, 'x-user-email': email }
            });
            if (res.ok) {
               setProfile(await res.json());
            }
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchProfile();
   }, [email, role]);

   if (loading) return <div className="p-8 text-center text-gray-400">Loading Profile...</div>;
   if (!profile) return <div className="p-8 text-center text-red-400">Profile Not Found</div>;

   const efficiency = profile.completedProjects > 5 ? 95 : 75 + (profile.completedProjects * 4);

   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         {}
         <div className="bg-surface rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Award size={160} />
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 relative z-10 text-center md:text-left">
               <div className="relative">
                  <div className="w-32 h-32 rounded-3xl border-4 border-primary/20 bg-gray-900 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                     <User size={64} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl shadow-lg ring-4 ring-surface">
                     <Shield size={16} className="text-white" />
                  </div>
               </div>

               <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                     <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                     <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 self-center md:self-auto">
                        {profile.role}
                     </span>
                  </div>
                  <p className="text-gray-300 flex items-center justify-center md:justify-start mb-6">
                     <Mail size={16} className="mr-2 text-primary" /> {profile.email}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                     <div className="px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center">
                        <Briefcase size={14} className="mr-2 text-primary" />
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-tighter">{profile.position}</span>
                     </div>
                     <div className="px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center">
                        <span className="text-xs text-gray-400 mr-2">ID:</span>
                        <span className="text-xs text-white font-mono">{profile.empId || 'N/A'}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-xl group">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-400/10 rounded-xl text-green-400">
                     <CheckCircle size={24} />
                  </div>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-gray-800 rounded">Total</span>
               </div>
               <h3 className="text-4xl font-black text-white mb-1">{profile.completedProjects}</h3>
               <p className="text-gray-300 text-sm font-medium">Projects Completed</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-xl group">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-400/10 rounded-xl text-blue-400">
                     <TrendingUp size={24} />
                  </div>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-gray-800 rounded">Live</span>
               </div>
               <h3 className="text-4xl font-black text-white mb-1">{profile.assignedProjects.length}</h3>
               <p className="text-gray-300 text-sm font-medium">Active Assignments</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-xl group">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-400/10 rounded-xl text-orange-400">
                     <Award size={24} />
                  </div>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-gray-800 rounded">Score</span>
               </div>
               <h3 className="text-4xl font-black text-white mb-1">{efficiency}%</h3>
               <p className="text-gray-300 text-sm font-medium">Efficiency Index</p>
            </div>
         </div>

         {}
         <div className="bg-surface rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/10">
               <h3 className="font-bold text-white flex items-center uppercase tracking-tighter">
                  <Award size={18} className="mr-2 text-primary" /> Performance Record
               </h3>
               <span className="text-xs text-gray-400">Updated hourly</span>
            </div>
            <div className="p-8">
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-300">Task Velocity</span>
                        <span className="text-white font-bold">{efficiency}%</span>
                     </div>
                     <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${efficiency}%` }}
                           className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                           {['Architecture', 'Problem Solving', 'React', 'Teamwork'].map(skill => (
                              <span key={skill} className="px-3 py-1 bg-gray-900 text-gray-300 text-[10px] font-bold rounded-lg border border-gray-800">{skill}</span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Activity</h4>
                        <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded-xl border border-gray-800 inline-block">
                           {new Date(profile.lastActivity).toLocaleString()}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
