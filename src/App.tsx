import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Brands from './pages/Product/Brands';
import FormLayout from './pages/Product/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Order';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import PrivateRoute from './pages/PrivateRoute';
import Login from './Login/Login';
import Category from './pages/Product/Category';
import CategoryDetails from './pages/Product/CategoryDetails';
import Attributes from './pages/Product/Attributes';
import AttributeDetails from './pages/Product/AttributeDetails';
import ForgotPassword from './Login/ForgotPassword';
import VerifyOtp from './Login/VerifyOtp';
import Resetpassword from './Login/Resetpassword';
import AddProduct from './pages/Product/AddProduct';
import Color from './pages/Product/Color';
import AllProducts from './pages/Product/AllProducts';
import Customers from './pages/Customers';
import Addtostaff from './pages/Addtostaff'
import Editstaff from './pages/Editstaff';
import Orderpage from './pages/Orderpage';
import OrdersTable from './pages/Order';



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
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Signin | Games Corner" />
            <Login />
          </>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <>
            <PageTitle title="Forgot Password | Games Corner" />
            <ForgotPassword />
          </>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <>
            <PageTitle title="Verify Otp | Games Corner" />
            <VerifyOtp />
          </>
        }
      />
      <Route
        path="/reset-password"
        element={
          <>
            <PageTitle title="Verify Otp | Games Corner" />
            <Resetpassword />
          </>
        }
      />


      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
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
                  path="/product/product-brand"
                  element={
                    <>
                      <PageTitle title="Brand | Games Corner" />
                      <Brands />
                    </>
                  }
                />
                <Route
                  path="/product/product-color"
                  element={
                    <>
                      <PageTitle title="Color | Games Corner" />
                      <Color />
                    </>
                  }
                />
                <Route
                  path="/product/product-category"
                  element={
                    <>
                      <PageTitle title="Product Category | Games Corner" />
                      <Category />
                    </>
                  }
                />
                <Route
                  path="/category-details/:id"
                  element={
                    <>
                      <PageTitle title="Category Details | Games Corner" />
                      <CategoryDetails />
                    </>
                  }
                />
                <Route
                  path="/product/product-attributes"
                  element={
                    <>
                      <PageTitle title="Attributes | Games Corner" />
                      <Attributes />
                    </>
                  }
                />
                <Route
                  path="/attribute-details/:id"
                  element={
                    <>
                      <PageTitle title="Attribute Details | Games Corner" />
                      <AttributeDetails />
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
                  path="/product/all-product"
                  element={
                    <>
                      <PageTitle title="Products | Games Corner" />
                      <AllProducts />
                    </>
                  }
                />
                <Route
                  path="/product/product-addproduct"
                  element={
                    <>
                      <PageTitle title="Add Product | Games Corner" />
                      <AddProduct />
                    </>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <>
                      <PageTitle title="Order | Games Corner" />
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


                <Route
                  path="/Customers"
                  element={
                    <>
                      <PageTitle title="Customers | Games Corner" />
                      <Customers />
                    </>
                  }
                />





                <Route
                  path="/all_staff"
                  element={
                    <>
                      <PageTitle title="All Staff | Games Corner" />
                      <Addtostaff />
                    </>
                  }
                />
                <Route
                  path="/edit-staff/:id"
                  element={
                    <>
                      <PageTitle title="Edit Staff | Games Corner" />
                      <Editstaff />
                    </>
                  }
                />




                <Route
                  path="/orders/:id"
                  element={
                    <>
                      <PageTitle title="Orderpage | Games Corner" />
                      <Orderpage />
                    </>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <>
                      <PageTitle title="Ordertable | Games Corner" />
                      <OrdersTable />
                    </>
                  }
                />



              </Routes>


            </DefaultLayout>
          </PrivateRoute>
        }
      />

      {/* Redirect any unknown routes to Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
