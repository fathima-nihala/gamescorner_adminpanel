import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

// Define the Attribute type
interface Attribute {
  _id: string;
  name: string;
  value: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the initial state type
interface AttributeState {
  attributes: Attribute[];
  attribute: Attribute | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AttributeState = {
  attributes: [],
  attribute: null,
  loading: false,
  error: null,
};

// Async actions

// Fetch all attributes
export const fetchAttributes = createAsyncThunk('attributes/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/attributes');
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch attributes');
  }
});

// Add a new attribute
export const addAttribute = createAsyncThunk('attributes/add', async (newAttribute: { name: string, value: string[] }, thunkAPI) => {
  try {
    const response = await api.post('/attributes', newAttribute);
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add attribute');
  }
});

// Update an attribute
export const updateAttribute = createAsyncThunk('attributes/update', async ({ id, updatedAttribute }: { id: string, updatedAttribute: { name: string, value: string[] } }, thunkAPI) => {
  try {
    const response = await api.put(`/attributes/${id}`, updatedAttribute);
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to update attribute');
  }
});

// Delete an attribute
export const deleteAttribute = createAsyncThunk('attributes/delete', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/attributes/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete attribute');
  }
});

// Add an attribute value
export const addAttributeValue = createAsyncThunk('attributes/addValue', async ({ id, value }: { id: string, value: string }, thunkAPI) => {
  try {
    const response = await api.post(`/attributes/${id}/value`, { value });
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add attribute value');
  }
});

// Edit an attribute value
export const editAttributeValue = createAsyncThunk('attributes/editValue', async ({ id, index, newValue }: { id: string, index: number, newValue: string }, thunkAPI) => {
  try {
    const response = await api.patch(`/attributes/${id}/value`, { index, newValue });
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to update attribute value');
  }
});

// Delete an attribute value
export const deleteAttributeValue = createAsyncThunk('attributes/deleteValue', async ({ id, index }: { id: string, index: number }, thunkAPI) => {
  try {
    const response = await api.delete(`/attributes/${id}/value`, { data: { index } });
    return response.data.attribute;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete attribute value');
  }
});

// Slice
const attributeSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all attributes
    builder.addCase(fetchAttributes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAttributes.fulfilled, (state, action) => {
      state.loading = false;
      state.attributes = action.payload;
    });
    builder.addCase(fetchAttributes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add a new attribute
    builder.addCase(addAttribute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAttribute.fulfilled, (state, action) => {
      state.loading = false;
      state.attributes.push(action.payload);
    });
    builder.addCase(addAttribute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update an attribute
    builder.addCase(updateAttribute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAttribute.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
      if (index >= 0) state.attributes[index] = action.payload;
    });
    builder.addCase(updateAttribute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete an attribute
    builder.addCase(deleteAttribute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAttribute.fulfilled, (state, action) => {
      state.loading = false;
      state.attributes = state.attributes.filter(attr => attr._id !== action.payload);
    });
    builder.addCase(deleteAttribute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add attribute value
    builder.addCase(addAttributeValue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAttributeValue.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
      if (index >= 0) state.attributes[index] = action.payload;
    });
    builder.addCase(addAttributeValue.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit attribute value
    builder.addCase(editAttributeValue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editAttributeValue.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
      if (index >= 0) state.attributes[index] = action.payload;
    });
    builder.addCase(editAttributeValue.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete attribute value
    builder.addCase(deleteAttributeValue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAttributeValue.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
      if (index >= 0) state.attributes[index] = action.payload;
    });
    builder.addCase(deleteAttributeValue.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

// Actions and reducer export
export const { clearError } = attributeSlice.actions;
export default attributeSlice.reducer;
