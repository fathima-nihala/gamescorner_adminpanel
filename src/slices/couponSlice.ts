import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
  });

// Define the initial state for the coupons slice
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

// Define Coupon interface
interface Coupon {
  _id?: string;
  code: string;
  discountValue: number;
  expiry: string;
  discountType: string;
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

// Async thunk for fetching all coupons
export const getAllCoupons = createAsyncThunk(
    'coupon/getAllCoupons',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/coupon');  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Async thunk for adding a coupon
export const addCoupon = createAsyncThunk(
    'coupon/addCoupon',
    async (couponData: Coupon, { rejectWithValue }) => {
      try {
        const response = await api.post('/coupon', couponData);  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Async thunk for updating a coupon
export const updateCoupon = createAsyncThunk(
    'coupon/updateCoupon',
    async ({ id, couponData }: { id: string; couponData: Coupon }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/coupon/${id}`, couponData);  
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Async thunk for deleting a coupon
export const deleteCoupon = createAsyncThunk(
    'coupon/deleteCoupon',
    async (id: string, { rejectWithValue }) => {
      try {
        await api.delete(`/coupon/${id}`);  
        return id;  
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
// Coupon slice to manage coupon state
const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch coupons
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add coupon
      .addCase(addCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // state.coupons.push(action.payload);
        state.coupons.push(action.payload.newCoupon);
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex((coupon) => coupon._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default couponSlice.reducer;
