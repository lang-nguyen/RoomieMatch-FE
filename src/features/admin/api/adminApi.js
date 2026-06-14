import { baseApi } from '../../../shared/api/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── DASHBOARD ───
    getAdminDashboard: builder.query({
      query: () => ({ url: '/admin/dashboard', method: 'GET' }),
      providesTags: ['AdminDashboard'],
    }),

    // ─── ANALYTICS ───
    getAnalytics: builder.query({
      query: (year) => ({ url: `/admin/analytics?year=${year}`, method: 'GET' }),
      providesTags: ['Analytics'],
    }),

    // ─── USERS ───
    getUsers: builder.query({
      query: (params) => ({
        url: '/admin/users',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: '/admin/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),

    // ─── POSTS ───
    getPosts: builder.query({
      query: (params) => ({ url: '/admin/posts', method: 'GET', params }),
      providesTags: ['Posts'],
    }),
    updatePostStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/admin/posts/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Posts'],
    }),
    deletePost: builder.mutation({
      query: (id) => ({ url: `/admin/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Posts'],
    }),

    // ─── ROOMS ───
    getRooms: builder.query({
      query: (params) => ({ url: '/admin/rooms', method: 'GET', params }),
      providesTags: ['Rooms'],
    }),
    updateRoomStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/admin/rooms/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Rooms'],
    }),

    // ─── PACKAGES ───
    getPackages: builder.query({
      query: (params) => ({ url: '/admin/packages', method: 'GET', params }),
      providesTags: ['Packages'],
    }),
    createPackage: builder.mutation({
      query: (body) => ({ url: '/admin/packages', method: 'POST', body }),
      invalidatesTags: ['Packages'],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/packages/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Packages'],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({ url: `/admin/packages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Packages'],
    }),

    // ─── CATEGORIES ───
    getCategories: builder.query({
      query: (tab) => ({ url: `/admin/categories?tab=${tab}`, method: 'GET' }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Categories'],
    }),

    // ─── ORDERS ───
    getOrders: builder.query({
      query: (params) => ({ url: '/admin/orders', method: 'GET', params }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/admin/orders/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({ url: `/admin/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Orders'],
    }),

    // ─── COMPLAINTS ───
    getComplaints: builder.query({
      query: (params) => ({ url: '/admin/complaints', method: 'GET', params }),
      providesTags: ['Complaints'],
    }),
    updateComplaintStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/admin/complaints/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Complaints'],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAnalyticsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetPostsQuery,
  useUpdatePostStatusMutation,
  useDeletePostMutation,
  useGetRoomsQuery,
  useUpdateRoomStatusMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
} = adminApi;
