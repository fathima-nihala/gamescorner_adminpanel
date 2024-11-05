import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface Customer {
  _id: string;
  name: string;
  email: string;
  customerId: string;
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
      console.error("Fetch customers error:", error.response || error);
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching customers'
      );
    }
  }
);

// Thunk to delete a customer
export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (customerId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/web_delete/${customerId}`);
      return customerId; 
    } catch (error: any) {
      console.error("Error deleting customer:", error.response?.data); 
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while deleting customer'
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
      (state, action: PayloadAction<string | unknown>) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch customers';
      }
    );

    // Delete customer reducers
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteCustomer.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload
        );
        state.error = null;
      }
    );
    builder.addCase(
      deleteCustomer.rejected,
      (state, action: PayloadAction<string | unknown>) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete customer';
      }
    );
  },
});

export const { clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
