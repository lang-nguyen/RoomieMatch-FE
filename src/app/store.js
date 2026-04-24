import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../shared/api/baseApi';
import authReducer from '../features/auth/slice';

export const store = configureStore({
  reducer: {
    // Thêm reducer của baseApi vào store
    [baseApi.reducerPath]: baseApi.reducer,
    // Slice quản lý auth
    auth: authReducer,
  },
  // Thêm middleware của api để hỗ trợ caching, invalidation, polling... của rtk-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Thiết lập các listener để hỗ trợ các tính năng như refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
