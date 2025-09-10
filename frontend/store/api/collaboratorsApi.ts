import { api } from "@/lib/api";
import { ApiResponse } from "@/types/response";

export type CollaboratorRole = "viewer" | "commenter" | "editor";

export interface Collaborator {
    id: string;
    role: CollaboratorRole;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface AddCollaboratorRequest {
    user_id: string;
    role: CollaboratorRole;
    expires_at?: string;
}

export interface UpdateCollaboratorRequest {
    role?: CollaboratorRole;
    expires_at?: string;
}

export const collaboratorsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // File collaborators
        getFileCollaborators: builder.query<
            ApiResponse<Collaborator[]>,
            string
        >({
            query: (fileId) => ({
                url: `/files/${fileId}/collaborators`,
            }),
            providesTags: (result, error, fileId) => [
                { type: "Collaborators", id: fileId },
            ],
        }),

        addFileCollaborator: builder.mutation<
            ApiResponse<Collaborator>,
            { fileId: string; data: AddCollaboratorRequest }
        >({
            query: ({ fileId, data }) => ({
                url: `/files/${fileId}/collaborators`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { fileId }) => [
                { type: "Collaborators", id: fileId },
            ],
        }),

        updateFileCollaborator: builder.mutation<
            ApiResponse<Collaborator>,
            {
                fileId: string;
                collaboratorId: string;
                data: UpdateCollaboratorRequest;
            }
        >({
            query: ({ fileId, collaboratorId, data }) => ({
                url: `/files/${fileId}/collaborators/${collaboratorId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { fileId }) => [
                { type: "Collaborators", id: fileId },
            ],
        }),

        removeFileCollaborator: builder.mutation<
            ApiResponse<void>,
            { fileId: string; collaboratorId: string }
        >({
            query: ({ fileId, collaboratorId }) => ({
                url: `/files/${fileId}/collaborators/${collaboratorId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { fileId }) => [
                { type: "Collaborators", id: fileId },
            ],
        }),

        // Folder collaborators
        getFolderCollaborators: builder.query<
            ApiResponse<Collaborator[]>,
            string
        >({
            query: (folderId) => ({
                url: `/folders/${folderId}/collaborators`,
            }),
            providesTags: (result, error, folderId) => [
                { type: "Collaborators", id: folderId },
            ],
        }),

        addFolderCollaborator: builder.mutation<
            ApiResponse<Collaborator>,
            { folderId: string; data: AddCollaboratorRequest }
        >({
            query: ({ folderId, data }) => ({
                url: `/folders/${folderId}/collaborators`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { folderId }) => [
                { type: "Collaborators", id: folderId },
            ],
        }),

        updateFolderCollaborator: builder.mutation<
            ApiResponse<Collaborator>,
            {
                folderId: string;
                collaboratorId: string;
                data: UpdateCollaboratorRequest;
            }
        >({
            query: ({ folderId, collaboratorId, data }) => ({
                url: `/folders/${folderId}/collaborators/${collaboratorId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { folderId }) => [
                { type: "Collaborators", id: folderId },
            ],
        }),

        removeFolderCollaborator: builder.mutation<
            ApiResponse<void>,
            { folderId: string; collaboratorId: string }
        >({
            query: ({ folderId, collaboratorId }) => ({
                url: `/folders/${folderId}/collaborators/${collaboratorId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { folderId }) => [
                { type: "Collaborators", id: folderId },
            ],
        }),

        // Search users for collaboration
        searchUsers: builder.query<
            ApiResponse<{ id: string; name: string; email: string }[]>,
            string
        >({
            query: (searchTerm) => ({
                url: `/users/search?q=${encodeURIComponent(searchTerm)}`,
            }),
        }),
    }),
});

export const {
    useGetFileCollaboratorsQuery,
    useAddFileCollaboratorMutation,
    useUpdateFileCollaboratorMutation,
    useRemoveFileCollaboratorMutation,
    useGetFolderCollaboratorsQuery,
    useAddFolderCollaboratorMutation,
    useUpdateFolderCollaboratorMutation,
    useRemoveFolderCollaboratorMutation,
    useSearchUsersQuery,
} = collaboratorsApi;
