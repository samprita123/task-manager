import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import {
   Shield,
   User,
   ArrowRight
} from 'lucide-react';


export default function Signup({
   setAuth,
   setRole,
   setEmail
}) {

   const navigate = useNavigate();

   const [name, setName] =
      useState('');

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


   // SIGNUP FUNCTION
   const handleSignup = async (e) => {

      e.preventDefault();

      setError('');

      // VALIDATION
      if (
         !name.trim() ||
         !emailInput.trim() ||
         !password.trim()
      ) {
         return setError(
            'All fields are required.'
         );
      }

      const emailRegex =
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailInput)) {
         return setError(
            'Invalid email address.'
         );
      }

      if (password.length < 6) {
         return setError(
            'Password must be at least 6 characters.'
         );
      }

      setLoading(true);

      try {

         const res = await fetch(
            'http://localhost:5000/api/auth/signup',
            {
               method: 'POST',

               headers: {
                  'Content-Type': 'application/json'
               },

               body: JSON.stringify({

                  name,

                  email: emailInput,

                  password,

                  role: selectedRole

               })
            }
         );

         const data = await res.json();


         // SUCCESS
         if (res.ok) {

            // SAVE STATE
            setRole(data.user.role);

            setEmail(data.user.email);

            setAuth(true);


            // SAVE LOCAL STORAGE
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
               data.error || 'Signup failed'
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


   return (

      <div className="min-h-screen flex bg-background">

         {/* LEFT FORM */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">

            <motion.div

               initial={{
                  opacity: 0,
                  x: -30
               }}

               animate={{
                  opacity: 1,
                  x: 0
               }}

               className="w-full max-w-md"
            >

               <div className="mb-8">

                  <h2 className="text-3xl font-bold text-white mb-2">
                     Join Us
                  </h2>

                  <p className="text-gray-400">
                     Create your account and start managing projects.
                  </p>

               </div>


               <form
                  onSubmit={handleSignup}
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


                  {/* NAME */}
                  <div>

                     <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                     </label>

                     <input

                        type="text"

                        value={name}

                        onChange={(e) =>
                           setName(e.target.value)
                        }

                        className="w-full bg-surface border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"

                        placeholder="John Doe"

                        required
                     />

                  </div>


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

                     <label className="block text-sm font-medium text-gray-400 mb-2">
                        Password
                     </label>

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


                  {/* BUTTON */}
                  <button

                     type="submit"

                     disabled={loading}

                     className="w-full group flex items-center justify-center py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition transform hover:-translate-y-0.5 disabled:opacity-50"

                  >

                     {
                        loading
                           ? 'Creating Account...'
                           : 'Create Account'
                     }

                     <ArrowRight
                        size={18}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                     />

                  </button>

               </form>


               {/* LOGIN */}
               <p className="text-center text-gray-400 mt-8 text-sm">

                  Already have an account?

                  <span

                     onClick={() =>
                        navigate('/login')
                     }

                     className="text-white hover:text-primary transition cursor-pointer font-medium ml-2"
                  >

                     Sign in

                  </span>

               </p>

            </motion.div>

         </div>


         {/* RIGHT SIDE */}
         <div className="hidden lg:flex lg:w-1/2 bg-surfaceHover relative items-center justify-center overflow-hidden order-1 lg:order-2">

            <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 to-indigo-500/20 z-0"></div>

            <img
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
               alt="Office Team"
               className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />

            <div className="z-10 text-center px-10">

               <h1 className="text-5xl font-bold text-white mb-6">
                  Scale Operations
               </h1>

               <p className="text-xl text-gray-300 max-w-md mx-auto">
                  Create teams, assign projects,
                  and manage workflows seamlessly.
               </p>

            </div>

         </div>

      </div>
   );
}
