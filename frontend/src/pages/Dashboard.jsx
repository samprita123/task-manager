import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import ProjectDetailsDrawer from '../components/ProjectDetailsDrawer';

export default function Dashboard({ role, email }) {
   const [projects, setProjects] = useState([]);
   const [members, setMembers] = useState([]);
   const [activity, setActivity] = useState([]);
   const [monthlyStats, setMonthlyStats] = useState([]);
   const [performanceData, setPerformanceData] = useState({ onTime: 0, late: 0 });
   const [statusSummary, setStatusSummary] = useState({});
   const [loading, setLoading] = useState(true);

   // Drawer States
   const [selectedProject, setSelectedProject] = useState(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   const handleProjectClick = (project) => {
      setSelectedProject(project);
      setIsDrawerOpen(true);
   };

   useEffect(() => {
      const fetchDashboard = async () => {
         try {
            const responses = await Promise.all([
               fetch(`${API_BASE_URL}/projects`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }),
               role === 'Admin' ? fetch(`${API_BASE_URL}/members`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }) : Promise.resolve({ ok: true, json: () => [] }),
               fetch(`${API_BASE_URL}/projects/activity`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }),
               role === 'Admin' ? fetch(`${API_BASE_URL}/projects/stats/monthly`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }) : Promise.resolve({ ok: true, json: () => [] }),
               role === 'Admin' ? fetch(`${API_BASE_URL}/projects/stats/performance`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }) : Promise.resolve({ ok: true, json: () => [] }),
               role === 'Admin' ? fetch(`${API_BASE_URL}/projects/stats/summary`, {
                  headers: { 'x-user-role': role, 'x-user-email': email }
               }) : Promise.resolve({ ok: true, json: () => [] })
            ]);

            const [projRes, memRes, actRes, monthRes, perfRes, sumRes] = responses;

            if (projRes.ok) setProjects(await projRes.json());
            if (memRes.ok) setMembers(await memRes.json());
            if (actRes.ok) setActivity(await actRes.json());
            if (monthRes.ok) setMonthlyStats(await monthRes.json());
            if (perfRes.ok) setPerformanceData(await perfRes.json());
            if (sumRes.ok) setStatusSummary(await sumRes.json());
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      fetchDashboard();

      // Auto-refresh every 10 seconds for dynamic updates
      const interval = setInterval(fetchDashboard, 10000);
      return () => clearInterval(interval);
   }, [role, email]);

   const filteredProjects = role === 'Admin'
      ? projects
      : projects.filter(p => p.assignedMembers?.some(m => m.email === email));

   // 3D-ish Pie Chart Data derived dynamically from real-time projects
   const pieData = [
      { name: 'Completed', value: projects.filter(p => p.progress >= 100).length, color: '#10B981' },
      { name: 'In Progress', value: projects.filter(p => p.progress > 0 && p.progress < 100 && p.status !== 'Cancelled').length, color: '#3B82F6' },
      { name: 'Pending', value: projects.filter(p => p.progress === 0 && p.status !== 'Cancelled').length, color: '#F59E0B' },
      { name: 'Cancelled', value: projects.filter(p => p.status === 'Cancelled').length, color: '#EF4444' }
   ].filter(d => d.value > 0);

   // Delivery performance: Chances of on-time vs late per project
   const barData = projects.filter(p => p.status !== 'Cancelled').slice(0, 7).map(p => {
      const start = new Date(p.createdAt).getTime();
      const due = new Date(p.dueDate).getTime();
      const now = Date.now();

      const totalDuration = due - start;
      const elapsed = Math.max(0, now - start);

      let onTimeChance = 50;
      if (p.progress >= 100) {
         onTimeChance = (new Date(p.completedAt || now) <= due) ? 100 : 0;
      } else if (elapsed >= totalDuration) {
         onTimeChance = p.progress > 90 ? 15 : 0;
      } else {
         const timeProgress = elapsed / totalDuration;
         const actualProgress = p.progress / 100;

         if (actualProgress >= timeProgress) {
            onTimeChance = Math.min(95, 50 + ((actualProgress - timeProgress) * 100));
         } else {
            onTimeChance = Math.max(5, 50 - ((timeProgress - actualProgress) * 100));
         }
      }

      return {
         name: p.title.substring(0, 10) + '...',
         OnTime: Math.round(onTimeChance),
         Late: Math.round(100 - onTimeChance)
      };
   });

   // Dynamic Flow Analytics
   const generateFlowAnalytics = () => {
      const stats = [];
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
         const dStr = new Date(now.getFullYear(), now.getMonth(), i).toISOString().split('T')[0];
         stats.push({
            day: i,
            Received: projects.filter(p => p.createdAt && p.createdAt.startsWith(dStr)).length,
            Pending: projects.filter(p => p.createdAt && p.createdAt.startsWith(dStr) && p.progress === 0).length,
            InProgress: projects.filter(p => p.createdAt && p.createdAt.startsWith(dStr) && p.progress > 0 && p.progress < 100).length,
            Completed: projects.filter(p => p.completedAt && p.completedAt.startsWith(dStr)).length
         });
      }
      return stats;
   };
   const liveMonthlyStats = generateFlowAnalytics();

   // Priority Matrix: Sorted by Priority and due time
   const priorityOrder = { High: 0, Medium: 1, Low: 2 };
   const priorityMatrix = [...projects]
      .sort((a, b) => {
         if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
         }
         return new Date(a.dueDate) - new Date(b.dueDate);
      })
      .slice(0, 5);

   // Due Progress Tracker: Top 5 by due date
   const dueProgress = [...projects]
      .filter(p => p.status !== 'Completed' && p.status !== 'Cancelled')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

   const totalMembersCount = members.length;
   const involvedMembersEmails = new Set(projects.flatMap(p => (p.assignedMembers || []).map(m => m.email)));
   const involvedMembersCount = involvedMembersEmails.size;
   const unassignedMembersCount = Math.max(0, totalMembersCount - involvedMembersCount);

   if (loading) return <div className="p-8 text-center text-gray-400">Loading Analytics...</div>;

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
         <div>
            <h2 className="text-3xl font-bold text-white">Advanced Project Analytics</h2>
            <p className="text-gray-400 mt-1">Real-time performance metrics and monthly reporting.</p>
         </div>

         {/* Monthly Trends Table-like Widget (Recieved, Completed, Pending, Cancelled) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 border-l-4 border-l-blue-500">
               <p className="text-xs text-gray-500 uppercase font-black">Monthly Received</p>
               <h4 className="text-3xl font-black text-white mt-1">{monthlyStats.reduce((sum, d) => sum + d.received, 0)}</h4>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 border-l-4 border-l-green-500">
               <p className="text-xs text-gray-500 uppercase font-black">Monthly Completed</p>
               <h4 className="text-3xl font-black text-white mt-1">{monthlyStats.reduce((sum, d) => sum + d.completed, 0)}</h4>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 border-l-4 border-l-orange-500">
               <p className="text-xs text-gray-500 uppercase font-black">Monthly Pending</p>
               <h4 className="text-3xl font-black text-white mt-1">{monthlyStats.reduce((sum, d) => sum + d.pending, 0)}</h4>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 border-l-4 border-l-red-500">
               <p className="text-xs text-gray-500 uppercase font-black">Monthly Cancelled</p>
               <h4 className="text-3xl font-black text-white mt-1">{monthlyStats.reduce((sum, d) => sum + d.cancelled, 0)}</h4>
            </div>
         </div>

         {/* Member Involvement Metrics (NEW) */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface/50 p-6 rounded-2xl border border-gray-800 hover:bg-surface transition group">
               <p className="text-xs text-gray-500 uppercase font-black group-hover:text-primary transition">Total Registry Members</p>
               <div className="flex items-center justify-between mt-2">
                  <h4 className="text-2xl font-bold text-white">{totalMembersCount}</h4>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">ALL</div>
               </div>
            </div>
            <div className="bg-surface/50 p-6 rounded-2xl border border-gray-800 hover:bg-surface transition group">
               <p className="text-xs text-gray-500 uppercase font-black group-hover:text-green-500 transition">Assigned to Projects</p>
               <div className="flex items-center justify-between mt-2">
                  <h4 className="text-2xl font-bold text-white">{involvedMembersCount}</h4>
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs">ACT</div>
               </div>
            </div>
            <div className="bg-surface/50 p-6 rounded-2xl border border-gray-800 hover:bg-surface transition group">
               <p className="text-xs text-gray-500 uppercase font-black group-hover:text-yellow-500 transition">Awaiting Assignment</p>
               <div className="flex items-center justify-between mt-2">
                  <h4 className="text-2xl font-bold text-white">{unassignedMembersCount}</h4>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-xs">OFF</div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 3D-styled Pie Chart */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-2xl relative">
               <h3 className="text-lg font-bold text-white mb-8 flex items-center">
                  <PieIcon size={20} className="mr-2 text-primary" /> Status Weightage (3D Simulation)
               </h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <defs>
                           {pieData.map((entry, index) => (
                              <linearGradient key={`grad-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={entry.color} stopOpacity={0.8} />
                                 <stop offset="95%" stopColor={entry.color} stopOpacity={0.3} />
                              </linearGradient>
                           ))}
                        </defs>
                        <Pie
                           data={pieData}
                           innerRadius={80}
                           outerRadius={110}
                           paddingAngle={8}
                           dataKey="value"
                           stroke="#000"
                           strokeWidth={0}
                        >
                           {pieData.map((entry, index) => (
                              <Cell key={index} fill={`url(#color-${index})`} className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '15px' }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               {/* Legend overlay */}
               <div className="absolute right-8 bottom-8 text-right space-y-2">
                  {pieData.map((d, i) => (
                     <div key={i} className="flex items-center justify-end space-x-2">
                        <span className="text-xs font-bold text-gray-400">{d.name}</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Performance Bar Graph */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-2xl">
               <h3 className="text-lg font-bold text-white mb-8 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-primary" /> Delivery Performance (On-Time vs Late)
               </h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData} margin={{ left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} angle={-45} textAnchor="end" />
                        <YAxis stroke="#4B5563" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#1F2937', opacity: 0.4 }} contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '15px' }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="OnTime" name="On-Time Chance %" fill="#10B981" radius={[4, 4, 0, 0]} barSize={15} />
                        <Bar dataKey="Late" name="Late Chance %" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={15} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Priority Matrix Table */}
            <div className="bg-surface rounded-3xl border border-gray-800 shadow-2xl overflow-x-auto">
               <div className="p-6 border-b border-gray-800 bg-gray-900/10 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Priority Matrix (Shortest Due First)</h3>
                  <Link to="/projects" className="text-xs text-primary hover:underline font-black uppercase">View All</Link>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-gray-900/30 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <tr>
                           <th className="px-6 py-4">Project</th>
                           <th className="px-6 py-4">Priority</th>
                           <th className="px-6 py-4">Due Date</th>
                           <th className="px-6 py-4">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                        {priorityMatrix.map(p => (
                           <tr key={p._id} onClick={() => handleProjectClick(p)} className="hover:bg-gray-800/10 transition group cursor-pointer">
                              <td className="px-6 py-4 text-xs font-bold text-white group-hover:text-primary transition">{p.title}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${p.priority === 'High' ? 'bg-red-400/10 text-red-400' :
                                    p.priority === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'
                                    }`}>{p.priority}</span>
                              </td>
                              <td className="px-6 py-4 text-[10px] font-mono text-gray-400">{new Date(p.dueDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${p.status === 'Completed' ? 'bg-success/10 text-success' :
                                    p.status === 'In Progress' ? 'bg-primary/10 text-primary' :
                                       p.status === 'Cancelled' ? 'bg-danger/10 text-danger' :
                                          'bg-warning/10 text-warning'
                                    }`}>{p.status || 'Pending'}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Due progress Track */}
            <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-2xl">
               <h3 className="text-lg font-bold text-white mb-8">Due Progress Track (Upcoming Deadlines)</h3>
               <div className="space-y-8">
                  {dueProgress.map((p, i) => (
                     <div key={i} onClick={() => handleProjectClick(p)} className="space-y-2 cursor-pointer hover:bg-gray-800/30 p-4 -m-4 rounded-xl transition border border-transparent hover:border-gray-800">
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-white">{p.title}</span>
                           <span className="text-primary font-black uppercase tracking-tighter">{p.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p.progress}%` }}
                              className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                           />
                        </div>
                        <p className="text-[10px] text-gray-500">Estimated due in {Math.ceil((new Date(p.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
                     </div>
                  ))}
                  {dueProgress.length === 0 && <p className="text-center text-gray-600 italic py-10">No pending projects tracked.</p>}
               </div>
            </div>
         </div>

         {/* Monthly Trends Graph Integration (Moved from last task) */}
         <div className="bg-surface rounded-2xl p-8 border border-gray-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-8 flex items-center">
               <TrendingUp size={18} className="mr-2 text-primary" /> Project Flow Analytics (Received vs Completed)
            </h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveMonthlyStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                     <XAxis
                        dataKey="day"
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                     />
                     <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                     <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }} />
                     <Legend wrapperStyle={{ fontSize: '10px' }} />
                     <Line type="monotone" dataKey="Received" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Received" />
                     <Line type="monotone" dataKey="Pending" stroke="#F59E0B" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Pending (0%)" />
                     <Line type="monotone" dataKey="InProgress" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="In Progress" />
                     <Line type="monotone" dataKey="Completed" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Completed" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Drawer Integration */}
         <ProjectDetailsDrawer
            project={selectedProject}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            role={role}
            adminEmail={email}
            onUpdate={(updated) => {
               setProjects(prev =>
                  prev.map(p =>
                     (p._id === updated._id || p.id === updated._id || p._id === updated.id || p.id === updated.id) ? updated : p
                  )
               );

               setSelectedProject(updated);
            }}
         />
      </motion.div>
   );
}
