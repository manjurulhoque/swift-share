export interface File {
    id: string;
    folder_id?: string;
    file_name: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    file_extension: string;
    is_public: boolean;
    is_starred: boolean;
    download_count: number;
    description: string;
    tags: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    folder?: {
        id: string;
        name: string;
        path: string;
    };
}

export interface FileUploadRequest {
    description?: string;
    tags?: string;
    is_public?: boolean;
    folder_id?: string;
}

export interface FileUpdateRequest {
    description?: string;
    tags?: string;
    is_public?: boolean;
    is_starred?: boolean;
}

export interface FilesResponse {
    files: File[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface GetFilesParams {
    page?: number;
    limit?: number;
    search?: string;
}
