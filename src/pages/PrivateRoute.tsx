// import { Navigate } from 'react-router-dom';

// interface PrivateRouteProps {
//   children: JSX.Element;
// }

// const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
//   return token ? children : <Navigate to="/auth/signin" />;
// };

// export default PrivateRoute;


import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  if (!token) {
    // Redirect to login page if no token is found
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
