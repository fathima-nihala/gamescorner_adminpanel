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
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import PrivateRoute from './pages/PrivateRoute';
import Login from './Login/Login';
import { AddProduct } from './pages/Product/AddProduct';
import Category from './pages/Product/Category';
import CategoryDetails from './pages/Product/CategoryDetails';

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
                  path="/forms/form-layout"
                  element={
                    <>
                      <PageTitle title="Form Layout | Games Corner" />
                      <FormLayout />
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
          </PrivateRoute>
        }
      />

      {/* Redirect any unknown routes to Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
