import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

interface Color {
  _id: string;
  name: string;
  color_code: string;
}

interface ColorsState {
  colors: Color[];
  loading: boolean;
  error: string | null;
}

const initialState: ColorsState = {
  colors: [],
  loading: false,
  error: null,
};

// Thunk for adding a color
export const addColor = createAsyncThunk(
  'colors/addColor',
  async (
    colorData: { name: string; color_code: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/color', colorData);
      return response.data.color;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add color',
      );
    }
  },
);

// Thunk for fetching colors with pagination
export const getColors = createAsyncThunk(
  'colors/getColors',
  async (
    query: { page?: number; limit?: number; name?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get('/color', { params: query });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// Thunk for deleting a color
export const deleteColor = createAsyncThunk(
  'colors/deleteColor',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/color/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// Thunk for editing a color
export const editColor = createAsyncThunk(
  'colors/editColor',
  async (
    {
      id,
      colorData,
    } // }: { id: string; colorData: { name: string; color_code: string } },
    : { id: string; colorData: FormData }, 
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/color/${id}`, colorData);
      return response.data.color;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// Thunk for fetching all colors
export const getAllColors = createAsyncThunk(
  'colors/getAllColors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/color/all');
      return response.data.color;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// Create the slice
const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors.push(action.payload);
      })
      .addCase(addColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload.color;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.colors = state.colors.filter(
          (color) => color._id !== action.payload,
        );
      })
      .addCase(editColor.fulfilled, (state, action) => {
        const index = state.colors.findIndex(
          (color) => color._id === action.payload.id,
        );
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
      })
      .addCase(getAllColors.fulfilled, (state, action) => {
        state.colors = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearErrors } = colorSlice.actions;
export default colorSlice.reducer;
