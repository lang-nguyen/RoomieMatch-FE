import { baseApi } from '../../../shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: '/users/me/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/me/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getSavedRooms: builder.query({
      query: () => ({
        url: '/posts/saved',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    savePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/save`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    unsavePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/save`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getRentalHistory: builder.query({
      query: () => ({
        url: '/users/me/rental-history',
        method: 'GET',
      }),
    }),
    getPackageHistory: builder.query({
      query: () => ({
        url: '/packages/me/purchases',
        method: 'GET',
      }),
    }),
    getAllPackages: builder.query({
      query: () => ({
        url: '/packages/',
        method: 'GET',
        params: { target_role: 'tenant' },
      }),
    }),
    purchasePackage: builder.mutation({
      query: (body) => ({
        url: '/packages/purchase',
        method: 'POST',
        body,
      }),
    }),
    getPackageEntitlements: builder.query({
      query: () => ({
        url: '/packages/me/entitlements',
        method: 'GET',
      }),
    }),
    createVnpayPayment: builder.mutation({
      query: (body) => ({
        url: '/payments/vnpay/create_url',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetSavedRoomsQuery,
  useSavePostMutation,
  useUnsavePostMutation,
  useGetRentalHistoryQuery,
  useGetPackageHistoryQuery,
  useGetAllPackagesQuery,
  usePurchasePackageMutation,
  useGetPackageEntitlementsQuery,
  useCreateVnpayPaymentMutation,
} = userApi;
