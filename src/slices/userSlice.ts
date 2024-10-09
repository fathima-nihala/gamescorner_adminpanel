import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL

});



export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error); // Debugging line
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  },
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to update profile',
      );
    }
  },
);

interface ProfileState {
  admin: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    profession:string;
    profile:String,
    bg_image:String,
    about_me:String,
    phone?: string;
    passwordChangedAt?: Date;
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
  } | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean; // For indicating if update was successful
}

const initialState: ProfileState = {
  admin: null, // renamed from profile to admin
  loading: false,
  error: null,
  updateSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
      state.updateSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { admin } = action.payload;
        state.admin = admin;

      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile, resetUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;
