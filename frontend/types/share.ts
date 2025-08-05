import { File } from "./file";
import { User } from "./auth";

export interface ShareLink {
    id: string;
    token: string;
    expires_at: string | null;
    max_downloads: number;
    download_count: number;
    is_active: boolean;
    description: string;
    has_password: boolean;
    created_at: string;
    updated_at: string;
    file?: File;
    user?: User;
}

export interface CreateShareRequest {
    file_id: string;
    password?: string;
    expires_at?: string;
    max_downloads?: number;
    description?: string;
}

export interface UpdateShareRequest {
    password?: string;
    expires_at?: string;
    max_downloads?: number;
    description?: string;
    is_active?: boolean;
}

export interface SharesResponse {
    share_links: ShareLink[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface GetSharesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PresignedUrlRequest {
    expiration?: number; // in seconds
}

export interface PresignedUrlResponse {
    url: string;
    expires_at: string;
}
