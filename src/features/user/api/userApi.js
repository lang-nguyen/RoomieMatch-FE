import { baseApi } from '../../../shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: '/users/me/profile', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/me/profile', // TODO: Thêm link API
        method: 'PATCH', // Hoặc PATCH
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/me/password', // TODO: Thêm link API
        method: 'PUT', // Hoặc PUT
        body: passwords,
      }),
    }),
    getSavedRooms: builder.query({
      query: () => ({
        url: '/posts/saved', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    getRentalHistory: builder.query({
      query: () => ({
        url: '/users/me/rental-history', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    getPackageHistory: builder.query({
      query: () => ({
        url: '/packages/me/purchases', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetSavedRoomsQuery,
  useGetRentalHistoryQuery,
  useGetPackageHistoryQuery,
} = userApi;
