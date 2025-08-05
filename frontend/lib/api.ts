import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Custom base query with authentication and error handling
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        // Get token from localStorage or session
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;

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
        const refreshToken =
            typeof window !== "undefined"
                ? localStorage.getItem("refreshToken")
                : null;

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
                // Store the new tokens
                const { access_token, refresh_token } =
                    refreshResult.data as any;
                if (typeof window !== "undefined") {
                    localStorage.setItem("accessToken", access_token);
                    localStorage.setItem("refreshToken", refresh_token);
                }

                // Retry the original request
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed, clear tokens and redirect to login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
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
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Auth", "Profile"],
    endpoints: () => ({}),
});

// Export hooks for use in components
export const { usePrefetch } = api;
