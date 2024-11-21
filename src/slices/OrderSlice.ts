import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppDispatch, RootState } from '../redux/store';


// Types
export interface OrderItem {
  currency_code: string;
  product: {
    name: string;
    image: string;
    description: string;
    shipping_price: number;
  };
  quantity: number;
  price: number;

}

export interface shippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  phoneNo: number;
  pinCode: number;
  state: string;
  shipping_price:number;
}

export interface Order {
  id: string;
  _id: string;
  itemsPrice: string;
  user: {
    name: string;
    email: string;
    customerId: string;
  };
  orderItems: OrderItem[];
  discount: number; 
  tax: number; 
  totalPrice: number;
  orderStatus: string;
  payment_status: string; 
  createdAt: string;
  orderID: string;
  paymentInfo: {
    type: string;
    status?: string;
  };
  taxPrice: string;
  shippingPrice:string
  totalDiscount: string;
  shippingAddress : shippingAddress;
  
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lastUpdated: number | null;
}

export interface UpdateOrderStatusPayload {
  id: string;
  paymentStatus: string;
  paymentInfoStatus: string;
  orderStatus: string;
  shippingPrice:string;
}

// API configuration with error handling
const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request and response interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   },
// );

// Initial state
const initialState: OrderState = {
  list: [],
  totalAmount: 0,
  status: 'idle',
  loading: false,
  error: null,
  orderDetails: null,
  orderDetailsLoading: false,
  orderDetailsError: null,
  lastUpdated: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk<
  OrderResponse,
  { orderStatus?: string; payment_status?: string } | undefined,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('orders/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `/admin/orders${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await api.get<OrderResponse>(url);

    if (!response.data.success) throw new Error('Failed to fetch orders');
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || 'Failed to fetch orders'
      : 'An unexpected error occurred';
    return rejectWithValue(errorMessage);
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('order/deleteOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/order/${id}`);
    if (!response.data.success) throw new Error('Access denied! admin only');
    return response.data.id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Access denied! admin only',
    );
  }
});

export const getOrderDetails = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>('orders/getOrderDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderDetailsResponse>(`/order/${id}`);
    if (!response.data.success)
      throw new Error('Failed to fetch order details');
    return response.data.data.order;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || 'Failed to fetch order details'
      : 'An unexpected error occurred';
    return rejectWithValue(errorMessage);
  }
});

export const updateOrderStatus = createAsyncThunk<
  OrderDetailsResponse,
  UpdateOrderStatusPayload,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'orders/updateOrderStatus',
  async (
    { id, paymentStatus, paymentInfoStatus, orderStatus },
    { rejectWithValue },
  ) => {
    try {
      if (!id) throw new Error('Order ID is required');
      const response = await api.put<OrderDetailsResponse>(
        `/order/${id}/payment-status`,
        {
          paymentStatus,
          paymentInfoStatus,
          orderStatus,
        },
      );

      if (!response.data.success)
        throw new Error('Failed to update order status');
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to update order status'
        : 'An unexpected error occurred';
      return rejectWithValue(errorMessage);
    }
  },
);

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    
    clearOrderErrors: (state) => {
      state.error = null;
      state.orderDetailsError = null;
    },
    resetOrders: () => initialState,
  },


  
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.orders;
        state.totalAmount = action.payload.data.totalAmount;
        state.status = 'succeeded';
        state.lastUpdated = Date.now();
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.status = 'failed';
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete order';
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.orderDetailsLoading = true;
        state.orderDetailsError = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError =
          action.payload || 'Failed to fetch order details';
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.orderDetailsLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload.data.order;
        const index = state.list.findIndex(
          (order) => order._id === action.payload.data.order._id,
        );
        if (index !== -1) state.list[index] = action.payload.data.order;
        state.lastUpdated = Date.now();
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError =
          action.payload || 'Failed to update order status';
      });
  },
});

// Actions
export const { clearOrderErrors, resetOrders } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.orders.list;
export const selectTotalAmount = (state: RootState) => state.orders.totalAmount;
export const selectOrderLoading = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;
export const selectOrderDetails = (state: RootState) =>
  state.orders.orderDetails;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.orders.orderDetailsLoading;
export const selectOrderDetailsError = (state: RootState) =>
  state.orders.orderDetailsError;
export const selectOrderStatus = (state: RootState) => state.orders.status;
export const selectLastUpdated = (state: RootState) => state.orders.lastUpdated;

export default orderSlice.reducer;
