"use client";

import React, { useState, useCallback } from "react";
import { useGetSharesQuery } from "@/store/api/sharesApi";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
    File as FileIcon,
    Share2,
    Edit,
    Search,
    Upload,
    Copy,
    Trash2,
} from "lucide-react";
import { ShareLink } from "@/types/share";
import { redirect, RedirectType } from "next/navigation";

export default function SharedPage() {
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedShare, setSelectedShare] = useState<ShareLink | null>(null);
    const [editForm, setEditForm] = useState({
        description: "",
        password: "",
        max_downloads: 0,
        is_active: true,
    });

    // Redirect if not authenticated
    if (!isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    // API hooks
    const {
        data: sharesData,
        isLoading,
        error,
        refetch,
    } = useGetSharesQuery({
        page: currentPage,
        limit: 10,
        search: searchTerm,
    });

    const shares = sharesData?.data?.share_links || [];
    const pagination = sharesData?.data?.pagination || null;

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEdit = (share: ShareLink) => {
        setSelectedShare(share);
        setEditForm({
            description: share.description || "",
            password: "",
            max_downloads: share.max_downloads,
            is_active: share.is_active,
        });
        setIsEditDialogOpen(true);
    };

    const handleCopyLink = async (token: string) => {
        try {
            const shareUrl = `${window.location.origin}/share/${token}`;
            await navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Success",
                description: "Share link copied to clipboard!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy share link",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatExpiryDate = (dateString: string | null): string => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shared Files
                    </h1>
                    <div className="flex items-center space-x-2">
                        <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md" />
                        <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md" />
                    </div>
                </div>
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
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shared Files
                    </h1>
                </div>
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-600 mb-4">
                            Failed to load shared files. Please try again.
                        </p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shared Files
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Files you have shared with others
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search shares..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <Button onClick={() => refetch()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Content */}
            {shares.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No shared files yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Files you share will appear here. Start by sharing a
                            file from your files page.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() =>
                                (window.location.href = "/dashboard/files")
                            }
                        >
                            Go to Files
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shares.map((share) => (
                        <Card
                            key={share.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0 max-w-[200px]">
                                            <h3
                                                className="font-medium text-gray-900 truncate"
                                                title={
                                                    share.file?.original_name ||
                                                    "Unknown file"
                                                }
                                            >
                                                {share.file?.original_name ||
                                                    "Unknown file"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {share.file?.file_size
                                                    ? `${(
                                                          share.file.file_size /
                                                          1024 /
                                                          1024
                                                      ).toFixed(2)} MB`
                                                    : "Unknown size"}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            share.is_active
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {share.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {share.description || "No description"}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span>
                                                {formatDate(share.created_at)}
                                            </span>
                                            <span>
                                                {share.download_count} downloads
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-xs text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Expires:</span>
                                            <span>
                                                {formatExpiryDate(
                                                    share.expires_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Downloads:</span>
                                            <span>
                                                {share.max_downloads === 0
                                                    ? "Unlimited"
                                                    : share.max_downloads}
                                            </span>
                                        </div>
                                        {share.has_password && (
                                            <div className="flex justify-between">
                                                <span>Password:</span>
                                                <span>Protected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleCopyLink(share.token)
                                                }
                                            >
                                                <Copy className="h-4 w-4 mr-1" />
                                                Copy Link
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(share)
                                                }
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing {(currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(currentPage * 10, pagination.total)} of{" "}
                        {pagination.total} shares
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {pagination.total_pages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.total_pages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Share Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Input
                                value={editForm.description}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter share description"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password (leave empty to remove)
                            </label>
                            <Input
                                type="password"
                                value={editForm.password}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Enter password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Downloads (0 for unlimited)
                            </label>
                            <Input
                                type="number"
                                value={editForm.max_downloads}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        max_downloads:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="Enter max downloads"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={editForm.is_active}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        is_active: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300"
                            />
                            <label
                                htmlFor="is_active"
                                className="text-sm text-gray-700"
                            >
                                Active
                            </label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => setIsEditDialogOpen(false)}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
