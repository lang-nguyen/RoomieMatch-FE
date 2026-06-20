import { baseApi } from '../../../shared/api/baseApi';

export const landlordApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLandlordRooms: builder.query({
      query: ({ page = 1, pageSize = 6, search = '', status = '' } = {}) => ({
        url: '/landlord/rooms',
        params: {
          page,
          page_size: pageSize,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
        },
      }),
      providesTags: ['LandlordRooms'],
    }),

    getLandlordRoomById: builder.query({
      query: ({ id }) => `/landlord/rooms/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: 'LandlordRooms', id }],
    }),

    addRoom: builder.mutation({
      query: ({ payload, images = [], publish = false }) => {
        const body = new FormData();
        body.append('payload', JSON.stringify(payload));
        body.append('publish', String(publish));
        images.forEach((file) => body.append('images', file));
        return { url: '/landlord/rooms', method: 'POST', body };
      },
      invalidatesTags: ['LandlordRooms', 'LandlordPosts', 'LandlordStats', 'Posts', 'Packages'],
    }),

    updateRoom: builder.mutation({
      query: ({ id, payload, images = [] }) => {
        const body = new FormData();
        body.append('payload', JSON.stringify(payload));
        images.forEach((file) => body.append('images', file));
        return { url: `/landlord/rooms/${id}`, method: 'PUT', body };
      },
      invalidatesTags: ['LandlordRooms', 'LandlordStats', 'Posts', 'Packages'],
    }),

    deleteRoom: builder.mutation({
      query: ({ id }) => ({ url: `/landlord/rooms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['LandlordRooms', 'LandlordPosts', 'LandlordStats', 'Posts'],
    }),

    getLandlordPosts: builder.query({
      query: ({ page = 1, pageSize = 8, search = '', status = '', boostedOnly = false } = {}) => ({
        url: '/landlord/posts',
        params: {
          page,
          page_size: pageSize,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(boostedOnly ? { boostedOnly: true } : {}),
        },
      }),
      providesTags: ['LandlordPosts'],
    }),

    getLandlordStats: builder.query({
      query: ({ range = '30d' } = {}) => ({
        url: '/landlord/stats',
        params: { range },
      }),
      providesTags: ['LandlordStats'],
    }),

    createLandlordPost: builder.mutation({
      query: ({ room_id, roomId, is_vip = false, title, description }) => ({
        url: '/landlord/posts',
        method: 'POST',
        body: {
          room_id: Number(room_id || roomId),
          is_vip,
          ...(title !== undefined ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
        },
      }),
      invalidatesTags: ['LandlordPosts', 'LandlordStats', 'Posts', 'Packages'],
    }),

    updateLandlordPost: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/landlord/posts/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['LandlordPosts', 'LandlordStats', 'Posts', 'Packages'],
    }),

    deleteLandlordPost: builder.mutation({
      query: ({ id }) => ({ url: `/landlord/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['LandlordPosts', 'LandlordStats', 'Posts', 'Packages'],
    }),

    boostLandlordPost: builder.mutation({
      query: ({ id }) => ({
        url: `/landlord/posts/${id}`,
        method: 'PATCH',
        body: { status: 'boosted' },
      }),
      invalidatesTags: ['LandlordPosts', 'LandlordStats', 'Posts', 'Packages'],
    }),

    cancelPostBoost: builder.mutation({
      query: ({ id }) => ({
        url: `/landlord/posts/${id}`,
        method: 'PATCH',
        body: { status: 'approved' },
      }),
      invalidatesTags: ['LandlordPosts', 'LandlordStats', 'Posts'],
    }),

    getLandlordPackages: builder.query({
      query: () => ({ url: '/packages/', method: 'GET', params: { target_role: 'landlord' } }),
      transformResponse: (response) => ({
        items: (Array.isArray(response) ? response : []).map(mapPackageFromApi),
      }),
      providesTags: ['Packages'],
    }),

    getLandlordPackageById: builder.query({
      query: () => ({ url: '/packages/', method: 'GET', params: { target_role: 'landlord' } }),
      transformResponse: (response, _meta, { packageId }) => ({
        package: (Array.isArray(response) ? response : [])
          .map(mapPackageFromApi)
          .find((pkg) => String(pkg.id) === String(packageId)) || null,
      }),
      providesTags: ['Packages'],
    }),

    purchaseLandlordPackage: builder.mutation({
      query: ({ packageId }) => ({
        url: '/packages/purchase',
        method: 'POST',
        body: { package_id: Number(packageId) },
      }),
      invalidatesTags: ['Packages'],
    }),

    getLandlordPackageHistory: builder.query({
      async queryFn(_args, _queryApi, _extraOptions, baseQuery) {
        const [purchasesResult, packagesResult, entitlementsResult] = await Promise.all([
          baseQuery({ url: '/packages/me/purchases', method: 'GET' }),
          baseQuery({ url: '/packages/', method: 'GET', params: { target_role: 'landlord' } }),
          baseQuery({ url: '/packages/me/entitlements', method: 'GET' }),
        ]);

        const error = purchasesResult.error || packagesResult.error || entitlementsResult.error;
        if (error) return { error };

        return {
          data: {
            items: mapLandlordPurchaseHistory(
              purchasesResult.data || [],
              packagesResult.data || [],
              entitlementsResult.data || [],
            ),
          },
        };
      },
      providesTags: ['Packages'],
    }),

    getLandlordPackageUsageDetail: builder.query({
      async queryFn({ id }, _queryApi, _extraOptions, baseQuery) {
        const [purchasesResult, packagesResult, entitlementsResult] = await Promise.all([
          baseQuery({ url: '/packages/me/purchases', method: 'GET' }),
          baseQuery({ url: '/packages/', method: 'GET', params: { target_role: 'landlord' } }),
          baseQuery({ url: '/packages/me/entitlements', method: 'GET' }),
        ]);

        const error = purchasesResult.error || packagesResult.error || entitlementsResult.error;
        if (error) return { error };

        const items = mapLandlordPurchaseHistory(
          purchasesResult.data || [],
          packagesResult.data || [],
          entitlementsResult.data || [],
        );

        return { data: { detail: items.find((item) => String(item.id) === String(id)) || null } };
      },
      providesTags: ['Packages'],
    }),

    renewLandlordPackage: builder.mutation({
      query: ({ packageId }) => ({
        url: '/packages/purchase',
        method: 'POST',
        body: { package_id: Number(packageId) },
      }),
      invalidatesTags: ['Packages'],
    }),
  }),
});

export const {
  useGetLandlordRoomsQuery,
  useGetLandlordRoomByIdQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetLandlordPostsQuery,
  useGetLandlordStatsQuery,
  useCreateLandlordPostMutation,
  useUpdateLandlordPostMutation,
  useDeleteLandlordPostMutation,
  useBoostLandlordPostMutation,
  useCancelPostBoostMutation,
  useGetLandlordPackagesQuery,
  useGetLandlordPackageByIdQuery,
  usePurchaseLandlordPackageMutation,
  useGetLandlordPackageHistoryQuery,
  useGetLandlordPackageUsageDetailQuery,
  useRenewLandlordPackageMutation,
} = landlordApi;

const tierBySlug = {
  starter: 'basic',
  basic: 'basic',
  plus: 'pro',
  pro: 'pro',
  premium: 'vip',
  vip: 'vip',
  'landlord-basic': 'basic',
  'landlord-pro': 'pro',
  'landlord-vip': 'vip',
};

const labelByFeature = {
  posts_limit: 'Lượt đăng bài',
  photo_limit: 'Lượt upload ảnh',
  boost_limit: 'Lượt đẩy tin nổi bật',
  matching: 'Lượt matching',
  chatbot: 'Tư vấn chatbot',
  priority_match: 'Ưu tiên matching',
  vip_listing: 'Hiển thị nổi bật',
};

const mapPackageFromApi = (pkg) => {
  const tier = tierBySlug[pkg.slug] || tierBySlug[String(pkg.name || '').toLowerCase()] || 'basic';
  const rawFeatures = pkg.features || {};
  const featureKeys = (Array.isArray(rawFeatures) ? rawFeatures : Object.keys(rawFeatures))
    .filter((key) => key !== 'boost_duration_days');
  const features = featureKeys.map((key) => ({
    label: labelByFeature[key] || key,
    included: true,
  }));

  if (!Array.isArray(rawFeatures)) {
    if (Number.isInteger(rawFeatures.posts_limit)) {
      features.unshift({ label: `${rawFeatures.posts_limit} bài đăng / tháng`, included: true });
    }
    if (Number.isInteger(rawFeatures.photo_limit)) {
      features.unshift({ label: `${rawFeatures.photo_limit} ảnh upload / tháng`, included: true });
    }
    if (Number.isInteger(rawFeatures.boost_limit)) {
      features.unshift({ label: `${rawFeatures.boost_limit} lượt đẩy tin nổi bật`, included: true });
    }
    if (rawFeatures.boost_limit > 0 && Number.isInteger(rawFeatures.boost_duration_days)) {
      features.unshift({ label: `${rawFeatures.boost_duration_days} ngày nổi bật / lượt`, included: true });
    }
  }

  if (pkg.credits_match) {
    features.unshift({ label: `${pkg.credits_match} lượt matching`, included: true });
  }
  if (pkg.credits_chatbot) {
    features.unshift({ label: `${pkg.credits_chatbot} lượt chatbot`, included: true });
  }

  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    tier,
    price: Number(pkg.price_cents) || 0,
    unit: pkg.period === 'annual' ? 'năm' : 'tháng',
    durationLabel: pkg.period === 'annual' ? '1 năm' : '30 ngày',
    description: pkg.description,
    isFeatured: tier === 'pro',
    badge: tier === 'vip' ? 'VIP' : tier === 'pro' ? 'hot' : null,
    features,
    ctaLabel: 'Chon goi',
    raw: pkg,
  };
};

const addDays = (dateValue, days) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const getEntitlementQuantity = (entitlements, purchaseId, featureKey) => {
  const entitlement = entitlements.find(
    (item) => String(item.source_purchase_id) === String(purchaseId) && item.feature_key === featureKey,
  );
  return entitlement?.quantity ?? 0;
};

const getPackageFeatureLimit = (pkg, featureKey) => {
  const features = pkg.raw?.features || {};
  const value = !Array.isArray(features) ? features[featureKey] : null;
  return Number.isInteger(value) ? value : 0;
};

const mapLandlordPurchaseHistory = (purchases, packages, entitlements) => {
  const packageById = new Map(packages.map((pkg) => [Number(pkg.id), mapPackageFromApi(pkg)]));

  return purchases
    .map((purchase) => {
      const pkg = packageById.get(Number(purchase.package_id));
      if (!pkg) return null;

      const expiredDate = entitlements.find(
        (item) => String(item.source_purchase_id) === String(purchase.id) && item.expires_at,
      )?.expires_at || addDays(purchase.created_at, 30);
      const isActive = purchase.status === 'paid' && (!expiredDate || new Date(expiredDate) >= new Date());
      const postsLimit = getPackageFeatureLimit(pkg, 'posts_limit');
      const photoLimit = getPackageFeatureLimit(pkg, 'photo_limit');
      const boostLimit = getPackageFeatureLimit(pkg, 'boost_limit');
      const postsRemaining = getEntitlementQuantity(entitlements, purchase.id, 'posts_limit');
      const photoRemaining = getEntitlementQuantity(entitlements, purchase.id, 'photo_limit');
      const boostRemaining = getEntitlementQuantity(entitlements, purchase.id, 'boost_limit');

      return {
        id: purchase.id,
        packageId: purchase.package_id,
        packageName: pkg.name,
        tier: pkg.tier,
        price: purchase.amount_cents,
        purchaseDate: purchase.created_at,
        expiredDate,
        status: isActive ? 'active' : purchase.status,
        period: pkg.durationLabel,
        paymentMethod: purchase.provider,
        autoRenew: false,
        postsUsed: Math.max(0, postsLimit - postsRemaining),
        postsLimit,
        activePosts: 0,
        boostUsed: Math.max(0, boostLimit - boostRemaining),
        boostLimit,
        boostRemaining,
        photoUsed: Math.max(0, photoLimit - photoRemaining),
        photoLimit,
        photoRemaining,
        postsRemaining,
        roomViews: 0,
        remainingDays: expiredDate
          ? Math.max(0, Math.ceil((new Date(expiredDate) - new Date()) / 86400000))
          : null,
        benefits: pkg.features,
        timeline: [
          {
            id: 1,
            title: `Kích hoạt gói ${pkg.name}`,
            description: new Date(purchase.created_at).toLocaleString('vi-VN'),
            tone: 'success',
          },
          {
            id: 2,
            title: isActive ? 'Gói đang hoạt động' : 'Gói đã hết hiệu lực',
            description: expiredDate ? `Hết hạn: ${new Date(expiredDate).toLocaleDateString('vi-VN')}` : 'Không có ngày hết hạn',
            tone: isActive ? 'success' : 'danger',
          },
        ],
      };
    })
    .filter(Boolean)
    .sort((first, second) => new Date(second.purchaseDate) - new Date(first.purchaseDate));
};
