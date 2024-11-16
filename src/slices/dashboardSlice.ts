import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
export interface WeeklyStatsData {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface ChartData {
  periods: string[];
  series: {
    name: string;
    data: number[];
  }[];
  totalRevenue: number;
  totalOrders: number;
}

export interface ChartAnalyticsState {
  chartData: {
    periods: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
  weeklyStats: {
    labels: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
  };
  period: 'day' | 'week' | 'month';
  weekPeriod: 'current' | 'last';
  loading: boolean;
  weeklyStatsLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchChartData = createAsyncThunk(
  'chartAnalytics/fetchChartData',
  async (period: 'day' | 'week' | 'month', { rejectWithValue }) => {
    try {
      const response = await api.get<{ data: ChartData }>(`/statistics?type=${period}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch chart data');
    }
  }
);

export const fetchWeeklyStats = createAsyncThunk(
  'chartAnalytics/fetchWeeklyStats',
  async (period: 'current' | 'last', { rejectWithValue }) => {
    try {
      const response = await api.get<{ success: boolean; data: WeeklyStatsData }>(
        `/orders/weekly-stats?period=${period}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch weekly stats');
    }
  }
);

const initialState: ChartAnalyticsState = {
  chartData: {
    periods: [],
    series: [
      {
        name: 'Direct Orders',
        data: [],
      },
      {
        name: 'Cart Orders',
        data: [],
      },
    ],
  },
  weeklyStats: {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    series: [
      {
        name: 'Orders',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Revenue',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
  },
  period: 'month',
  weekPeriod: 'current',
  loading: false,
  weeklyStatsLoading: false,
  error: null,
};

const chartAnalyticsSlice = createSlice({
  name: 'chartAnalytics',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setWeekPeriod: (state, action) => {
      state.weekPeriod = action.payload;
    },
    resetChartData: (state) => {
      state.chartData = initialState.chartData;
      state.weeklyStats = initialState.weeklyStats;
      state.summary = initialState.summary;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Chart Data
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = {
          periods: action.payload.periods,
          series: action.payload.series,
        };
        state.summary = {
          totalRevenue: action.payload.totalRevenue,
          totalOrders: action.payload.totalOrders,
        };
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Weekly Stats
      .addCase(fetchWeeklyStats.pending, (state) => {
        state.weeklyStatsLoading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyStats.fulfilled, (state, action) => {
        state.weeklyStatsLoading = false;
        state.weeklyStats = {
          labels: action.payload.labels,
          series: action.payload.series,
        };
      })
      .addCase(fetchWeeklyStats.rejected, (state, action) => {
        state.weeklyStatsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPeriod, setWeekPeriod, resetChartData } = chartAnalyticsSlice.actions;
export default chartAnalyticsSlice.reducer;

// Selectors
export const selectChartData = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.chartData;
export const selectWeeklyStats = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.weeklyStats;
export const selectSummary = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.summary;
export const selectPeriod = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.period;
export const selectWeekPeriod = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.weekPeriod;
export const selectLoading = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.loading;
export const selectWeeklyStatsLoading = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.weeklyStatsLoading;
export const selectError = (state: { chartAnalytics: ChartAnalyticsState }) => state.chartAnalytics.error;