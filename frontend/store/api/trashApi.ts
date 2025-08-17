import { api } from "@/lib/api";
import { ApiResponse } from "@/types/response";

export interface TrashedItem {
    id: string;
    type: "file" | "folder";
    name: string;
    original_name?: string;
    file_size?: number;
    mime_type?: string;
    file_extension?: string;
    path?: string;
    trashed_at: string;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    folder?: {
        id: string;
        name: string;
        path: string;
    };
}

export interface TrashResponse {
    files: TrashedItem[];
    folders: TrashedItem[];
    total_files: number;
    total_folders: number;
    total_items: number;
    current_page: number;
    total_pages: number;
    page_size: number;
}

export const trashApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTrashedItems: builder.query<
            ApiResponse<TrashResponse>,
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 20 }) => ({
                url: `/trash/?page=${page}&limit=${limit}`,
            }),
            providesTags: ["Files"],
        }),

        moveFileToTrash: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/files/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Files"],
        }),

        moveFolderToTrash: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/folders/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Files"],
        }),

        restoreFile: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/files/${id}/restore`,
                method: "POST",
            }),
            invalidatesTags: ["Files"],
        }),

        restoreFolder: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/folders/${id}/restore`,
                method: "POST",
            }),
            invalidatesTags: ["Files"],
        }),

        permanentlyDeleteFile: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/files/${id}/permanent`,
                method: "DELETE",
            }),
            invalidatesTags: ["Files"],
        }),

        permanentlyDeleteFolder: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/trash/folders/${id}/permanent`,
                method: "DELETE",
            }),
            invalidatesTags: ["Files"],
        }),

        emptyTrash: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: "/trash/empty",
                method: "DELETE",
            }),
            invalidatesTags: ["Files"],
        }),
    }),
});

export const {
    useGetTrashedItemsQuery,
    useMoveFileToTrashMutation,
    useMoveFolderToTrashMutation,
    useRestoreFileMutation,
    useRestoreFolderMutation,
    usePermanentlyDeleteFileMutation,
    usePermanentlyDeleteFolderMutation,
    useEmptyTrashMutation,
} = trashApi;
