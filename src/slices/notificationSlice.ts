import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_CLIENT_URL,
});


interface Notification {
    _id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }
  
  interface NotificationState {
    notifications: Notification[];
    count: number;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: NotificationState = {
    notifications: [],
    count: 0,
    loading: false,
    error: null,
  };
  
  // Async thunk for fetching notifications
  export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/notify');
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
      }
    }
  );
  
  // Async thunk for marking notification as read
  export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await api.patch(`/notify/${id}/read`);
        return { id, data: response.data };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
      }
    }
  );
  
  // Async thunk for clearing all notifications
  export const clearAllNotifications = createAsyncThunk(
    'notifications/clearAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.delete('/clear');
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear notifications');
      }
    }
  );
  
  // Async thunk for deleting a notification
export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await api.delete(`/notify/${id}`);
        return { id, message: response.data.message };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
      }
    }
  );
  

  const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // Fetch notifications
      builder
        .addCase(fetchNotifications.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<{ notifications: Notification[]; count: number }>) => {
          state.loading = false;
          state.notifications = action.payload.notifications;
          state.count = action.payload.count;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
  
      // Mark as read
      builder
        .addCase(markAsRead.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(markAsRead.fulfilled, (state, action) => {
          state.loading = false;
          const { id } = action.payload;
          const notification = state.notifications.find(n => n._id === id);
          if (notification) {
            notification.read = true;
          }
        })
        .addCase(markAsRead.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
  
      // Clear all notifications
      builder
        .addCase(clearAllNotifications.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(clearAllNotifications.fulfilled, (state) => {
          state.loading = false;
          state.notifications = [];
          state.count = 0;
        })
        .addCase(clearAllNotifications.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });

        //delete notification
        builder
        .addCase(deleteNotification.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteNotification.fulfilled, (state, action) => {
          state.loading = false;
          const { id } = action.payload;
          state.notifications = state.notifications.filter((notification) => notification._id !== id);
          state.count -= 1;
        })
        .addCase(deleteNotification.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default notificationSlice.reducer;