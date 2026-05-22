import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from '../../../shared/api/baseApi';
import { homePostsMockData } from '../mockData';
import { serializeQueryParams } from '../../../shared/api/serializeQueryParams';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const realBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_URL || '/api/v1'),
    paramsSerializer: serializeQueryParams,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.access_token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

const buildMockPostsResponse = (params = {}) => {
    const page = Math.max(1, parseNumber(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseNumber(params.page_size) || 20));

    let items = [...homePostsMockData];

    const city = normalizeText(params.city);
    const district = normalizeText(params.district);
    const ward = normalizeText(params.ward);
    const roomType = normalizeText(params.room_type);
    const minPrice = parseNumber(params.min_price);
    const maxPrice = parseNumber(params.max_price);
    const sortBy = normalizeText(params.sort_by) || 'newest';

    if (city) {
        items = items.filter((post) => normalizeText(post.city).includes(city));
    }

    if (district) {
        items = items.filter((post) => normalizeText(post.district).includes(district));
    }

    if (ward) {
        items = items.filter((post) => normalizeText(post.ward).includes(ward));
    }

    if (roomType) {
        items = items.filter((post) => normalizeText(post.room_type).includes(roomType));
    }

    if (minPrice !== null) {
        items = items.filter((post) => Number(post.price) >= minPrice);
    }

    if (maxPrice !== null) {
        items = items.filter((post) => Number(post.price) <= maxPrice);
    }

    if (sortBy === 'price_asc') {
        items.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
        items.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return {
        items: items.slice(start, start + pageSize),
        total,
        page,
        page_size: pageSize,
        total_pages: totalPages,
    };
};

export const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            async queryFn(params = {}, _queryApi, _extraOptions) {
                if (USE_MOCK) {
                    return { data: buildMockPostsResponse(params) };
                }

                const result = await realBaseQuery(
                    {
                        url: '/posts',
                        params,
                    },
                    _queryApi,
                    _extraOptions
                );

                if (result.error) {
                    return { error: result.error };
                }

                return { data: result.data };
            },
        }),
    }),
});

export const { useGetPostsQuery } = postsApi;