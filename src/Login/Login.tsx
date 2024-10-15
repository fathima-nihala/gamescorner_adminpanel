// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../slices/authSlice';
// import { AppDispatch, RootState } from '../../src/redux/store';
// import { useNavigate } from 'react-router-dom';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error, token } = useSelector((state: RootState) => state.auth);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       navigate('/dashboard'); 
//     }
//   }, [token, navigate]);


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <div className="flex items-center justify-center w-full h-full px-2 mt-16 mb-16 md:px-10 lg:mb-10 lg:items-center lg:justify-center">
//       <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded px-8 pt-6 pb-8 mt-[10vh] w-full max-w-full flex-col items-center lg:max-w-[520px] 2xl:max-w-[650px]">
//         <h2 className="text-center text-2xl font-bold mb-6">Login</h2>

//         {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter your email"
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter your password"
//           />
//         </div>

//         <div className="flex items-center justify-center">
//           <button
//             type="submit"
//             disabled={loading}
//             className={`bg-orange-600 hover:bg-orange-700 text-white  font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50' : ''}`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { AppDispatch, RootState } from '../../src/redux/store';
import { useNavigate } from 'react-router-dom';
import img from '../images/logo/06.jpg'; 
import logo from '../images/logo/games.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg w-full max-w-4xl rounded-lg">
        {/* Left Side Image Section */}
        <div className="md:block w-full md:w-1/2 bg-gray-200 flex items-center justify-center">
          <img
            src={img}
            alt="Decorative"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side Login Form */}
        <div className="w-full md:w-1/2 p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="mx-auto w-36" />
          </div>

          <h2 className="text-2xl font-bold text-purple-700 text-center">
            WELCOME BACK!
          </h2>
          <p className="text-gray-600 text-center">Login to your account</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                placeholder="admin@gamescorner.qa"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                  placeholder="Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiFillEye/>
                  ) : (
                    <AiFillEyeInvisible/>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
               
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
