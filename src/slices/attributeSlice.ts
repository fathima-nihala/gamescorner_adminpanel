
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../redux/store';


const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

// Define the Attribute type
export interface Attribute {
  _id: string;
  name: string;
  value: string[];
  createdAt: string;
  updatedAt: string;
}

interface EditAttributeValuePayload {
  id: string;
  index: number;
  newValue: string;
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
export const updateAttribute = createAsyncThunk(
  'attributes/update',
  async ({ id, updatedAttribute }: { id: string, updatedAttribute: { name: string, value: string[] } }, thunkAPI) => {
    try {
      const response = await api.put(`/attributes/${id}`, updatedAttribute);
      return response.data.attribute;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to update attribute');
    }
  }
);

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
export const addAttributeValue = createAsyncThunk(
  'attributes/addValue',
  async ({ id, value }: { id: string, value: string }, thunkAPI) => {
    try {
      const response = await api.post(`/attributes/${id}/value`, { value });
      return response.data.attribute;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add attribute value');
    }
  }
);

// Edit an attribute value
export const editAttributeValue = createAsyncThunk<
  Attribute,
  EditAttributeValuePayload,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'attributes/editValue',
  async ({ id, index, newValue }, thunkAPI) => {
    try {
      const response = await api.patch(`/attributes/${id}/value`, { index, newValue });
      return response.data.attribute;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update attribute value');
    }
  }
);


// Delete an attribute value
export const deleteAttributeValue = createAsyncThunk(
  'attributes/deleteValue',
  async ({ id, index }: { id: string, index: number }, thunkAPI) => {
    try {
      const response = await api.delete(`/attributes/${id}/value`, { data: { index } });
      return response.data.attribute;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete attribute value');
    }
  }
);

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
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttributes.fulfilled, (state, action: PayloadAction<Attribute[]>) => {
        state.loading = false;
        state.attributes = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAttribute.fulfilled, (state, action: PayloadAction<Attribute>) => {
        state.loading = false;
        state.attributes.push(action.payload);
      })
      .addCase(addAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAttribute.fulfilled, (state, action: PayloadAction<Attribute>) => {
        state.loading = false;
        const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
        if (index !== -1) state.attributes[index] = action.payload;
      })
      .addCase(updateAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAttribute.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.attributes = state.attributes.filter(attr => attr._id !== action.payload);
      })
      .addCase(deleteAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAttributeValue.fulfilled, (state, action: PayloadAction<Attribute>) => {
        state.loading = false;
        const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
        if (index !== -1) state.attributes[index] = action.payload;
      })
      .addCase(addAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //edit attribute values
      .addCase(editAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAttributeValue.fulfilled, (state, action: PayloadAction<Attribute>) => {
        state.loading = false;
        const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
        if (index !== -1) state.attributes[index] = action.payload;
      })
      .addCase(editAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      })

      .addCase(deleteAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAttributeValue.fulfilled, (state, action: PayloadAction<Attribute>) => {
        state.loading = false;
        const index = state.attributes.findIndex(attr => attr._id === action.payload._id);
        if (index !== -1) state.attributes[index] = action.payload;
      })
      .addCase(deleteAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Actions and reducer export
export const { clearError } = attributeSlice.actions;
export default attributeSlice.reducer;