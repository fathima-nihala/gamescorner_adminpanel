import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.ts';
import authReducer from '../slices/authSlice';
import brandReducer from '../slices/brandSlice.ts';
import categoryReducer from '../slices/categorySlice.ts';
import attributeReducer from '../slices/attributeSlice.ts';
import countryReducer from '../slices/countrSlice.ts'; 
import productReducer from '../slices/productSlice.ts';
import colorReducer from '../slices/colorSlice.ts';
import customerReducer from '../slices/customerSlice'
import orderReducer from '../slices/OrderSlice.ts';
import dashboardReducer from '../slices/dashboardSlice.ts'
import notificationReducer from '../slices/notificationSlice.ts'


 const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    brands: brandReducer,
    category: categoryReducer,
    attribute: attributeReducer,
    country: countryReducer,
    product: productReducer,
    color: colorReducer,
    customer: customerReducer,
    orders:orderReducer,
    dashboard: dashboardReducer,
    notify: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




export default store;