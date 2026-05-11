import { baseApi } from '../../../shared/api/baseApi';

export const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({ page = 1, page_size = 20 } = {}) => ({
                url: '/posts',
                params: {
                    page,
                    page_size,
                },
            }),
        }),
    }),
});

export const { useGetPostsQuery } = postsApi;