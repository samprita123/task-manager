import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, LogOut, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ role, onLogout, isOpen, onClose }) {
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

  const SidebarContent = () => (
    <div className="w-64 bg-surface h-full flex flex-col border-r border-gray-800 shadow-xl overflow-y-auto shrink-0">
      <div className="p-6 flex items-center justify-between mb-8">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-3 object-contain drop-shadow-xl" />
          <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
            Task<br />Manager
          </h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white transition p-1"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 relative">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center py-3 px-4 rounded-xl transition-all duration-300
              ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-surfaceHover'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]"
                  />
                )}
                <link.icon
                  className={`mr-3 z-10 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
                  size={20}
                />
                <span className="z-10 font-medium">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => { onLogout(); onClose && onClose(); }}
          className="flex items-center w-full py-3 px-4 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:flex h-full">
        <SidebarContent />
      </div>

      {/* Mobile sidebar — slide-in overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
