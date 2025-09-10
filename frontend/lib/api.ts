import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Custom base query with authentication and error handling
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, api) => {
        // Get token from NextAuth session
        const session = await getSession();
        const token = session?.accessToken;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        if (api.endpoint === "uploadMultipleFiles") {
            // headers.set("Content-Type", "multipart/form-data");
        } else {
            headers.set("Content-Type", "application/json");
        }

        return headers;
    },
});

// Enhanced base query with error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401, redirect to login (NextAuth will handle token refresh automatically)
    if (result.error && result.error.status === 401) {
        // if (typeof window !== "undefined") {
        //     window.location.href = "/login";
        // }
    }

    return result;
};

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User",
        "Auth",
        "Profile",
        "Files",
        "Shares",
        "Dashboard",
        "FileCollaborators",
        "FolderCollaborators",
        "Collaborators",
    ],
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
        UPLOAD_MULTIPLE: "files/upload-multiple",
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
    FOLDERS: {
        BASE: "folders/",
        CREATE: "folders/",
        GET: "folders/",
        GET_BY_ID: "folders/",
        UPDATE: "folders/",
        DELETE: "folders/",
    },
} as const;
