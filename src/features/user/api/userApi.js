import { baseApi } from '../../../shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: '', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: '', // TODO: Thêm link API
        method: 'PUT', // Hoặc PATCH
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '', // TODO: Thêm link API
        method: 'POST', // Hoặc PUT
        body: passwords,
      }),
    }),
    getSavedRooms: builder.query({
      query: () => ({
        url: '', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    getRentalHistory: builder.query({
      query: () => ({
        url: '', // TODO: Thêm link API
        method: 'GET',
      }),
    }),
    getPackageHistory: builder.query({
      query: () => ({
        url: '', // TODO: Thêm link API
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
