import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface Category {
  _id: string;
  parent_category: string;
  name: string[];
  image: string;
  icon: string;
  cover_image: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (parent_category: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/category', {
        params: { parent_category },
      });
      return response.data.categories;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories',
      );
    }
  },
);

// Delete category by ID
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/category/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category',
      );
    }
  },
);

// Add new category
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.category;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add category',
      );
    }
  },
);

// Update existing category
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/category/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.category;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category',
      );
    }
  },
);

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearErrorMessage: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      },
    );
    builder.addCase(
      fetchCategories.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // Delete category
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteCategory.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload,
        );
        state.successMessage = 'Category deleted successfully!';
      },
    );
    builder.addCase(
      deleteCategory.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // Add category
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.successMessage = 'Category added successfully!';
      },
    );
    builder.addCase(
      addCategory.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // Update category
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.successMessage = 'Category updated successfully!';
      },
    );
    builder.addCase(
      updateCategory.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
});

// Export the reducer and actions
export const { clearSuccessMessage, clearErrorMessage } = categorySlice.actions;

export default categorySlice.reducer;
