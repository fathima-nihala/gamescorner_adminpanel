import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});

interface Country {
  _id: string;
  country: string;
  currency: string;
  currency_code: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Country[];
}

interface CountryState {
  list: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  list: [],
  loading: false,
  error: null
};

export const getCountries = createAsyncThunk(
  'countries/getCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse>('/country');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch countries');
    }
  }
);

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default countrySlice.reducer;

// Selectors
export const selectCountries = (state: { countries: CountryState }) => state.countries.list;
export const selectLoading = (state: { countries: CountryState }) => state.countries.loading;
export const selectError = (state: { countries: CountryState }) => state.countries.error;