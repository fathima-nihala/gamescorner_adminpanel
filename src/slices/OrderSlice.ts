import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppDispatch, RootState } from '../redux/store';

// Types
export interface OrderItem {
  product: {
    name: string;
    image: string;
    description: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    customerId: string;
  };
  orderItems: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  payment_status: string;
  createdAt: string;
  orderID: string;
  paymentInfo: {
    type: string;
  };
}

interface OrderResponse {
  statusCode: number;
  success: boolean;
  data: {
    orders: Order[];
    totalAmount: number;
  };
}

interface OrderDetailsResponse {
    statusCode: number;
    success: boolean;
    data: {
      order: Order;
    };
  }

interface OrderState {
  list: Order[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
  orderDetails: Order | null;
  orderDetailsLoading: boolean;
  orderDetailsError: string | null;
}

interface FilterParams {
  orderStatus?: string;
  payment_status?: string;
}

// API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial state
const initialState: OrderState = {
  list: [],
  totalAmount: 0,
  loading: false,
  error: null,
  orderDetails: null,
  orderDetailsLoading: false,
  orderDetailsError: null,
};

// Async thunk with proper typing
export const fetchOrders = createAsyncThunk<
  OrderResponse,
  FilterParams | undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('orders/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    let url = '/admin/orders';

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.orderStatus) {
        queryParams.append('orderStatus', params.orderStatus);
      }
      if (params.payment_status) {
        queryParams.append('payment_status', params.payment_status);
      }
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await api.get<OrderResponse>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders',
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});


export const fetchOrderDetails = createAsyncThunk<
  OrderDetailsResponse,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('orders/fetchOrderDetails', async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderDetailsResponse>(`/order/${orderId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details',
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});


// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.error = null;
    },
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.orders;
        state.totalAmount = action.payload.data.totalAmount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.list = [];
        state.totalAmount = 0;
      })

      //order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderDetailsLoading = true;
        state.orderDetailsError = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload.data.order;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError = action.payload || 'Something went wrong';
        state.orderDetails = null;
      });
  },
});

// Actions
export const { clearOrderErrors, resetOrders } = orderSlice.actions;

// Reducer
export default orderSlice.reducer;

// Selectors with proper typing
export const selectOrders = (state: RootState) => state.orders.list;
export const selectTotalAmount = (state: RootState) => state.orders.totalAmount;
export const selectOrderLoading = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;
