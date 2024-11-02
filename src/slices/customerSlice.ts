import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

// Thunk to fetch all customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/web_customers'); 
      return response.data.customer;      
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching customers'
      );
    }
  }
);

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCustomers.fulfilled,
      (state, action: PayloadAction<Customer[]>) => {
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      }
    );
    builder.addCase(
      fetchCustomers.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearCustomerError } = customerSlice.actions;



export default customerSlice.reducer;
