import { api, API_ENDPOINTS } from "@/lib/api";
import {
    File,
    FileUpdateRequest,
    FilesResponse,
    GetFilesParams,
} from "@/types/file";
import { ApiResponse } from "@/types/response";

export const filesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFiles: builder.query<ApiResponse<FilesResponse>, GetFilesParams>({
            query: ({ page, limit, search }) => ({
                url: API_ENDPOINTS.FILES.BASE,
                params: {
                    page: page || 1,
                    limit: limit || 10,
                    search: search || "",
                },
            }),
        }),

        getFile: builder.query<File, string>({
            query: (id) => API_ENDPOINTS.FILES.GET + id,
            providesTags: (result, error, id) => [{ type: "Files", id }],
        }),

        uploadFile: builder.mutation<File, FormData>({
            query: (formData) => ({
                url: API_ENDPOINTS.FILES.UPLOAD,
                method: "POST",
                body: formData,
                headers: {
                    // Don't set Content-Type for FormData, let the browser set it
                },
            }),
        }),

        uploadMultipleFiles: builder.mutation<
            {
                uploaded_files: File[];
                total_files: number;
                success_count: number;
                error_count: number;
                errors?: string[];
            },
            FormData
        >({
            query: (formData) => ({
                url: API_ENDPOINTS.FILES.UPLOAD_MULTIPLE,
                method: "POST",
                body: formData,
                headers: {
                    // Don't set Content-Type for FormData, let the browser set it
                },
            }),
        }),

        updateFile: builder.mutation<
            File,
            { id: string; data: FileUpdateRequest }
        >({
            query: ({ id, data }) => ({
                url: `/files/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Files", id }],
        }),

        deleteFile: builder.mutation<void, string>({
            query: (id) => ({
                url: `/files/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Files", id }],
        }),

        getPresignedDownloadUrl: builder.mutation<
            ApiResponse<{ download_url: string; expires_in_minutes: number }>,
            { id: string; expiration?: number }
        >({
            query: ({ id, expiration }) => ({
                url: `/files/${id}/presigned-url${
                    expiration ? `?expiration=${expiration}` : ""
                }`,
                method: "POST",
            }),
        }),

        getRecentFiles: builder.query<
            ApiResponse<{ recent_files: any[]; total: number }>,
            { limit?: number }
        >({
            query: ({ limit = 20 }) => ({
                url: `/files/recent?limit=${limit}`,
            }),
            providesTags: ["Files"],
        }),

        getFileAccessHistory: builder.query<
            ApiResponse<{ access_history: any[]; total: number; file: any }>,
            { id: string; limit?: number }
        >({
            query: ({ id, limit = 50 }) => ({
                url: `/files/${id}/history?limit=${limit}`,
            }),
            providesTags: (result, error, { id }) => [{ type: "Files", id }],
        }),
    }),
});

export const {
    useGetFilesQuery,
    useGetFileQuery,
    useUploadFileMutation,
    useUploadMultipleFilesMutation,
    useUpdateFileMutation,
    useDeleteFileMutation,
    useGetPresignedDownloadUrlMutation,
    useGetRecentFilesQuery,
    useGetFileAccessHistoryQuery,
} = filesApi;
