import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface Attribute {
  _id: string;
  name: string;
  value: AttributeValue[];
  createdAt: string;
  updatedAt: string;
}

// Define the Attribute type
export interface AttributeValue {
  _id: string;
  value: string;
}

// Define the initial state type
interface AttributeState {
  attributes: Attribute[];
  attribute: Attribute | null;
  attributeValues: AttributeValue[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AttributeState = {
  attributes: [],
  attribute: null,
  attributeValues: [],
  loading: false,
  error: null,
};

// Fetch all attributes
export const fetchAttributes = createAsyncThunk(
  'attributes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ attribute: Attribute[] }>('/attributes');
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attributes',
      );
    }
  },
);

// Add a new attribute
export const addAttribute = createAsyncThunk(
  'attributes/add',
  async (
    newAttribute: { name: string; value: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<{ attribute: Attribute }>(
        '/attributes',
        newAttribute,
      );
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add attribute',
      );
    }
  },
);

// Update an attribute
export const updateAttribute = createAsyncThunk(
  'attributes/update',
  async (
    {
      id,
      updatedAttribute,
    }: { id: string; updatedAttribute: { name: string; value: string[] } },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<{ attribute: Attribute }>(
        `/attributes/${id}`,
        updatedAttribute,
      );
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update attribute',
      );
    }
  },
);

// Delete an attribute
export const deleteAttribute = createAsyncThunk(
  'attributes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/attributes/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete attribute',
      );
    }
  },
);

// Add an attribute value
export const addAttributeValue = createAsyncThunk(
  'attributes/addValue',
  async ({ id, value }: { id: string; value: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<{ attribute: Attribute }>(
        `/attributes/${id}/value`,
        { value },
      );
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add attribute value',
      );
    }
  },
);

// Edit an attribute value
export const editAttributeValue = createAsyncThunk(
  'attributes/editValue',
  async (
    {
      id,
      valueId,
      newValue,
    }: { id: string; valueId: string; newValue: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch<{ attribute: Attribute }>(
        `/attributes/${id}/value`,
        {
          valueId,
          newValue,
        },
      );
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update attribute value',
      );
    }
  },
);

// Delete an attribute value
export const deleteAttributeValue = createAsyncThunk(
  'attributes/deleteValue',
  async (
    { id, valueId }: { id: string; valueId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.delete<{ attribute: Attribute }>(
        `/attributes/${id}/value`,
        {
          data: { valueId },
        },
      );
      return response.data.attribute;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete attribute value',
      );
    }
  },
);

//fetch attribute value
// export const fetchAttributeValues = createAsyncThunk(
//   'attributes/attributeValue',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/attributes/${id}/value`);
//       return response.data.AttributeValues;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch attribute values',
//       );
//     }
//   },
// );

// Fetch attribute values
export const fetchAttributeValues = createAsyncThunk(
  'attributes/fetchValues',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ AttributeValues: AttributeValue[] }>(
        `/attributes/${id}/value`,
      );
      return response.data.AttributeValues; // Updated to return an array
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attribute values',
      );
    }
  },
);

// Slice
const attributeSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAttributes.fulfilled,
        (state, action: PayloadAction<Attribute[]>) => {
          state.loading = false;
          state.attributes = action.payload;
        },
      )
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addAttribute.fulfilled,
        (state, action: PayloadAction<Attribute>) => {
          state.loading = false;
          state.attributes.push(action.payload);
        },
      )
      .addCase(addAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateAttribute.fulfilled,
        (state, action: PayloadAction<Attribute>) => {
          state.loading = false;
          const index = state.attributes.findIndex(
            (attr) => attr._id === action.payload._id,
          );
          if (index !== -1) state.attributes[index] = action.payload;
        },
      )
      .addCase(updateAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAttribute.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteAttribute.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.attributes = state.attributes.filter(
            (attr) => attr._id !== action.payload,
          );
        },
      )
      .addCase(deleteAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addAttributeValue.fulfilled,
        (state, action: PayloadAction<Attribute>) => {
          state.loading = false;
          const index = state.attributes.findIndex(
            (attr) => attr._id === action.payload._id,
          );
          if (index !== -1) state.attributes[index] = action.payload;
        },
      )
      .addCase(addAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        editAttributeValue.fulfilled,
        (state, action: PayloadAction<Attribute>) => {
          state.loading = false;
          const index = state.attributes.findIndex(
            (attr) => attr._id === action.payload._id,
          );
          if (index !== -1) state.attributes[index] = action.payload;
        },
      )
      .addCase(editAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAttributeValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteAttributeValue.fulfilled,
        (state, action: PayloadAction<Attribute>) => {
          state.loading = false;
          const index = state.attributes.findIndex(
            (attr) => attr._id === action.payload._id,
          );
          if (index !== -1) state.attributes[index] = action.payload;
        },
      )
      .addCase(deleteAttributeValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //fetch values
      .addCase(fetchAttributeValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAttributeValues.fulfilled,
        (state, action: PayloadAction<AttributeValue[]>) => {
          state.loading = false;
          state.attributeValues = action.payload; // Save the attribute values
        },
      )
      .addCase(fetchAttributeValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }, 
});

// Actions and reducer export
export const { clearError } = attributeSlice.actions;
export default attributeSlice.reducer;
