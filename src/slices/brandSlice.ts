import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandsState {
  brands: Brand[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BrandsState = {
  brands: [],
  status: 'idle',
  error: null,
};

export const fetchBrands = createAsyncThunk('brands/fetchBrands', async () => {
  const response = await api.get('/brand');
  return response.data.brands;
});

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: string) => {
    await api.delete(`/brand/${id}`);
    return id;
  },
);

export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async (formData: FormData) => {
    const response = await api.post('/brand', formData);
    return response.data.brand;
  },
);

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchBrands.fulfilled,
        (state, action: PayloadAction<Brand[]>) => {
          state.status = 'succeeded';
          state.brands = action.payload;
        },
      )
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.brands.push(action.payload);
      })
      .addCase(
        deleteBrand.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.brands = state.brands.filter(
            (brand) => brand._id !== action.payload,
          );
        },
      );
  },
});

export default brandsSlice.reducer;
