import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../slices/authSlice';
import { RootState, AppDispatch } from '../redux/store'; 
import logo from '../images/logo/games.png';
import { useLocation, useNavigate } from 'react-router-dom'; 

const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const dispatch = useDispatch<AppDispatch>(); 
    const navigate = useNavigate(); 
    const { loading, error, success } = useSelector((state: RootState) => state.auth);
    
    // Use useLocation to access location object
    const location = useLocation();
    const email = location.state?.email; 

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase(); 
        if (value.length <= 1 && /^[0-9A-Z]*$/.test(value)) { 
            const newOtp = [...otp];
            newOtp[index] = value; 
            setOtp(newOtp);

            // Focus next input if value is entered
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            return alert('Please enter a valid 6-character OTP');
        }

        dispatch(verifyOtp({ email, otp: otpString }));
    };

    // Effect to navigate on success
    useEffect(() => {
        if (success) {
            navigate('/reset-password', { state: { email , resetPasswordOTP: otp}});
        }
    }, [success, navigate, email, otp]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-12" />
                </div>
                <p className="text-gray-600 text-center mb-8">No worries, we'll handle it.</p>
                <h2 className="text-2xl font-bold text-center mb-8">OTP Verification</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-6 gap-4 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                id={`otp-${index}`}
                                value={digit}
                                onChange={(event) => handleInputChange(index, event)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                className="w-full h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="●"
                                maxLength={1} 
                            />
                        ))}
                    </div>
                    {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-lg hover:bg-blue-700"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>

                {success && <div className="text-green-500 text-center mt-4">OTP Verified Successfully!</div>}
            </div>
        </div>
    );
};

export default VerifyOtp;
