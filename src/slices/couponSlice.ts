import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

// Base Coupon interface for existing coupons
export interface Coupon {
  _id: string;
  code: string;
  discountValue: string;
  expiry: string;
  discountType: string;
}

// Type for new coupons (without _id)
export type NewCoupon = Omit<Coupon, '_id'>;

// Response types
interface CouponResponse {
  coupons: Coupon[];
  message: string;
}

interface SingleCouponResponse {
  newCoupon: Coupon;
  message: string;
}

// State interface
interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
};

// API interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Async thunks
export const getAllCoupons = createAsyncThunk<
  CouponResponse,
  void,
  { rejectValue: string }
>('coupon/getAllCoupons', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CouponResponse>('/coupon');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addCoupon = createAsyncThunk<
  SingleCouponResponse,
  NewCoupon,
  { rejectValue: string }
>('coupon/addCoupon', async (couponData, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleCouponResponse>('/coupon', couponData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});


export const updateCoupon = createAsyncThunk<
  Coupon,
  { id: string; couponData: Partial<NewCoupon> },
  { rejectValue: string }
>('coupon/updateCoupon', async ({ id, couponData }, { rejectWithValue }) => {
  try {
    const response = await api.put<{ 
      success: boolean;
      updatedCoupon: Coupon;
      message: string;
    }>(`/coupon/${id}`, couponData);
        return response.data.updatedCoupon;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCoupon = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('coupon/deleteCoupon', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/coupon/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all coupons
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.error = null;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch coupons';
      })

      // Add coupon
      .addCase(addCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload.newCoupon);
        state.error = null;
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add coupon';
      })

      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload._id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update coupon';
      })

      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete coupon';
      });
  },
});

export default couponSlice.reducer;