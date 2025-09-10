"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    Search,
    Filter,
    Users,
    FileText,
    Folder,
    Download,
    Eye,
    MoreHorizontal,
    Grid3X3,
    List,
    SortAsc,
    SortDesc,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { useGetSharedWithMeFilesQuery } from "@/store/api/filesApi";
import { useGetSharedWithMeFoldersQuery } from "@/store/api/foldersApi";
import { FileCard } from "@/components/cards/file-card";
import { FolderCard } from "@/components/cards/folder-card";
import { FilePreview } from "@/components/preview/file-preview";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type ViewMode = "grid" | "list";
type SortField = "name" | "modified" | "size" | "type";
type SortOrder = "asc" | "desc";

export default function SharedWithMePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortField, setSortField] = useState<SortField>("modified");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [previewFile, setPreviewFile] = useState<any | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // API hooks
    const {
        data: filesData,
        isLoading: isLoadingFiles,
        error: filesError,
        refetch: refetchFiles,
    } = useGetSharedWithMeFilesQuery({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
    });

    const {
        data: foldersData,
        isLoading: isLoadingFolders,
        error: foldersError,
        refetch: refetchFolders,
    } = useGetSharedWithMeFoldersQuery({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
    });

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    const files = filesData?.data?.files || [];
    const folders = foldersData?.data?.folders || [];
    const filesPagination = filesData?.data?.pagination;
    const foldersPagination = foldersData?.data?.pagination;

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePreviewFile = (file: any) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const handleDownloadFile = async (fileId: string, fileName: string) => {
        toast.info("Download started!");
    };

    const handleShareFile = async (fileId: string) => {
        toast.info("Share feature coming soon!");
    };

    const handleShareFolder = async (folderId: string) => {
        toast.info("Share feature coming soon!");
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const isLoading = isLoadingFiles || isLoadingFolders;
    const error = filesError || foldersError;

    if (error) {
        return (
            <SidebarInset>
                <div className="flex flex-col">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">
                            Shared with Me
                        </h1>
                    </header>
                    <div className="flex-1 p-4">
                        <Card>
                            <CardContent className="p-12 text-center">
                                <p className="text-gray-600 mb-4">
                                    Failed to load shared files and folders.
                                    Please try again.
                                </p>
                                <Button
                                    onClick={() => {
                                        refetchFiles();
                                        refetchFolders();
                                    }}
                                >
                                    Retry
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        );
    }

    return (
        <SidebarInset>
            <div className="flex flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="text-lg font-semibold">Shared with Me</h1>
                </header>

                <div className="flex-1 p-4">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search shared files and folders..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                <div className="flex border rounded-lg">
                                    <Button
                                        variant={
                                            viewMode === "grid"
                                                ? "default"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="rounded-r-none"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            viewMode === "list"
                                                ? "default"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="rounded-l-none"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : folders.length === 0 && files.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No shared files or folders yet
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Files and folders shared with you by
                                        other users will appear here.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {/* Shared Folders */}
                                {folders.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Folder className="h-5 w-5 text-blue-600" />
                                            <h2 className="text-lg font-semibold">
                                                Shared Folders
                                            </h2>
                                            <Badge variant="secondary">
                                                {folders.length}
                                            </Badge>
                                        </div>
                                        <div
                                            className={`grid gap-4 ${
                                                viewMode === "grid"
                                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {folders.map((folder) => (
                                                <FolderCard
                                                    key={folder.id}
                                                    folder={folder}
                                                    onOpen={() => {}}
                                                    onEdit={() => {}}
                                                    onDelete={() => {}}
                                                    onMove={() => {}}
                                                    onShare={handleShareFolder}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Shared Files */}
                                {files.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="h-5 w-5 text-green-600" />
                                            <h2 className="text-lg font-semibold">
                                                Shared Files
                                            </h2>
                                            <Badge variant="secondary">
                                                {files.length}
                                            </Badge>
                                        </div>
                                        <div
                                            className={`grid gap-4 ${
                                                viewMode === "grid"
                                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {files.map((file) => (
                                                <FileCard
                                                    key={file.id}
                                                    file={file}
                                                    onShare={handleShareFile}
                                                    onDownload={
                                                        handleDownloadFile
                                                    }
                                                    onPreview={
                                                        handlePreviewFile
                                                    }
                                                    onTogglePublic={() => {}}
                                                    onEdit={() => {}}
                                                    onDelete={() => {}}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pagination */}
                                {(filesPagination?.total_pages || 0) > 1 && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-700">
                                            Showing {(currentPage - 1) * 20 + 1}{" "}
                                            to{" "}
                                            {Math.min(
                                                currentPage * 20,
                                                filesPagination?.total || 0
                                            )}{" "}
                                            of {filesPagination?.total || 0}{" "}
                                            items
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-gray-700">
                                                Page {currentPage} of{" "}
                                                {filesPagination?.total_pages ||
                                                    1}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                    (filesPagination?.total_pages ||
                                                        1)
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* File Preview */}
                {previewFile && (
                    <FilePreview
                        file={previewFile}
                        isOpen={showPreview}
                        onClose={() => {
                            setShowPreview(false);
                            setPreviewFile(null);
                        }}
                    />
                )}
            </div>
        </SidebarInset>
    );
}
