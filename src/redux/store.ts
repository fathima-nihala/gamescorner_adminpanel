import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.ts';
import authReducer from '../slices/authSlice';


 const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;