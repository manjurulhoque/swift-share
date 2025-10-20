"use client";

import React, { useState, useCallback } from "react";
import { useGetShareLinksQuery } from "@/store/api/shareApi";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Share2, Search, Filter } from "lucide-react";
import { ShareLink } from "@/store/api/shareApi";
import { redirect, RedirectType } from "next/navigation";
import { SidebarInset } from "../ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ShareLinkCard } from "@/components/cards/share-link-card";

export default function SharedPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
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
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    // API hooks
    const {
        data: sharesData,
        isLoading,
        error,
        refetch,
    } = useGetShareLinksQuery({
        page: currentPage,
        limit: 10,
    });

    const shares = sharesData?.data?.share_links || [];
    const pagination = sharesData?.data
        ? {
              total: sharesData.data.total,
              total_pages: sharesData.data.total_pages,
              current_page: sharesData.data.current_page,
          }
        : null;

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
            description: "",
            password: "",
            max_downloads: 0,
            is_active: true,
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
                                <BreadcrumbPage>Shared Files</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex-1 p-4">
                {/* Header */}
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search files..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
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
                    ) : shares.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No shared files yet
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Files you share will appear here. Start by
                                    sharing a file from your files page.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        (window.location.href =
                                            "/dashboard/files")
                                    }
                                >
                                    Go to Files
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shares.map((share) => (
                                <ShareLinkCard
                                    key={share.id}
                                    share={share}
                                    onCopyLink={handleCopyLink}
                                    onEdit={handleEdit}
                                    onDelete={() => {
                                        // TODO: Implement delete functionality
                                        console.log("Delete share:", share.id);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing {(currentPage - 1) * 10 + 1} to{" "}
                                {Math.min(currentPage * 10, pagination.total)}{" "}
                                of {pagination.total} shares
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of{" "}
                                    {pagination.total_pages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={
                                        currentPage === pagination.total_pages
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Edit Dialog */}
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    >
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
                                                    parseInt(e.target.value) ||
                                                    0,
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
                                        onClick={() =>
                                            setIsEditDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setIsEditDialogOpen(false)
                                        }
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </SidebarInset>
    );
}
