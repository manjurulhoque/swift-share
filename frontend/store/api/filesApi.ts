import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface File {
    id: string;
    file_name: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    file_extension: string;
    is_public: boolean;
    download_count: number;
    description: string;
    tags: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface FileUploadRequest {
    description?: string;
    tags?: string;
    is_public?: boolean;
}

export interface FileUpdateRequest {
    description?: string;
    tags?: string;
    is_public?: boolean;
}

export interface FilesResponse {
    files: File[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface GetFilesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const filesApi = createApi({
    reducerPath: "filesApi",
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
        prepareHeaders: (headers, { getState }) => {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("accessToken")
                    : null;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Files"],
    endpoints: (builder) => ({
        getFiles: builder.query<FilesResponse, GetFilesParams>({
            query: (params) => ({
                url: "/files",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.files.map(({ id }) => ({
                              type: "Files" as const,
                              id,
                          })),
                          { type: "Files", id: "LIST" },
                      ]
                    : [{ type: "Files", id: "LIST" }],
        }),

        getFile: builder.query<File, string>({
            query: (id) => `/files/${id}`,
            providesTags: (result, error, id) => [{ type: "Files", id }],
        }),

        uploadFile: builder.mutation<File, FormData>({
            query: (formData) => ({
                url: "/files/upload",
                method: "POST",
                body: formData,
                headers: {
                    // Don't set Content-Type for FormData, let the browser set it
                },
            }),
            invalidatesTags: [{ type: "Files", id: "LIST" }],
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
            invalidatesTags: (result, error, { id }) => [
                { type: "Files", id },
                { type: "Files", id: "LIST" },
            ],
        }),

        deleteFile: builder.mutation<void, string>({
            query: (id) => ({
                url: `/files/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Files", id: "LIST" }],
        }),

        downloadFile: builder.mutation<{ download_url: string }, string>({
            query: (id) => ({
                url: `/files/${id}/download`,
                method: "GET",
            }),
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
