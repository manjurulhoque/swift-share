import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Custom base query with authentication and error handling
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
        // Get token from NextAuth session
        const session = await getSession();
        const token = session?.accessToken;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        headers.set("Content-Type", "application/json");
        return headers;
    },
});

// Enhanced base query with retry logic and error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401, try to refresh the token
    if (result.error && result.error.status === 401) {
        const session = await getSession();
        const refreshToken = session?.refreshToken;

        if (refreshToken) {
            // Try to refresh the token
            const refreshResult = await baseQuery(
                {
                    url: "/auth/refresh",
                    method: "POST",
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                // Note: NextAuth will handle token refresh automatically
                // We don't need to manually store tokens here

                // Retry the original request
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed, redirect to login
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        } else {
            // No refresh token, redirect to login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
    }

    return result;
};

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Auth", "Profile", "Files", "Shares"],
    endpoints: () => ({}),
});

// Export hooks for use in components
export const { usePrefetch } = api;

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "auth/login/",
        REGISTER: "auth/register/",
        REFRESH: "auth/refresh/",
        PROFILE: "profile/",
        CHANGE_PASSWORD: "password/change/",
        RESET_PASSWORD: "password/reset/",
        RESET_PASSWORD_CONFIRM: "password/reset/confirm/",
        VERIFY_EMAIL: "email/verify/",
        RESEND_VERIFICATION: "email/resend/",
    },
    FILES: {
        BASE: "files/",
        UPLOAD: "files/upload/",
        DOWNLOAD: "files/download/",
        UPDATE: "files/update/",
        DELETE: "files/delete/",
        GET: "files/get/",
        GET_ALL: "files/get-all/",
        GET_ALL_BY_USER: "files/get-all-by-user/",
        GET_ALL_BY_USER_AND_FILE_NAME: "files/get-all-by-user-and-file-name/",
    },
    SHARES: {
        BASE: "shares/",
        CREATE: "shares/",
        GET: "shares/",
        GET_BY_ID: "shares/",
        UPDATE: "shares/",
        DELETE: "shares/",
        PRESIGNED_URL: "shares/",
    },
    USERS: {
        BASE: "users/",
    },
} as const;
