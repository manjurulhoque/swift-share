import { api } from "../../lib/api";
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ProfileUpdateRequest,
    RefreshTokenRequest,
    ProfileResponse,
} from "@/types/auth";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && typeof window !== "undefined") {
                        localStorage.setItem(
                            "accessToken",
                            data.data.tokens.access_token
                        );
                        localStorage.setItem(
                            "refreshToken",
                            data.data.tokens.refresh_token
                        );
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
            invalidatesTags: ["Auth", "User"],
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && typeof window !== "undefined") {
                        localStorage.setItem(
                            "accessToken",
                            data.data.tokens.access_token
                        );
                        localStorage.setItem(
                            "refreshToken",
                            data.data.tokens.refresh_token
                        );
                    }
                } catch (error) {
                    console.error("Registration failed:", error);
                }
            },
            invalidatesTags: ["Auth", "User"],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                    }
                } catch (error) {
                    console.error("Logout failed:", error);
                    // Clear tokens even if logout request fails
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                    }
                }
            },
            invalidatesTags: ["Auth", "User", "Profile"],
        }),

        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (refreshData) => ({
                url: "/auth/refresh",
                method: "POST",
                body: refreshData,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && typeof window !== "undefined") {
                        localStorage.setItem(
                            "accessToken",
                            data.data.tokens.access_token
                        );
                        localStorage.setItem(
                            "refreshToken",
                            data.data.tokens.refresh_token
                        );
                    }
                } catch (error) {
                    console.error("Token refresh failed:", error);
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                    }
                }
            },
        }),

        getProfile: builder.query<ProfileResponse, void>({
            query: () => "/auth/profile",
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation<ProfileResponse, ProfileUpdateRequest>({
            query: (profileData) => ({
                url: "/auth/profile",
                method: "PUT",
                body: profileData,
            }),
            invalidatesTags: ["Profile", "User"],
        }),

        changePassword: builder.mutation<
            { success: boolean; message: string },
            { current_password: string; new_password: string }
        >({
            query: (passwordData) => ({
                url: "/auth/change-password",
                method: "POST",
                body: passwordData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;
