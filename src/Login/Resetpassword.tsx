import  { useState, FormEvent } from "react";
import logo from '../images/logo/games.png';

const Resetpassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && confirmPassword && email === confirmPassword) {
      setMessage(`OTP sent to ${email}`);
      setEmail("");
      setConfirmPassword("");
    } else if (email !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-4 h-12" />

        <p className="text-gray-600 text-center">No worries, we'll handle it.</p>
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              id="email" // Consider changing this ID to "new-password" for clarity
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {message && (
            <p className="mt-2 text-sm text-center text-red-500">{message}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-950 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;


