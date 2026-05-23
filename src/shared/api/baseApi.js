import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serializeQueryParams } from './serializeQueryParams';
import { getAccessToken } from '../utils/authToken';

// Use mock only when explicitly enabled via VITE_USE_MOCK.
// Previously DEV always enabled mock which prevented calling real APIs in development.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const mockUser = {
  id: 1,
  display_name: 'Demo User',
  email: 'demo@roomie.local',
  account_type: 'tenant',
};

const mockBaseQuery = async (args) => {
  const normalizedArgs = typeof args === 'string' ? { url: args } : args;
  const { url, method = 'GET', body } = normalizedArgs || {};

  if (url === '/auth/login' && method === 'POST') {
    return {
      data: {
        user: mockUser,
        access_token: 'mock-access-token',
      },
    };
  }

  if (url === '/auth/register' && method === 'POST') {
    return {
      data: {
        user: {
          ...mockUser,
          display_name: body?.display_name || mockUser.display_name,
          email: body?.email || mockUser.email,
          account_type: body?.account_type || mockUser.account_type,
        },
        access_token: 'mock-access-token',
      },
    };
  }

  if (url === '/auth/logout' && method === 'POST') {
    return { data: { success: true } };
  }

  return {
    error: {
      status: 404,
      data: { message: 'Mock endpoint not found' },
    },
  };
};

// Khởi tạo baseApi sử dụng RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // Trong môi trường dev luôn gọi relative path để đi qua Vite proxy,
    // tránh browser gọi thẳng BE dẫn tới CORS preflight (OPTIONS).
    baseUrl:
    "http://127.0.0.1:8000/api/v1",
    //  import.meta.env.DEV
    //   ? '/api/v1'
    //   : (import.meta.env.VITE_API_URL || '/api/v1'),
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
