import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

export interface CountryPricing {
  country_id: string;
  country: string;
  currency: string;
  currency_code: string;
  unit_price: number;
  discount?: number;
}

export interface Product {
  _id: string;
  name: string;
  product_type: 'digital' | 'physical';
  parent_category: string;
  sub_category: string[];
  brand: string;
  unit?: string;
  weight?: string;
  tags?: string;
  attribute?: string;
  attribute_value?: string[];
  todaysDeal?: boolean;
  featured?: boolean;
  cash_on_delivery?: boolean;
  country_pricing: CountryPricing[];
  quantity?: string;
  shipping_time?: string;
  tax?: string;
  description: string;
  image: string;
  gallery1?: string;
  gallery2?: string;
  gallery3?: string;
  gallery4?: string;
  gallery5?: string;
  meta_title?: string;
  meta_desc?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: any[];
  product: any | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  success: false,
  error: null,
};

// Add Product
export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.post('/product', formData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

//get All products
export const fetchProducts = createAsyncThunk(
  'product/fetchProduct',
  async (
    searchParams: { name?: string; tags?: string },
    { rejectWithValue },
  ) => {
    try {
      const { name, tags } = searchParams;
      const response = await api.get('/product', { params: { name, tags } });
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Something went wrong while fetching products',
      );
    }
  },
);

//getProduct by id
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Something went wrong while fetching the product',
      );
    }
  },
);

//edit product
export const editProduct = createAsyncThunk(
  'product/editProduct',
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.put(`/product/${id}`, formData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to edit product',
      );
    }
  },
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Something went wrong while deleting the product',
      );
    }
  },
);

// Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    //post product
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      addProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload.product;
      },
    );
    builder.addCase(
      addProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      },
    );

    //fetch all products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      },
    );
    builder.addCase(
      fetchProducts.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // get product by id
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.product = null;
    });
    builder.addCase(
      getProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      },
    );
    builder.addCase(
      getProductById.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      },
    );

    // Edit product
    builder.addCase(editProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      editProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload.product;
        state.products = state.products.map((p) =>
          p._id === action.payload.product._id ? action.payload.product : p,
        );
      },
    );
    builder.addCase(
      editProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      },
    );

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.id,
        );
        if (state.product && state.product._id === action.payload.id) {
          state.product = null;
        }
      },
    );
    builder.addCase(
      deleteProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      },
    );
  },
});

export const { resetSuccess } = productSlice.actions;
export default productSlice.reducer;
