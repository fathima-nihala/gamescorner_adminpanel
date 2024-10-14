import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.ts';
import authReducer from '../slices/authSlice';
import brandReducer from '../slices/brandSlice.ts';
import categoryReducer from '../slices/categorySlice.ts';

 const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    brands: brandReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;