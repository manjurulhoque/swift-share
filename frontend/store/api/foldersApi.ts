import { api } from "@/lib/api";
import { ApiResponse } from "@/types/response";

export interface Folder {
    id: string;
    name: string;
    path: string;
    parent_id?: string;
    is_shared: boolean;
    color: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    file_count: number;
    subfolder_count: number;
}

export interface Breadcrumb {
    id: string;
    name: string;
    path: string;
}

export interface FolderContents {
    folders: Folder[];
    files: any[];
    breadcrumbs: Breadcrumb[];
    parent_id?: string;
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface CreateFolderRequest {
    name: string;
    parent_id?: string;
    color?: string;
}

export interface UpdateFolderRequest {
    name: string;
    color?: string;
}

export interface MoveFolderRequest {
    parent_id?: string;
}

export const foldersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get folder contents (folders + files)
        getFolderContents: builder.query<
            ApiResponse<FolderContents>,
            {
                parent_id?: string;
                page?: number;
                limit?: number;
                search?: string;
            }
        >({
            query: ({ parent_id, page = 1, limit = 20, search }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                if (parent_id) params.append("parent_id", parent_id);
                if (search) params.append("search", search);

                return `/folders?${params.toString()}`;
            },
            providesTags: ["Files"],
        }),

        // Get specific folder
        getFolder: builder.query<ApiResponse<Folder>, string>({
            query: (id) => `/folders/${id}`,
            providesTags: (result, error, id) => [{ type: "Files", id }],
        }),

        // Create folder
        createFolder: builder.mutation<
            ApiResponse<Folder>,
            CreateFolderRequest
        >({
            query: (data) => ({
                url: "/folders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Files"],
        }),

        // Update folder
        updateFolder: builder.mutation<
            ApiResponse<Folder>,
            { id: string; data: UpdateFolderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/folders/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Files", id },
                "Files",
            ],
        }),

        // Move folder
        moveFolder: builder.mutation<
            ApiResponse<Folder>,
            { id: string; data: MoveFolderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/folders/${id}/move`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Files"],
        }),

        // Delete folder
        deleteFolder: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/folders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Files"],
        }),
    }),
});

export const {
    useGetFolderContentsQuery,
    useGetFolderQuery,
    useCreateFolderMutation,
    useUpdateFolderMutation,
    useMoveFolderMutation,
    useDeleteFolderMutation,
} = foldersApi;
