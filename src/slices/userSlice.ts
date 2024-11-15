import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
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
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const response = await api.put('/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
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

// Async thunk for fetching users with role 'user'
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get('/staffs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.users;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  },
);

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.allusers; // Assuming the response contains 'allusers'
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      return rejectWithValue(
        error.response?.data || 'Failed to fetch all users',
      );
    }
  },
);

// Edit Staff Async Thunk
export const editStaff = createAsyncThunk(
  'user/editStaff',
  async (
    { id, formData }: { id: string | undefined; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.put(`/staff/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.user; // Assuming the response contains the updated user data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to update staff member',
      );
    }
  },
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      await api.delete(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  },
);

// Async thunk for user registration
export const regUser = createAsyncThunk<
  any, 
  RegistrationData, 
  { rejectValue: string } 
>(
  'user/regUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.user;
    } catch (error: any) {
      console.error('Error during registration:', error);
      return rejectWithValue(error.response?.data || 'Failed to register user');
    }
  }
);

interface ProfileState {
  admin: {
    _id: string;
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    profession: string;
    profile: string;
    bg_image: string;
    about_me: string;
    phone: string;
    passwordChangedAt: Date;
    resetPasswordOTP: string;
    resetPasswordOTPExpires: Date;
    role: String;
  } | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
  users: User[];
  adminusers: AdminUser[];
  registrationSuccess: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

const initialState: ProfileState = {
  admin: null, // renamed from profile to admin
  loading: false,
  error: null,
  updateSuccess: false,
  users: [],
  adminusers: [],
  registrationSuccess: false,
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
      state.users = [];
      state.adminusers = [];
      state.registrationSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
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
      })

      //update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

      // Fetch Users with role 'user'
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Set users list
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminusers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //edit staff
      .addCase(editStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editStaff.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        );
        state.updateSuccess = true;
      })
      .addCase(editStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.payload;
        state.users = state.users.filter((user) => user._id !== deletedUserId);
        state.updateSuccess = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Handle regUser actions
    .addCase(regUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    })
    .addCase(regUser.fulfilled, (state, action) => {
      state.loading = false;
      state.registrationSuccess = true;
      state.users.push(action.payload); 
    })
    .addCase(regUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.registrationSuccess = false;
    });
  },
});

export const { clearProfile, resetUpdateSuccess, resetRegistrationSuccess  } = userSlice.actions;
export default userSlice.reducer;
