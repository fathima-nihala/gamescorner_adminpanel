import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/', // Adjust based on your backend setup
});

// Initial auth state
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  user: any | null; // You can create a more specific type if needed
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  user: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials); // Login API
      return response.data; // Expected to contain { token, user }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
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
        state.token = action.payload.token; // Store JWT token
        state.user = action.payload.user; // Store user details
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
