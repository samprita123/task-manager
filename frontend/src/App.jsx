// import React, { useState } from 'react';
// import { Routes, Route, Navigate, Link } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Dashboard from './pages/Dashboard';
// import TeamMembers from './pages/TeamMembers';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Projects from './pages/Projects';
// import Profile from './pages/Profile';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState('Member');
//   const [userEmail, setUserEmail] = useState('');

//   const handleLogout = () => {
//      setIsAuthenticated(false);
//   };

//   if (!isAuthenticated) {
//      return (
//        <Routes>
//          <Route path="/login" element={<Login setAuth={setIsAuthenticated} setRole={setUserRole} setEmail={setUserEmail} />} />
//          <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} setRole={setUserRole} setEmail={setUserEmail} />} />
//          <Route path="*" element={<Navigate to="/login" />} />
//        </Routes>
//      );
//   }

//   return (
//     <div className="flex h-screen bg-background overflow-hidden text-gray-100 font-sans">
//       <Sidebar role={userRole} onLogout={handleLogout} />
//       <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
//         <header className="h-16 flex items-center justify-between px-8 bg-surface border-b border-gray-800 shrink-0">
//           <h1 className="text-xl font-bold tracking-wide">Team Task Manager</h1>
//           <Link to="/profile" className="flex items-center space-x-4">
//              <div className="w-10 h-10 rounded-full bg-primary/40 p-1 flex items-center justify-center text-primary font-bold overflow-hidden">
//                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
//              </div>
//           </Link>
//         </header>
        
//         <main className="flex-1 p-8">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/dashboard" element={<Dashboard role={userRole} email={userEmail} />} />
//             <Route path="/projects" element={<Projects role={userRole} email={userEmail} />} />
//             <Route path="/profile" element={<Profile role={userRole} email={userEmail} />} />
//             {userRole === 'Admin' && (
//                <Route path="/team" element={<TeamMembers email={userEmail} />} />
//             )}
//             <Route path="*" element={<Navigate to="/dashboard" />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;


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
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 bg-surface border-b border-gray-800 shrink-0">

          <h1 className="text-xl font-bold tracking-wide">
            Team Task Manager
          </h1>

          <Link
            to="/profile"
            className="flex items-center space-x-4"
          >

            <div className="w-10 h-10 rounded-full bg-primary/40 p-1 flex items-center justify-center text-primary font-bold overflow-hidden">

              {
                userEmail
                  ? userEmail.charAt(0).toUpperCase()
                  : 'U'
              }

            </div>

          </Link>

        </header>


        {/* PAGES */}
        <main className="flex-1 p-8 overflow-y-auto">

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