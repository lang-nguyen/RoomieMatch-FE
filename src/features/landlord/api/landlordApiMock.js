import { baseApi } from '../../../shared/api/baseApi';
import {
  MOCK_ROOMS,
  MOCK_PACKAGES,
  MOCK_NOTIFICATIONS,
  MOCK_LANDLORD_PROFILE,
  buildRoom,
  findRoomById,
  delay,
} from './landlordMockData';

export const landlordApiMock = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({

    // ── Rooms ──────────────────────────────────────────────────────────────
    getLandlordRooms: builder.query({
      queryFn: async ({ page = 1, pageSize = 6, search = '', status = '' } = {}) => {
        await delay(350);
        let filtered = MOCK_ROOMS.map(buildRoom);

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.code.toLowerCase().includes(q) ||
              r.address.toLowerCase().includes(q),
          );
        }

        if (status) {
          filtered = filtered.filter((r) => r.status === status);
        }

        const total = filtered.length;
        const total_pages = Math.ceil(total / pageSize);
        const items = filtered.slice((page - 1) * pageSize, page * pageSize);

        return { data: { items, total, total_pages, page, page_size: pageSize } };
      },
    }),

    getLandlordRoomById: builder.query({
      queryFn: async ({ id }) => {
        await delay(200);
        const room = findRoomById(id);
        if (!room) {
          return { error: { status: 404, data: { message: 'Không tìm thấy phòng trọ' } } };
        }
        return { data: buildRoom(room) };
      },
    }),

    addRoom: builder.mutation({
      queryFn: async (roomData) => {
        await delay(500);
        const newRoom = buildRoom({
          id: Date.now(),
          code: `TRO-${String(MOCK_ROOMS.length + 1).padStart(3, '0')}`,
          ...roomData,
        });
        // Giả lập thêm vào danh sách (trong thực tế sẽ mutation server-side)
        MOCK_ROOMS.push({ ...roomData, id: newRoom.id, code: newRoom.code });
        return { data: newRoom };
      },
    }),

    updateRoom: builder.mutation({
      queryFn: async ({ id, ...data }) => {
        await delay(400);
        const idx = MOCK_ROOMS.findIndex((r) => r.id === Number(id));
        if (idx === -1) {
          return { error: { status: 404, data: { message: 'Không tìm thấy phòng trọ' } } };
        }
        const updated = buildRoom({ ...MOCK_ROOMS[idx], ...data });
        MOCK_ROOMS[idx] = { ...MOCK_ROOMS[idx], ...data };
        return { data: updated };
      },
    }),

    deleteRoom: builder.mutation({
      queryFn: async ({ id }) => {
        await delay(300);
        const idx = MOCK_ROOMS.findIndex((r) => r.id === Number(id));
        if (idx === -1) {
          return { error: { status: 404, data: { message: 'Không tìm thấy phòng trọ' } } };
        }
        MOCK_ROOMS.splice(idx, 1);
        return { data: { success: true } };
      },
    }),

    // ── Packages ───────────────────────────────────────────────────────────
    getPackages: builder.query({
      queryFn: async ({ tier = '', search = '' } = {}) => {
        await delay(250);
        let filtered = [...MOCK_PACKAGES];

        if (tier && tier !== 'all') {
          filtered = filtered.filter((p) => p.tier === tier);
        }

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
        }

        return { data: { items: filtered } };
      },
    }),

    purchasePackage: builder.mutation({
      queryFn: async ({ packageId }) => {
        await delay(600);
        const pkg = MOCK_PACKAGES.find((p) => p.id === packageId);
        if (!pkg) {
          return { error: { status: 404, data: { message: 'Gói không tồn tại' } } };
        }
        return {
          data: {
            success: true,
            message: `Đăng ký gói ${pkg.name} thành công`,
            package: pkg,
          },
        };
      },
    }),

    // ── Notifications ──────────────────────────────────────────────────────
    getLandlordNotifications: builder.query({
      queryFn: async ({ page = 1, pageSize = 10 } = {}) => {
        await delay(200);
        const total = MOCK_NOTIFICATIONS.length;
        const items = MOCK_NOTIFICATIONS.slice((page - 1) * pageSize, page * pageSize);
        const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
        return { data: { items, total, unread } };
      },
    }),

    // ── Profile ────────────────────────────────────────────────────────────
    getLandlordProfile: builder.query({
      queryFn: async () => {
        await delay(300);
        return { data: { profile: MOCK_LANDLORD_PROFILE } };
      },
    }),

    updateLandlordProfile: builder.mutation({
      queryFn: async (updates) => {
        await delay(400);
        Object.assign(MOCK_LANDLORD_PROFILE, updates);
        return { data: { profile: { ...MOCK_LANDLORD_PROFILE } } };
      },
    }),
  }),
});

export const {
  useGetLandlordRoomsQuery,
  useGetLandlordRoomByIdQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetPackagesQuery,
  usePurchasePackageMutation,
  useGetLandlordNotificationsQuery,
  useGetLandlordProfileQuery,
  useUpdateLandlordProfileMutation,
} = landlordApiMock;
