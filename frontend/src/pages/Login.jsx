// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Shield, User, ArrowRight } from 'lucide-react';

// export default function Login({ setAuth, setRole, setEmail }) {
//   const navigate = useNavigate();
//   const [emailInput, setEmailInput] = useState('');
//   const [password, setPassword] = useState('');
//   const [selectedRole, setSelectedRole] = useState('Member');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//         const res = await fetch('http://localhost:5000/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email: emailInput, password, role: selectedRole })
//         });
//         const data = await res.json();

//         if (res.ok) {
//             setRole(selectedRole);
//             setEmail(emailInput);
//             setAuth(true);
//             navigate('/dashboard');
//         } else {
//             setError(data.error || 'Login failed');
//         }
//     } catch (err) {
//         setError('Server error. Please try again.');
//     }
//   };

//   const handleForgotInfo = () => {
//       alert("Please contact admin to reset your password.");
//   };

//   return (
//     <div className="min-h-screen flex bg-background">
//       {/* Left split - Image */}
//       <div className="hidden lg:flex lg:w-1/2 bg-surfaceHover relative items-center justify-center overflow-hidden">
//          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 z-0"></div>
//          <img 
//             src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
//             alt="Office Collaboration" 
//             className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
//          />
//          <div className="z-10 text-center px-10">
//             <h1 className="text-5xl font-bold text-white mb-6">Empower Your Team</h1>
//             <p className="text-xl text-gray-300 max-w-md mx-auto">Manage projects, track completion, and elevate your collaboration in one slick workspace.</p>
//          </div>
//       </div>

//       {/* Right split - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <motion.div 
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="w-full max-w-md"
//         >
//           <div className="mb-8">
//              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//              <p className="text-gray-400">Please enter your details to sign in.</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-4">Select Role</label>
//               <div className="grid grid-cols-2 gap-4">
//                  <button 
//                     type="button"
//                     onClick={() => setSelectedRole('Admin')}
//                     className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
//                         selectedRole === 'Admin' 
//                         ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
//                         : 'border-gray-800 bg-surface hover:bg-surfaceHover hover:border-gray-600'
//                     }`}
//                  >
//                     <Shield className={selectedRole === 'Admin' ? 'text-primary' : 'text-gray-400'} size={28} />
//                     <span className={`mt-2 font-semibold ${selectedRole === 'Admin' ? 'text-white' : 'text-gray-400'}`}>Admin</span>
//                  </button>
//                  <button 
//                     type="button"
//                     onClick={() => setSelectedRole('Member')}
//                     className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
//                         selectedRole === 'Member' 
//                         ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
//                         : 'border-gray-800 bg-surface hover:bg-surfaceHover hover:border-gray-600'
//                     }`}
//                  >
//                     <User className={selectedRole === 'Member' ? 'text-primary' : 'text-gray-400'} size={28} />
//                     <span className={`mt-2 font-semibold ${selectedRole === 'Member' ? 'text-white' : 'text-gray-400'}`}>Member</span>
//                  </button>
//               </div>
//             </div>

//             {error && <div className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">{error}</div>}

//             <div className="space-y-4">
//                <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
//                   <input 
//                     type="email" 
//                     value={emailInput}
//                     onChange={e => setEmailInput(e.target.value)}
//                     className="w-full bg-surface border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
//                     placeholder="name@company.com"
//                     required 
//                   />
//                </div>
//                <div>
//                   <div className="flex justify-between items-center mb-2">
//                      <label className="block text-sm font-medium text-gray-400">Password</label>
//                      <span onClick={handleForgotInfo} className="text-sm text-primary hover:underline cursor-pointer">Forgot Password?</span>
//                   </div>
//                   <input 
//                     type="password" 
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     className="w-full bg-surface border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
//                     placeholder="••••••••"
//                     required 
//                   />
//                </div>
//             </div>

//             <button type="submit" className="w-full group flex items-center justify-center py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition transform hover:-translate-y-0.5">
//                Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </form>

//           <p className="text-center text-gray-400 mt-8 text-sm">
//              Don't have an account? <span onClick={() => navigate('/signup')} className="text-white hover:text-primary transition cursor-pointer font-medium">Sign up</span>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import {
   Shield,
   User,
   ArrowRight
} from 'lucide-react';


export default function Login({
   setAuth,
   setRole,
   setEmail
}) {

   const navigate = useNavigate();

   const [emailInput, setEmailInput] =
      useState('');

   const [password, setPassword] =
      useState('');

   const [selectedRole, setSelectedRole] =
      useState('Member');

   const [error, setError] =
      useState('');

   const [loading, setLoading] =
      useState(false);


   // LOGIN
   const handleLogin = async (e) => {

      e.preventDefault();

      setError('');

      setLoading(true);

      try {

         const res = await fetch(
            'http://localhost:5000/api/auth/login',
            {
               method: 'POST',

               headers: {
                  'Content-Type': 'application/json'
               },

               body: JSON.stringify({

                  email: emailInput,

                  password,

                  role: selectedRole

               })
            }
         );

         const data = await res.json();


         // SUCCESS
         if (res.ok) {

            // SAVE TO APP STATE
            setRole(data.user.role);

            setEmail(data.user.email);

            setAuth(true);


            // SAVE TO LOCAL STORAGE
            localStorage.setItem(
               'isAuth',
               'true'
            );

            localStorage.setItem(
               'userRole',
               data.user.role
            );

            localStorage.setItem(
               'userEmail',
               data.user.email
            );

            localStorage.setItem(
               'currentUser',
               JSON.stringify(data.user)
            );


            // REDIRECT
            navigate('/dashboard');
         }

         // ERROR
         else {

            setError(
               data.error || 'Login failed'
            );
         }

      }

      catch (err) {

         console.log(err);

         setError(
            'Server error. Please try again.'
         );
      }

      finally {

         setLoading(false);
      }
   };


   // FORGOT PASSWORD
   const handleForgotInfo = () => {

      alert(
         'Please contact admin to reset your password.'
      );
   };


   return (

      <div className="min-h-screen flex bg-background">

         {/* LEFT SIDE */}
         <div className="hidden lg:flex lg:w-1/2 bg-surfaceHover relative items-center justify-center overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 z-0"></div>

            <img
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
               alt="Office Collaboration"
               className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />

            <div className="z-10 text-center px-10">

               <h1 className="text-5xl font-bold text-white mb-6">
                  Empower Your Team
               </h1>

               <p className="text-xl text-gray-300 max-w-md mx-auto">
                  Manage projects, track completion,
                  and elevate collaboration.
               </p>

            </div>

         </div>


         {/* RIGHT SIDE */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

            <motion.div

               initial={{
                  opacity: 0,
                  x: 30
               }}

               animate={{
                  opacity: 1,
                  x: 0
               }}

               className="w-full max-w-md"
            >

               <div className="mb-8">

                  <h2 className="text-3xl font-bold text-white mb-2">
                     Welcome Back
                  </h2>

                  <p className="text-gray-400">
                     Sign in to continue.
                  </p>

               </div>


               <form
                  onSubmit={handleLogin}
                  className="space-y-6"
               >

                  {/* ROLE */}
                  <div>

                     <label className="block text-sm font-medium text-gray-400 mb-4">
                        Select Role
                     </label>

                     <div className="grid grid-cols-2 gap-4">

                        {/* ADMIN */}
                        <button

                           type="button"

                           onClick={() =>
                              setSelectedRole('Admin')
                           }

                           className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${selectedRole === 'Admin'
                                 ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                 : 'border-gray-800 bg-surface hover:bg-surfaceHover hover:border-gray-600'
                              }`}
                        >

                           <Shield
                              className={
                                 selectedRole === 'Admin'
                                    ? 'text-primary'
                                    : 'text-gray-400'
                              }
                              size={28}
                           />

                           <span
                              className={`mt-2 font-semibold ${selectedRole === 'Admin'
                                    ? 'text-white'
                                    : 'text-gray-400'
                                 }`}
                           >
                              Admin
                           </span>

                        </button>


                        {/* MEMBER */}
                        <button

                           type="button"

                           onClick={() =>
                              setSelectedRole('Member')
                           }

                           className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${selectedRole === 'Member'
                                 ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                 : 'border-gray-800 bg-surface hover:bg-surfaceHover hover:border-gray-600'
                              }`}
                        >

                           <User
                              className={
                                 selectedRole === 'Member'
                                    ? 'text-primary'
                                    : 'text-gray-400'
                              }
                              size={28}
                           />

                           <span
                              className={`mt-2 font-semibold ${selectedRole === 'Member'
                                    ? 'text-white'
                                    : 'text-gray-400'
                                 }`}
                           >
                              Member
                           </span>

                        </button>

                     </div>

                  </div>


                  {/* ERROR */}
                  {
                     error && (

                        <div className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">

                           {error}

                        </div>
                     )
                  }


                  {/* EMAIL */}
                  <div>

                     <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                     </label>

                     <input

                        type="email"

                        value={emailInput}

                        onChange={(e) =>
                           setEmailInput(e.target.value)
                        }

                        className="w-full bg-surface border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"

                        placeholder="name@company.com"

                        required
                     />

                  </div>


                  {/* PASSWORD */}
                  <div>

                     <div className="flex justify-between items-center mb-2">

                        <label className="block text-sm font-medium text-gray-400">
                           Password
                        </label>

                        <span
                           onClick={handleForgotInfo}
                           className="text-sm text-primary hover:underline cursor-pointer"
                        >
                           Forgot Password?
                        </span>

                     </div>

                     <input

                        type="password"

                        value={password}

                        onChange={(e) =>
                           setPassword(e.target.value)
                        }

                        className="w-full bg-surface border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"

                        placeholder="••••••••"

                        required
                     />

                  </div>


                  {/* SUBMIT */}
                  <button

                     type="submit"

                     disabled={loading}

                     className="w-full group flex items-center justify-center py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition transform hover:-translate-y-0.5 disabled:opacity-50"

                  >

                     {
                        loading
                           ? 'Signing In...'
                           : 'Sign In'
                     }

                     <ArrowRight
                        size={18}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                     />

                  </button>

               </form>


               {/* SIGNUP */}
               <p className="text-center text-gray-400 mt-8 text-sm">

                  Don't have an account?

                  <span

                     onClick={() =>
                        navigate('/signup')
                     }

                     className="text-white hover:text-primary transition cursor-pointer font-medium ml-2"
                  >

                     Sign up

                  </span>

               </p>

            </motion.div>

         </div>

      </div>
   );
}