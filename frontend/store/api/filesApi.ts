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
            query: (params) => ({
                url: API_ENDPOINTS.FILES.BASE,
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
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

        downloadFile: builder.mutation<{ download_url: string }, string>({
            query: (id) => ({
                url: `/files/${id}/download`,
                method: "GET",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Files", id }],
        }),
    }),
});

export const {
    useGetFilesQuery,
    useGetFileQuery,
    useUploadFileMutation,
    useUpdateFileMutation,
    useDeleteFileMutation,
    useDownloadFileMutation,
} = filesApi;
