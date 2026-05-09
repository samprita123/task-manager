import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, Settings, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ role, onLogout }) {
  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'Team Members', path: '/team', icon: Users },
  ];

  const memberLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', path: '/projects', icon: FolderOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const links = role === 'Admin' ? adminLinks : memberLinks;

  return (
    <div className="w-64 bg-surface h-full flex flex-col border-r border-gray-800 shadow-xl overflow-y-auto shrink-0">
      <div className="p-6 flex items-center mb-8">
         <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <LayoutDashboard size={24} />
         </div>
         <h2 className="text-xl font-bold tracking-tight text-white leading-tight">Task<br/>Manager</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 relative">
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => `
              relative flex items-center py-3 px-4 rounded-xl transition-all duration-300
              ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-surfaceHover'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]" 
                  />
                )}
                <link.icon className={`mr-3 z-10 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`} size={20} />
                <span className="z-10 font-medium">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
         <button 
           onClick={onLogout}
           className="flex items-center w-full py-3 px-4 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
         >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
         </button>
      </div>
    </div>
  );
}
