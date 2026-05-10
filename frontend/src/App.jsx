import React, { useState, useEffect } from 'react';

import {
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';

import TeamMembers from './pages/TeamMembers';

import Login from './pages/Login';

import Signup from './pages/Signup';

import Projects from './pages/Projects';

import Profile from './pages/Profile';


function App() {

  // AUTH STATES
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [userRole, setUserRole] =
    useState('');

  const [userEmail, setUserEmail] =
    useState('');

  const [loading, setLoading] =
    useState(true);


  // LOAD SAVED LOGIN
  useEffect(() => {

    const savedAuth =
      localStorage.getItem('isAuth');

    const savedRole =
      localStorage.getItem('userRole');

    const savedEmail =
      localStorage.getItem('userEmail');

    if (
      savedAuth === 'true' &&
      savedRole &&
      savedEmail
    ) {

      setIsAuthenticated(true);

      setUserRole(savedRole);

      setUserEmail(savedEmail);
    }

    setLoading(false);

  }, []);


  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);


  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem('isAuth');

    localStorage.removeItem('userRole');

    localStorage.removeItem('userEmail');

    localStorage.removeItem('currentUser');

    setIsAuthenticated(false);

    setUserRole('');

    setUserEmail('');
  };


  // WAIT LOADING
  if (loading) {

    return (
      <div className="h-screen flex items-center justify-center bg-background text-white text-xl">
        Loading...
      </div>
    );
  }


  // LOGIN / SIGNUP ROUTES
  if (!isAuthenticated) {

    return (

      <Routes>

        <Route

          path="/login"

          element={
            <Login
              setAuth={setIsAuthenticated}
              setRole={setUserRole}
              setEmail={setUserEmail}
            />
          }

        />

        <Route

          path="/signup"

          element={
            <Signup
              setAuth={setIsAuthenticated}
              setRole={setUserRole}
              setEmail={setUserEmail}
            />
          }

        />

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>
    );
  }


  // MAIN APP
  return (

    <div className="flex h-screen bg-background overflow-hidden text-gray-100 font-sans">

      <Sidebar
        role={userRole}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-surface border-b border-gray-800 shrink-0">

          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 mr-3 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg lg:text-xl font-bold tracking-wide truncate">
              Team Task Manager
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Sync</span>
            </div>

            <Link
              to="/profile"
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/40 p-1 flex items-center justify-center text-primary font-bold overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
            </Link>
          </div>

        </header>


        {/* PAGES */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">

          <Routes>

            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />

            <Route

              path="/dashboard"

              element={
                <Dashboard
                  role={userRole}
                  email={userEmail}
                />
              }

            />

            <Route

              path="/projects"

              element={
                <Projects
                  role={userRole}
                  email={userEmail}
                />
              }

            />

            <Route

              path="/profile"

              element={
                <Profile
                  role={userRole}
                  email={userEmail}
                />
              }

            />


            {/* ADMIN ONLY */}
            {
              userRole === 'Admin' && (

                <Route

                  path="/team"

                  element={
                    <TeamMembers
                      email={userEmail}
                    />
                  }

                />

              )
            }


            {/* FALLBACK */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;