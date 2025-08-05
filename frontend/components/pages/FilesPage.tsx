"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Upload, File as FileIcon } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    useGetFilesQuery,
    useUploadFileMutation,
    useUpdateFileMutation,
    useDeleteFileMutation,
    useDownloadFileMutation,
} from "@/store/api/filesApi";
import { File } from "@/types/file";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { FileCard } from "@/components/cards/file-card";

export default function FilesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        description: "",
        tags: "",
        is_public: false,
    });
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // API hooks
    const {
        data: filesData,
        isLoading,
        error,
        refetch,
    } = useGetFilesQuery({
        page: currentPage,
        limit: 10,
        search: searchTerm,
    });
    const files = filesData?.data?.files || [];
    const pagination = filesData?.data?.pagination || null;

    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();
    const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();
    const [downloadFile, { isLoading: isDownloading }] =
        useDownloadFileMutation();

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    // File upload handler
    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (!files || files.length === 0) return;

            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("description", "");
                formData.append("tags", "");
                formData.append("is_public", "false");

                try {
                    await uploadFile(formData).unwrap();
                    toast.success(`${file.name} uploaded successfully!`);
                } catch (error) {
                    toast.error(`Failed to upload ${file.name}`);
                    console.error("Upload error:", error);
                }
            }
        },
        [uploadFile]
    );

    // File actions
    const handleDownload = async (fileId: string, fileName: string) => {
        try {
            const result = await downloadFile(fileId).unwrap();
            // Create a temporary link to download the file
            const link = document.createElement("a");
            link.href = result.download_url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Download started!");
        } catch (error) {
            toast.error("Failed to download file");
            console.error("Download error:", error);
        }
    };

    const handleEdit = (file: File) => {
        setSelectedFile(file);
        setEditForm({
            description: file.description || "",
            tags: file.tags || "",
            is_public: file.is_public,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateFile = async () => {
        if (!selectedFile) return;

        try {
            await updateFile({
                id: selectedFile.id,
                data: editForm,
            }).unwrap();
            toast.success("File updated successfully!");
            setIsEditDialogOpen(false);
            setSelectedFile(null);
        } catch (error) {
            toast.error("Failed to update file");
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (fileId: string, fileName: string) => {
        try {
            await deleteFile(fileId).unwrap();
            toast.success(`${fileName} deleted successfully!`);
            setIsDeleteDialogOpen(false);
            setSelectedFile(null);
        } catch (error) {
            toast.error("Failed to delete file");
            console.error("Delete error:", error);
        }
    };

    const handleShare = async (fileId: string) => {
        try {
            // This would typically create a share link
            const shareUrl = `${window.location.origin}/share/${fileId}`;
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy share link");
        }
    };

    if (error) {
        return (
            <SidebarInset>
                <div className="flex flex-col">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Files</h1>
                    </header>
                    <div className="flex-1 p-4">
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-red-600">
                                    Error loading files. Please try again.
                                </p>
                                <Button
                                    onClick={() => refetch()}
                                    className="mt-4"
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
                    <h1 className="text-lg font-semibold">Files</h1>
                </header>

                <div className="flex-1 p-4">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header with search and upload */}
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
                                <Input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                    accept="*/*"
                                />
                                <Button asChild>
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                    </label>
                                </Button>
                            </div>
                        </div>

                        {/* Files Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : files.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No files found
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Upload your first file to get started
                                    </p>
                                    <Input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="empty-upload"
                                        accept="*/*"
                                    />
                                    <Button asChild>
                                        <label
                                            htmlFor="empty-upload"
                                            className="cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Files
                                        </label>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {files.map((file) => (
                                    <FileCard
                                        key={file.id}
                                        file={file}
                                        onDownload={handleDownload}
                                        onShare={handleShare}
                                        onEdit={handleEdit}
                                        onDelete={() => {
                                            setSelectedFile(file);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        isDownloading={isDownloading}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.total_pages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Showing {(currentPage - 1) * 10 + 1} to{" "}
                                    {Math.min(
                                        currentPage * 10,
                                        pagination.total
                                    )}{" "}
                                    of {pagination.total} files
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
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
                                            setCurrentPage(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage ===
                                            pagination.total_pages
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit File Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit File</DialogTitle>
                            <DialogDescription>
                                Update file information and settings
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter file description..."
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    placeholder="Enter tags separated by commas..."
                                    value={editForm.tags}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            tags: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_public"
                                    checked={editForm.is_public}
                                    onCheckedChange={(checked) =>
                                        setEditForm({
                                            ...editForm,
                                            is_public: checked,
                                        })
                                    }
                                />
                                <Label htmlFor="is_public">
                                    Make file public
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateFile}
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Updating..." : "Update File"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete File Dialog */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete File</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "
                                {selectedFile?.original_name}"? This action
                                cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    selectedFile &&
                                    handleDelete(
                                        selectedFile.id,
                                        selectedFile.original_name
                                    )
                                }
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete File"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </SidebarInset>
    );
}
