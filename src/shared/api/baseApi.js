import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

const mockUser = {
  id: 1,
  display_name: 'Demo User',
  email: 'demo@roomie.local',
  account_type: 'tenant',
};

const mockPosts = [
  {
    post_id: 1,
    title: 'Phòng trọ mới, gần Thảo Điền',
    price: 4500000,
    area: 22,
    bedroom_count: 1,
    room_type: 'Phòng trọ',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 2',
    ward: 'Thảo Điền',
    is_vip: true,
    created_at: '2026-05-18T08:30:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    post_id: 2,
    title: 'Căn hộ mini đầy đủ tiện nghi',
    price: 6000000,
    area: 30,
    bedroom_count: 1,
    room_type: 'Chung cư mini',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    ward: 'Dịch Vọng',
    is_vip: true,
    created_at: '2026-05-18T06:15:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    post_id: 3,
    title: 'Phòng trọ giá tốt gần Làng Đại Học',
    price: 2500000,
    area: 18,
    bedroom_count: 1,
    room_type: 'Phòng trọ',
    city: 'TP. Hồ Chí Minh',
    district: 'Thủ Đức',
    ward: 'Linh Trung',
    is_vip: false,
    created_at: '2026-05-17T22:00:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    post_id: 4,
    title: 'Phòng trọ ban công thoáng mát',
    price: 3500000,
    area: 25,
    bedroom_count: 1,
    room_type: 'Phòng trọ',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    ward: 'Thạch Thang',
    is_vip: true,
    created_at: '2026-05-16T10:20:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    post_id: 5,
    title: 'Phòng sạch đẹp, giờ giấc tự do',
    price: 4000000,
    area: 20,
    bedroom_count: 1,
    room_type: 'Phòng trọ',
    city: 'Hà Nội',
    district: 'Đống Đa',
    ward: 'Chợ Dừa',
    is_vip: false,
    created_at: '2026-05-15T14:40:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    post_id: 6,
    title: 'Phòng trọ cao cấp Thủ Dầu Một',
    price: 3200000,
    area: 24,
    bedroom_count: 1,
    room_type: 'Phòng trọ',
    city: 'Bình Dương',
    district: 'Thủ Dầu Một',
    ward: 'Phú Cường',
    is_vip: false,
    created_at: '2026-05-14T09:05:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
];

const buildPostsResponse = (params = {}) => {
  const page = Number(params.page || 1);
  const pageSize = Number(params.page_size || 20);
  const start = (page - 1) * pageSize;
  const items = mockPosts.slice(start, start + pageSize);

  return {
    items,
    page,
    page_size: pageSize,
    total: mockPosts.length,
  };
};

const mockBaseQuery = async (args) => {
  const normalizedArgs = typeof args === 'string' ? { url: args } : args;
  const { url, method = 'GET', body, params } = normalizedArgs || {};

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

  if (url === '/posts' && method === 'GET') {
    return { data: buildPostsResponse(params) };
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
  baseQuery: USE_MOCK
    ? mockBaseQuery
    : fetchBaseQuery({
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
