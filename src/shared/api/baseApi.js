import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Khởi tạo baseApi sử dụng RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // Lấy URL từ biến môi trường hoặc dùng localhost nếu không có
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      // Tự động thêm Token vào Header nếu đã đăng nhập
      const token = getState().auth?.token;
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
