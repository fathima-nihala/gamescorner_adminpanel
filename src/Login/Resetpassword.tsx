import React, { useState, FormEvent } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logo/games.png';
import { useSnackbar } from 'notistack';


const Resetpassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { loading } = useSelector((state: RootState) => state.auth);

  const email = location.state?.email;
  const resetPasswordOTP = location.state?.resetPasswordOTP;


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const otpString = Array.isArray(resetPasswordOTP) ? resetPasswordOTP.join('') : resetPasswordOTP;
      await dispatch(resetPassword({ email, resetPasswordOTP: otpString, password, confirmPassword })).unwrap();
      enqueueSnackbar('Password changed successfully', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });

      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred while resetting the password.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000
      });
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-4 h-12" />
        <p className="text-gray-600 text-center">No worries, we'll handle it.</p>
        <h2 className="text-2xl font-bold text-center mb-8">Reset Password</h2>
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="mt-2 text-sm text-center text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-950 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {/* {success && <div className="text-green-500 text-center mt-4">Password reset successfully!</div>} */}
      </div>
    </div>
  );
};

export default Resetpassword;

