import { api } from "@/lib/api";
import { ApiResponse } from "@/types/response";

export type SharePermission = "view" | "comment" | "edit";

export interface ShareLink {
    id: string;
    token: string;
    permission: SharePermission;
    has_password: boolean;
    is_public: boolean;
    allow_download: boolean;
    view_count: number;
    download_count: number;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    share_url: string;
    file?: {
        id: string;
        original_name: string;
        file_size: number;
        mime_type: string;
        file_extension: string;
    };
    folder?: {
        id: string;
        name: string;
        path: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface ShareLinkCreateRequest {
    file_id?: string;
    folder_id?: string;
    permission: SharePermission;
    password?: string;
    expires_at?: string;
    allow_download: boolean;
}

export interface ShareLinkUpdateRequest {
    permission?: SharePermission;
    password?: string;
    expires_at?: string;
    allow_download?: boolean;
    is_active?: boolean;
}

export interface ShareLinksResponse {
    share_links: ShareLink[];
    total: number;
    current_page: number;
    total_pages: number;
    page_size: number;
}

export interface ShareStats {
    total_links: number;
    active_links: number;
    total_views: number;
    total_downloads: number;
    permission_breakdown: Array<{
        permission: string;
        count: number;
    }>;
}

export interface PublicShareInfo {
    id: string;
    permission: SharePermission;
    allow_download: boolean;
    expires_at?: string;
    has_password: boolean;
    file?: {
        id: string;
        original_name: string;
        file_size: number;
        mime_type: string;
        file_extension: string;
    };
    folder?: {
        id: string;
        name: string;
        path: string;
    };
    owner: {
        id: string;
        name: string;
        email: string;
    };
}

export interface ShareAccessRequest {
    password?: string;
}

export const shareApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createShareLink: builder.mutation<
            ApiResponse<ShareLink>,
            ShareLinkCreateRequest
        >({
            query: (data) => ({
                url: "/share",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Shares"],
        }),

        getShareLinks: builder.query<
            ApiResponse<ShareLinksResponse>,
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 20 }) => ({
                url: `/share?page=${page}&limit=${limit}`,
            }),
            providesTags: ["Shares"],
        }),

        getShareLink: builder.query<ApiResponse<ShareLink>, string>({
            query: (id) => ({
                url: `/share/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Shares", id }],
        }),

        updateShareLink: builder.mutation<
            ApiResponse<ShareLink>,
            { id: string; data: ShareLinkUpdateRequest }
        >({
            query: ({ id, data }) => ({
                url: `/share/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Shares", id },
            ],
        }),

        deleteShareLink: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/share/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Shares"],
        }),

        getShareStats: builder.query<ApiResponse<ShareStats>, void>({
            query: () => ({
                url: "/share/stats",
            }),
            providesTags: ["Shares"],
        }),

        getPublicShareInfo: builder.query<ApiResponse<PublicShareInfo>, string>(
            {
                query: (token) => ({
                    url: `/public/share/${token}`,
                }),
            }
        ),

        accessPublicShare: builder.mutation<
            ApiResponse<PublicShareInfo>,
            { token: string; password?: string }
        >({
            query: ({ token, password }) => ({
                url: `/public/share/${token}`,
                method: "POST",
                body: password ? { password } : {},
            }),
        }),
    }),
});

export const {
    useCreateShareLinkMutation,
    useGetShareLinksQuery,
    useGetShareLinkQuery,
    useUpdateShareLinkMutation,
    useDeleteShareLinkMutation,
    useGetShareStatsQuery,
    useGetPublicShareInfoQuery,
    useAccessPublicShareMutation,
} = shareApi;
