import { api, API_ENDPOINTS } from "../../lib/api";

// User management types
export interface UserListResponse {
    success: boolean;
    message: string;
    data: {
        users: Array<{
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            is_active: boolean;
            is_admin: boolean;
            email_verified: boolean;
            last_login_at: string | null;
            created_at: string;
            updated_at: string;
        }>;
        total: number;
        page: number;
        limit: number;
    };
}

export interface UserUpdateRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    is_active?: boolean;
    is_admin?: boolean;
}

export interface UserUpdateResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        is_active: boolean;
        is_admin: boolean;
        email_verified: boolean;
        last_login_at: string | null;
        created_at: string;
        updated_at: string;
    };
}

export interface UserDeleteResponse {
    success: boolean;
    message: string;
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<
            UserListResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: (params) => ({
                url: API_ENDPOINTS.USERS.BASE,
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.users.map(({ id }) => ({
                              type: "User" as const,
                              id,
                          })),
                          { type: "User", id: "LIST" },
                      ]
                    : [{ type: "User", id: "LIST" }],
        }),

        getUserById: builder.query<UserUpdateResponse, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        updateUser: builder.mutation<
            UserUpdateResponse,
            { id: string; data: UserUpdateRequest }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),

        deleteUser: builder.mutation<UserDeleteResponse, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),

        activateUser: builder.mutation<UserUpdateResponse, string>({
            query: (id) => ({
                url: `/users/${id}/activate`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),

        deactivateUser: builder.mutation<UserUpdateResponse, string>({
            query: (id) => ({
                url: `/users/${id}/deactivate`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),

        resendVerificationEmail: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/users/${id}/resend-verification`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useResendVerificationEmailMutation,
} = userApi;
