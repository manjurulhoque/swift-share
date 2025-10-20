"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Clock,
    Download,
    Eye,
    FileText,
    Share,
    Star,
    RefreshCw,
    History,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { useGetRecentFilesQuery } from "@/store/api/filesApi";
import { FilePreview } from "@/components/preview/file-preview";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function RecentFilesPage() {
    const [limit] = useState(50);
    const [previewFile, setPreviewFile] = useState<any | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const {
        data: recentData,
        isLoading,
        error,
        refetch,
    } = useGetRecentFilesQuery({ limit });

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    const recentFiles = recentData?.data?.recent_files || [];

    const handlePreviewFile = (access: any) => {
        setPreviewFile(access.file);
        setShowPreview(true);
    };

    const handleDownloadFile = async (fileId: string, fileName: string) => {
        toast.info("Download started!");
    };

    const handleShareFile = async (fileId: string) => {
        toast.info("Share feature coming soon!");
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case "view":
                return <Eye className="h-4 w-4 text-blue-500" />;
            case "download":
                return <Download className="h-4 w-4 text-green-500" />;
            case "edit":
                return <FileText className="h-4 w-4 text-orange-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case "view":
                return "Viewed";
            case "download":
                return "Downloaded";
            case "edit":
                return "Edited";
            default:
                return "Accessed";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith("image/")) {
            return "🖼️";
        } else if (mimeType.startsWith("video/")) {
            return "🎥";
        } else if (mimeType.startsWith("audio/")) {
            return "🎵";
        } else if (mimeType.includes("pdf")) {
            return "📄";
        } else if (
            mimeType.includes("document") ||
            mimeType.includes("word") ||
            mimeType.includes("text")
        ) {
            return "📝";
        } else if (
            mimeType.includes("spreadsheet") ||
            mimeType.includes("excel")
        ) {
            return "📊";
        } else if (
            mimeType.includes("presentation") ||
            mimeType.includes("powerpoint")
        ) {
            return "📈";
        } else {
            return "📎";
        }
    };

    if (error) {
        return (
            <SidebarInset>
                <div className="flex flex-col">
                    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Recent Files
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex-1 p-4">
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-red-600">
                                    Error loading recent files. Please try
                                    again.
                                </p>
                                <Button
                                    onClick={() => refetch()}
                                    className="mt-4"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
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
                <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Recent Files</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isLoading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${
                                    isLoading ? "animate-spin" : ""
                                }`}
                            />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Recent
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {recentFiles.length}
                                            </p>
                                        </div>
                                        <History className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Views
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {
                                                    recentFiles.filter(
                                                        (f: any) =>
                                                            f.action === "view"
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                        <Eye className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Downloads
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {
                                                    recentFiles.filter(
                                                        (f: any) =>
                                                            f.action ===
                                                            "download"
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                        <Download className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Files List */}
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 bg-gray-200 rounded"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : recentFiles.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No recent files
                                    </h3>
                                    <p className="text-gray-600">
                                        Files you view, download, or edit will
                                        appear here
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {recentFiles.map((access: any) => (
                                    <Card
                                        key={access.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() =>
                                            handlePreviewFile(access)
                                        }
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-4">
                                                {/* File Icon */}
                                                <div className="text-2xl">
                                                    {getFileIcon(
                                                        access.file.mime_type
                                                    )}
                                                </div>

                                                {/* File Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {
                                                                access.file
                                                                    .original_name
                                                            }
                                                        </h3>
                                                        {access.file
                                                            .is_starred && (
                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        )}
                                                        {access.file
                                                            .is_public && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                Public
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span className="flex items-center space-x-1">
                                                            {getActionIcon(
                                                                access.action
                                                            )}
                                                            <span>
                                                                {getActionLabel(
                                                                    access.action
                                                                )}
                                                            </span>
                                                        </span>
                                                        <span>
                                                            {formatFileSize(
                                                                access.file
                                                                    .file_size
                                                            )}
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        access.created_at
                                                                    ),
                                                                    {
                                                                        addSuffix:
                                                                            true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {access.file
                                                        .description && (
                                                        <p className="text-sm text-gray-600 mt-1 truncate">
                                                            {
                                                                access.file
                                                                    .description
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShareFile(
                                                                access.file.id
                                                            );
                                                        }}
                                                    >
                                                        <Share className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownloadFile(
                                                                access.file.id,
                                                                access.file
                                                                    .original_name
                                                            );
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* File Preview Dialog */}
                <FilePreview
                    file={previewFile}
                    isOpen={showPreview}
                    onClose={() => {
                        setShowPreview(false);
                        setPreviewFile(null);
                    }}
                    onDownload={handleDownloadFile}
                    onShare={handleShareFile}
                />
            </div>
        </SidebarInset>
    );
}
