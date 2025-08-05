import { api, API_ENDPOINTS } from "@/lib/api";
import {
    ShareLink,
    CreateShareRequest,
    UpdateShareRequest,
    SharesResponse,
    GetSharesParams,
    PresignedUrlRequest,
    PresignedUrlResponse,
} from "@/types/share";
import { ApiResponse } from "@/types/response";

export const sharesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getShares: builder.query<ApiResponse<SharesResponse>, GetSharesParams>({
            query: (params) => ({
                url: API_ENDPOINTS.SHARES.GET,
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
                },
            }),
            providesTags: (result) =>
                result?.data?.share_links
                    ? [
                          ...result.data.share_links.map(
                              (shareLink: ShareLink) => ({
                                  type: "Shares" as const,
                                  id: shareLink.id,
                              })
                          ),
                          { type: "Shares", id: "LIST" },
                      ]
                    : [{ type: "Shares", id: "LIST" }],
        }),

        getShare: builder.query<ApiResponse<ShareLink>, string>({
            query: (id) => `${API_ENDPOINTS.SHARES.GET_BY_ID}${id}`,
            providesTags: (result, error, id) => [{ type: "Shares", id }],
        }),

        createShare: builder.mutation<
            ApiResponse<ShareLink>,
            CreateShareRequest
        >({
            query: (data) => ({
                url: API_ENDPOINTS.SHARES.CREATE,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Shares", id: "LIST" }],
        }),

        updateShare: builder.mutation<
            ApiResponse<ShareLink>,
            { id: string; data: UpdateShareRequest }
        >({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.SHARES.UPDATE}${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Shares", id },
                { type: "Shares", id: "LIST" },
            ],
        }),

        deleteShare: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.SHARES.DELETE}${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Shares", id },
                { type: "Shares", id: "LIST" },
            ],
        }),

        generatePresignedUrl: builder.mutation<
            ApiResponse<PresignedUrlResponse>,
            { id: string; data: PresignedUrlRequest }
        >({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.SHARES.PRESIGNED_URL}${id}/presigned-url`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetSharesQuery,
    useGetShareQuery,
    useCreateShareMutation,
    useUpdateShareMutation,
    useDeleteShareMutation,
    useGeneratePresignedUrlMutation,
} = sharesApi;
