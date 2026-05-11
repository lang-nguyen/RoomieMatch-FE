import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Khởi tạo baseApi sử dụng RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // Trong môi trường dev luôn gọi relative path để đi qua Vite proxy,
    // tránh browser gọi thẳng BE dẫn tới CORS preflight (OPTIONS).
    baseUrl: import.meta.env.DEV
      ? '/api/v1'
      : (import.meta.env.VITE_API_URL || '/api/v1'),
    prepareHeaders: (headers, { getState }) => {
      // Tự động thêm Token vào Header nếu đã đăng nhập
      const token = getState().auth?.access_token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Các tag dùng để quản lý cache và tự động refetch dữ liệu
  tagTypes: ['User', 'Room'],
  endpoints: () => ({}),
});
