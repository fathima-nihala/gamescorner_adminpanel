import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import logo from '../images/logo/games.png';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            dispatch(forgotPassword(email));
        }
        else {
            enqueueSnackbar('Please enter a valid email.', { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
        if (successMessage) {
            enqueueSnackbar(successMessage, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            navigate('/verify-otp', { state: { email } });
        }
    }, [error, successMessage, enqueueSnackbar, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-12" />
                <h2 className="text-2xl font-bold text-center text-gray-700">Forgot Password</h2>
                <p className="text-gray-600 text-center">No worries, we'll handle it.</p>
                <form onSubmit={handleSubmit} className="mt-10">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    {/* {loading && <p className="mt-2 text-sm text-center text-blue-500">Sending OTP...</p>}
                    {!loading && !error && <p className="mt-2 text-sm text-center text-green-500">OTP send to {email}</p>}
                    {error && <p className="mt-2 text-sm text-center text-red-500">{error || 'Failed to send OTP'}</p>} */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 text-white bg-blue-950 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                        disabled={loading}
                    >
                        {/* Send OTP */}
                        {loading ? 'Sending OTP...' : `OTP send to ${email}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
