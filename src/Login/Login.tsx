import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="flex items-center justify-center w-full h-full px-2 mt-16 mb-16 md:px-10 lg:mb-10 lg:items-center lg:justify-center">
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded px-8 pt-6 pb-8 mt-[10vh] w-full max-w-full flex-col items-center lg:max-w-[520px] 2xl:max-w-[650px]">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`bg-orange-600 hover:bg-orange-700 text-white  font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;