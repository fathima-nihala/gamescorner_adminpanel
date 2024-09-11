import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Games Corner" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Games Corner" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Games Corner" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Games Corner" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Games Corner" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Games Corner" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Games Corner" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Games Corner" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Games Corner" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Games Corner" />
              <Buttons />
            </>
          }
        />
        
      </Routes>
    </DefaultLayout>
  );
}

export default App;


// import { useEffect, useState } from 'react';
// import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';

// import Calendar from './pages/Calendar';
// import Chart from './pages/Chart';
// import ECommerce from './pages/Dashboard/ECommerce';
// import FormElements from './pages/Form/FormElements';
// import FormLayout from './pages/Form/FormLayout';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Tables from './pages/Tables';
// import Alerts from './pages/UiElements/Alerts';
// import Buttons from './pages/UiElements/Buttons';
// import DefaultLayout from './layout/DefaultLayout';
// import Login from './Login/Login';

// function App() {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
  
//   // Simulate token check (you can replace this with an actual token check)
//   const isAuthenticated = () => !!localStorage.getItem('token'); // Check if token exists in localStorage

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     // Simulate a delay for loading
//     setTimeout(() => setLoading(false), 1000);

//     // Redirect if not authenticated
//     if (!isAuthenticated()) {
//       navigate('/auth/signin'); // Redirect to SignIn if token is not available
//     }
//   }, [navigate]);

//   return loading ? (
//     <Loader />
//   ) : (
//     <DefaultLayout>
//       <Routes>
//         <Route
//           index
//           element={
//             isAuthenticated() ? (
//               <>
//                 <PageTitle title="Games Corner" />
//                 <ECommerce />
//               </>
//             ) : (
//               <Login /> // Redirect to SignIn if not authenticated
//             )
//           }
//         />
//         <Route
//           path="/calendar"
//           element={
//             <>
//               <PageTitle title="Calendar | Games Corner" />
//               <Calendar />
//             </>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <>
//               <PageTitle title="Profile | Games Corner" />
//               <Profile />
//             </>
//           }
//         />
//         <Route
//           path="/forms/form-elements"
//           element={
//             <>
//               <PageTitle title="Form Elements | Games Corner" />
//               <FormElements />
//             </>
//           }
//         />
//         <Route
//           path="/forms/form-layout"
//           element={
//             <>
//               <PageTitle title="Form Layout | Games Corner" />
//               <FormLayout />
//             </>
//           }
//         />
//         <Route
//           path="/tables"
//           element={
//             <>
//               <PageTitle title="Tables | Games Corner" />
//               <Tables />
//             </>
//           }
//         />
//         <Route
//           path="/settings"
//           element={
//             <>
//               <PageTitle title="Settings | Games Corner" />
//               <Settings />
//             </>
//           }
//         />
//         <Route
//           path="/chart"
//           element={
//             <>
//               <PageTitle title="Basic Chart | Games Corner" />
//               <Chart />
//             </>
//           }
//         />
//         <Route
//           path="/ui/alerts"
//           element={
//             <>
//               <PageTitle title="Alerts | Games Corner" />
//               <Alerts />
//             </>
//           }
//         />
//         <Route
//           path="/ui/buttons"
//           element={
//             <>
//               <PageTitle title="Buttons | Games Corner" />
//               <Buttons />
//             </>
//           }
//         />
       
//       </Routes>
//     </DefaultLayout>
//   );
// }

// export default App;
