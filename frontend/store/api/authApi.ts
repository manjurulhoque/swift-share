import { api, API_ENDPOINTS } from "../../lib/api";
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
                url: API_ENDPOINTS.AUTH.LOGIN,
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
                url: API_ENDPOINTS.AUTH.REGISTER,
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
        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (refreshData) => ({
                url: API_ENDPOINTS.AUTH.REFRESH,
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
            query: () => API_ENDPOINTS.AUTH.PROFILE,
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation<ProfileResponse, ProfileUpdateRequest>({
            query: (profileData) => ({
                url: API_ENDPOINTS.AUTH.PROFILE,
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
                url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
                method: "POST",
                body: passwordData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;
