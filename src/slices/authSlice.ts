import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL, 
});


const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.get('/logout');
      setToken(null);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Initial auth state
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  user: any | null; 
  successMessage: string | null;
  success: boolean;

}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  user: null,
  successMessage: null,
  success: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials); 
      if (response.data && response.data.token) {
        setToken(response.data.token);
      }
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async thunk for sending OTP for password reset
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/password_forgot', { email });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to send OTP');
    }
  }
);

// verifying OTP
export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/verify_otp', {
        email,
        resetPasswordOTP: otp,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// resetting the password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, resetPasswordOTP, password, confirmPassword }: { email: string; resetPasswordOTP: string; password: string; confirmPassword: string; }, { rejectWithValue }) => {
    try {
      const response = await api.post('/password_reset', {
        email,
        resetPasswordOTP,
        password,
        confirmPassword,
      });
      return response.data.message; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to reset password');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; 
        state.user = action.payload.user; 
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //forget pass
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload; 
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      })
      //verify otp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.successMessage = action.payload.message; // Use message from the response
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      //reset pass
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload; 
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

