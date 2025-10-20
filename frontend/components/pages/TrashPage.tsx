"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Trash2,
    RefreshCw,
    RotateCcw,
    FileText,
    Folder,
    MoreVertical,
    AlertTriangle,
    Calendar,
    User,
    HardDrive,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import {
    useGetTrashedItemsQuery,
    useRestoreFileMutation,
    useRestoreFolderMutation,
    usePermanentlyDeleteFileMutation,
    usePermanentlyDeleteFolderMutation,
    useEmptyTrashMutation,
    TrashedItem,
} from "@/store/api/trashApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function TrashPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const {
        data: trashData,
        isLoading,
        error,
        refetch,
    } = useGetTrashedItemsQuery({ page: currentPage, limit: 20 });

    const [restoreFile] = useRestoreFileMutation();
    const [restoreFolder] = useRestoreFolderMutation();
    const [permanentlyDeleteFile] = usePermanentlyDeleteFileMutation();
    const [permanentlyDeleteFolder] = usePermanentlyDeleteFolderMutation();
    const [emptyTrash] = useEmptyTrashMutation();

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    const trashedItems = [
        ...(trashData?.data?.files || []).map((file) => ({
            ...file,
            type: "file" as const,
        })),
        ...(trashData?.data?.folders || []).map((folder) => ({
            ...folder,
            type: "folder" as const,
        })),
    ].sort(
        (a, b) =>
            new Date(b.trashed_at).getTime() - new Date(a.trashed_at).getTime()
    );

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (mimeType?: string) => {
        if (!mimeType) return "📁";
        if (mimeType.startsWith("image/")) return "🖼️";
        if (mimeType.startsWith("video/")) return "🎥";
        if (mimeType.startsWith("audio/")) return "🎵";
        if (mimeType.includes("pdf")) return "📄";
        if (mimeType.includes("document") || mimeType.includes("text"))
            return "📝";
        if (mimeType.includes("spreadsheet")) return "📊";
        if (mimeType.includes("presentation")) return "📈";
        return "📎";
    };

    const handleRestore = async (
        item: TrashedItem & { type: "file" | "folder" }
    ) => {
        try {
            if (item.type === "file") {
                await restoreFile(item.id).unwrap();
                toast.success(
                    `File "${
                        item.original_name || item.name
                    }" restored successfully!`
                );
            } else {
                await restoreFolder(item.id).unwrap();
                toast.success(`Folder "${item.name}" restored successfully!`);
            }
        } catch (error) {
            toast.error(`Failed to restore ${item.type}`);
            console.error("Restore error:", error);
        }
    };

    const handlePermanentDelete = async (
        item: TrashedItem & { type: "file" | "folder" }
    ) => {
        try {
            if (item.type === "file") {
                await permanentlyDeleteFile(item.id).unwrap();
                toast.success(
                    `File "${
                        item.original_name || item.name
                    }" permanently deleted`
                );
            } else {
                await permanentlyDeleteFolder(item.id).unwrap();
                toast.success(`Folder "${item.name}" permanently deleted`);
            }
        } catch (error) {
            toast.error(`Failed to permanently delete ${item.type}`);
            console.error("Permanent delete error:", error);
        }
    };

    const handleEmptyTrash = async () => {
        try {
            await emptyTrash().unwrap();
            toast.success("Trash emptied successfully!");
        } catch (error) {
            toast.error("Failed to empty trash");
            console.error("Empty trash error:", error);
        }
    };

    const toggleItemSelection = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const selectAll = () => {
        setSelectedItems(new Set(trashedItems.map((item) => item.id)));
    };

    const clearSelection = () => {
        setSelectedItems(new Set());
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
                                    <BreadcrumbPage>Trash</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex-1 p-4">
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-red-600">
                                    Error loading trash. Please try again.
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
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Trash2 className="h-5 w-5" />
                    <h1 className="text-lg font-semibold">Trash</h1>
                    <div className="ml-auto flex items-center gap-2">
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
                        {trashedItems.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Empty Trash
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-destructive" />
                                            Empty Trash?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete all{" "}
                                            {trashedItems.length} items in
                                            trash. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleEmptyTrash}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Empty Trash
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </header>

                <div className="flex-1 p-4">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Items
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {trashedItems.length}
                                            </p>
                                        </div>
                                        <Trash2 className="h-8 w-8 text-gray-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Files
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {trashData?.data?.total_files ||
                                                    0}
                                            </p>
                                        </div>
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Folders
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {trashData?.data
                                                    ?.total_folders || 0}
                                            </p>
                                        </div>
                                        <Folder className="h-8 w-8 text-amber-500" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Size
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatFileSize(
                                                    trashedItems
                                                        .filter(
                                                            (item) =>
                                                                item.type ===
                                                                "file"
                                                        )
                                                        .reduce(
                                                            (sum, item) =>
                                                                sum +
                                                                (item.file_size ||
                                                                    0),
                                                            0
                                                        )
                                                )}
                                            </p>
                                        </div>
                                        <HardDrive className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Selection Controls */}
                        {selectedItems.size > 0 && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {selectedItems.size} item(s)
                                            selected
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearSelection}
                                            >
                                                Clear
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    selectedItems.forEach(
                                                        (id) => {
                                                            const item =
                                                                trashedItems.find(
                                                                    (i) =>
                                                                        i.id ===
                                                                        id
                                                                );
                                                            if (item)
                                                                handleRestore(
                                                                    item
                                                                );
                                                        }
                                                    );
                                                    clearSelection();
                                                }}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Restore Selected
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Trash Items */}
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
                        ) : trashedItems.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Trash is empty
                                    </h3>
                                    <p className="text-gray-600">
                                        Items you delete will appear here and
                                        can be restored for 30 days
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">
                                        Deleted Items
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={selectAll}
                                        >
                                            Select All
                                        </Button>
                                    </div>
                                </div>

                                {trashedItems.map((item) => (
                                    <Card
                                        key={item.id}
                                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                                            selectedItems.has(item.id)
                                                ? "ring-2 ring-primary"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleItemSelection(item.id)
                                        }
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-4">
                                                {/* Item Icon */}
                                                <div className="flex items-center justify-center w-10 h-10 rounded bg-gray-100">
                                                    {item.type === "folder" ? (
                                                        <Folder className="h-6 w-6 text-amber-600" />
                                                    ) : (
                                                        <div className="text-xl">
                                                            {getFileIcon(
                                                                item.mime_type
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Item Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {item.original_name ||
                                                                item.name}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {item.type}
                                                        </Badge>
                                                        {item.type ===
                                                            "folder" &&
                                                            item.path && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {item.path}
                                                                </Badge>
                                                            )}
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        {item.type === "file" &&
                                                            item.file_size && (
                                                                <span>
                                                                    {formatFileSize(
                                                                        item.file_size
                                                                    )}
                                                                </span>
                                                            )}
                                                        <span className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>
                                                                Deleted{" "}
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        item.trashed_at
                                                                    ),
                                                                    {
                                                                        addSuffix:
                                                                            true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <User className="h-3 w-3" />
                                                            <span>
                                                                {item.user.name}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div
                                                    className="flex items-center space-x-2"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRestore(item)
                                                        }
                                                    >
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                        Restore
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleRestore(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                                Restore
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onSelect={(
                                                                            e
                                                                        ) =>
                                                                            e.preventDefault()
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                        Forever
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                                            <AlertTriangle className="h-5 w-5 text-destructive" />
                                                                            Delete
                                                                            Forever?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            permanently
                                                                            delete
                                                                            "
                                                                            {item.original_name ||
                                                                                item.name}
                                                                            "?
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handlePermanentDelete(
                                                                                    item
                                                                                )
                                                                            }
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                            Forever
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {trashData?.data && trashData.data.total_pages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-gray-700">
                                    Showing {(currentPage - 1) * 20 + 1} to{" "}
                                    {Math.min(
                                        currentPage * 20,
                                        trashData.data.total_items
                                    )}{" "}
                                    of {trashData.data.total_items} items
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
                                        {trashData.data.total_pages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage ===
                                            trashData.data.total_pages
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
