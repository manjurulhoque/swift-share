"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Filter,
    Upload,
    FolderPlus,
    MoreHorizontal,
    Grid3X3,
    List,
    Home,
    ChevronRight,
    Star,
    Clock,
    Trash2,
    SortAsc,
    SortDesc,
} from "lucide-react";
import { toast } from "sonner";
import {
    useGetFolderContentsQuery,
    useCreateFolderMutation,
    useUpdateFolderMutation,
    useDeleteFolderMutation,
    useMoveFolderMutation,
    Folder,
    Breadcrumb,
} from "@/store/api/foldersApi";
import {
    useUpdateFileMutation,
    useDeleteFileMutation,
} from "@/store/api/filesApi";
import { File } from "@/types/file";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { FileCard } from "@/components/cards/file-card";
import { FolderCard } from "@/components/cards/folder-card";
import { DragDropUpload } from "@/components/upload/drag-drop-upload";
import {
    AdvancedSearch,
    SearchFilters,
} from "@/components/search/advanced-search";
import { FilePreview } from "@/components/preview/file-preview";

type ViewMode = "grid" | "list";
type SortField = "name" | "modified" | "size" | "type";
type SortOrder = "asc" | "desc";

const FILE_TYPES = [
    {
        value: "image",
        label: "Images",
        extensions: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
    },
    {
        value: "document",
        label: "Documents",
        extensions: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
    },
    {
        value: "spreadsheet",
        label: "Spreadsheets",
        extensions: ["xls", "xlsx", "csv", "ods"],
    },
    {
        value: "presentation",
        label: "Presentations",
        extensions: ["ppt", "pptx", "odp"],
    },
    {
        value: "video",
        label: "Videos",
        extensions: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"],
    },
    {
        value: "audio",
        label: "Audio",
        extensions: ["mp3", "wav", "flac", "aac", "ogg", "wma"],
    },
    {
        value: "archive",
        label: "Archives",
        extensions: ["zip", "rar", "7z", "tar", "gz", "bz2"],
    },
    {
        value: "code",
        label: "Code",
        extensions: ["js", "ts", "py", "java", "cpp", "html", "css", "sql"],
    },
];

export default function FileBrowserPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFolderId, setCurrentFolderId] = useState<
        string | undefined
    >();
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        query: "",
        fileTypes: [],
        tags: [],
    });
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // API hooks
    const {
        data: folderData,
        isLoading,
        error,
        refetch,
    } = useGetFolderContentsQuery({
        parent_id: currentFolderId,
        page: currentPage,
        limit: 20,
        search: searchFilters.query,
    });

    const [createFolder] = useCreateFolderMutation();
    const [updateFolder] = useUpdateFolderMutation();
    const [deleteFolder] = useDeleteFolderMutation();
    const [moveFolder] = useMoveFolderMutation();
    const [updateFile] = useUpdateFileMutation();
    const [deleteFile] = useDeleteFileMutation();

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    const folders = folderData?.data?.folders || [];
    const files = folderData?.data?.files || [];
    const breadcrumbs = folderData?.data?.breadcrumbs || [];
    const pagination = folderData?.data?.pagination;

    // Navigation handlers
    const navigateToFolder = useCallback((folderId: string) => {
        setCurrentFolderId(folderId);
        setCurrentPage(1);
        setSelectedItems(new Set());
    }, []);

    const navigateToRoot = useCallback(() => {
        setCurrentFolderId(undefined);
        setCurrentPage(1);
        setSelectedItems(new Set());
    }, []);

    const navigateToBreadcrumb = useCallback(
        (breadcrumb: Breadcrumb) => {
            if (breadcrumb.id) {
                navigateToFolder(breadcrumb.id);
            } else {
                navigateToRoot();
            }
        },
        [navigateToFolder, navigateToRoot]
    );

    // Folder operations
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            await createFolder({
                name: newFolderName,
                parent_id: currentFolderId,
                color: "#3B82F6",
            }).unwrap();
            toast.success("Folder created successfully!");
            setShowCreateFolderDialog(false);
            setNewFolderName("");
        } catch (error) {
            toast.error("Failed to create folder");
            console.error("Create folder error:", error);
        }
    };

    const handleEditFolder = async (folder: Folder) => {
        try {
            await updateFolder({
                id: folder.id,
                data: {
                    name: folder.name,
                    color: folder.color,
                },
            }).unwrap();
            toast.success("Folder updated successfully!");
        } catch (error) {
            toast.error("Failed to update folder");
            console.error("Update folder error:", error);
        }
    };

    const handleDeleteFolder = async (folder: Folder) => {
        try {
            await deleteFolder(folder.id).unwrap();
            toast.success("Folder deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete folder");
            console.error("Delete folder error:", error);
        }
    };

    const handleMoveFolder = async (folder: Folder) => {
        // TODO: Implement folder move dialog
        toast.info("Move folder feature coming soon!");
    };

    // File operations
    const handleToggleFileStar = async (file: File) => {
        try {
            await updateFile({
                id: file.id,
                data: { is_starred: !file.is_starred },
            }).unwrap();
            toast.success(
                `File ${
                    file.is_starred ? "unstarred" : "starred"
                } successfully!`
            );
        } catch (error) {
            toast.error("Failed to update file");
        }
    };

    const handleDeleteFile = async (fileId: string, fileName: string) => {
        try {
            await deleteFile(fileId).unwrap();
            toast.success(`${fileName} deleted successfully!`);
        } catch (error) {
            toast.error("Failed to delete file");
            console.error("Delete file error:", error);
        }
    };

    const handlePreviewFile = (file: File) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const handleDownloadFile = async (fileId: string, fileName: string) => {
        // Implementation will be handled by the FilePreview component
        toast.info("Download started!");
    };

    const handleShareFile = async (fileId: string) => {
        // Implementation for sharing
        toast.info("Share feature coming soon!");
    };

    // Selection handlers
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
        const allIds = new Set([
            ...folders.map((f: any) => f.id),
            ...files.map((f: any) => f.id),
        ]);
        setSelectedItems(allIds);
    };

    const clearSelection = () => {
        setSelectedItems(new Set());
    };

    // Sort and filter items
    const sortItems = (items: any[], type: "folder" | "file") => {
        return [...items].sort((a: any, b: any) => {
            let comparison = 0;

            switch (sortField) {
                case "name":
                    comparison = (
                        type === "folder" ? a.name : a.original_name
                    ).localeCompare(
                        type === "folder" ? b.name : b.original_name
                    );
                    break;
                case "modified":
                    comparison =
                        new Date(a.updated_at).getTime() -
                        new Date(b.updated_at).getTime();
                    break;
                case "size":
                    if (type === "file") {
                        comparison = a.file_size - b.file_size;
                    }
                    break;
                case "type":
                    if (type === "file") {
                        comparison = a.file_extension.localeCompare(
                            b.file_extension
                        );
                    }
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    };

    // Apply advanced filters
    const filteredFiles = files.filter((file: any) => {
        // Starred filter
        if (searchFilters.isStarred && !file.is_starred) return false;

        // Public filter
        if (
            searchFilters.isPublic !== undefined &&
            file.is_public !== searchFilters.isPublic
        )
            return false;

        // File type filter
        if (searchFilters.fileTypes.length > 0) {
            const fileExt = file.file_extension.toLowerCase().replace(".", "");
            const matchesType = searchFilters.fileTypes.some((type) => {
                const typeConfig = FILE_TYPES.find((ft) => ft.value === type);
                return typeConfig?.extensions.includes(fileExt);
            });
            if (!matchesType) return false;
        }

        // Tags filter (check if file tags contain any of the search tags)
        if (searchFilters.tags.length > 0) {
            const fileTags = file.tags
                ? file.tags
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                : [];
            const matchesTags = searchFilters.tags.some((searchTag: string) =>
                fileTags.includes(searchTag.toLowerCase())
            );
            if (!matchesTags) return false;
        }

        // Date range filter
        if (searchFilters.dateFrom) {
            const fileDate = new Date(file.created_at);
            if (fileDate < searchFilters.dateFrom) return false;
        }

        if (searchFilters.dateTo) {
            const fileDate = new Date(file.created_at);
            if (fileDate > searchFilters.dateTo) return false;
        }

        // Size filter
        if (
            searchFilters.sizeMin !== undefined &&
            file.file_size < searchFilters.sizeMin
        )
            return false;
        if (
            searchFilters.sizeMax !== undefined &&
            file.file_size > searchFilters.sizeMax
        )
            return false;

        // Owner filter
        if (searchFilters.owner && file.user?.email !== searchFilters.owner)
            return false;

        return true;
    });

    const sortedFolders = sortItems(folders, "folder");
    const sortedFiles = sortItems(filteredFiles, "file");

    const getCurrentFolderName = () => {
        if (!currentFolderId) return "Root";
        return breadcrumbs[breadcrumbs.length - 1]?.name || "Unknown Folder";
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
                                    Error loading files and folders. Please try
                                    again.
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
                        {/* Breadcrumbs */}
                        <nav className="flex items-center space-x-1 text-sm text-gray-600">
                            <button
                                onClick={navigateToRoot}
                                className="flex items-center hover:text-gray-900"
                            >
                                <Home className="h-4 w-4 mr-1" />
                                Root
                            </button>
                            {breadcrumbs.map(
                                (breadcrumb: any, index: number) => (
                                    <React.Fragment
                                        key={breadcrumb.id || index}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        <button
                                            onClick={() =>
                                                navigateToBreadcrumb(breadcrumb)
                                            }
                                            className="hover:text-gray-900"
                                        >
                                            {breadcrumb.name}
                                        </button>
                                    </React.Fragment>
                                )
                            )}
                        </nav>

                        {/* Advanced Search */}
                        <AdvancedSearch
                            filters={searchFilters}
                            onFiltersChange={setSearchFilters}
                            onClear={() =>
                                setSearchFilters({
                                    query: "",
                                    fileTypes: [],
                                    tags: [],
                                })
                            }
                            isLoading={isLoading}
                        />

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="flex-1"></div>

                            <div className="flex items-center gap-2">
                                {/* Sort */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {sortOrder === "asc" ? (
                                                <SortAsc className="h-4 w-4 mr-2" />
                                            ) : (
                                                <SortDesc className="h-4 w-4 mr-2" />
                                            )}
                                            Sort
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setSortField("name")}
                                        >
                                            Name
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setSortField("modified")
                                            }
                                        >
                                            Modified
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortField("size")}
                                        >
                                            Size
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortField("type")}
                                        >
                                            Type
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setSortOrder(
                                                    sortOrder === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                )
                                            }
                                        >
                                            {sortOrder === "asc"
                                                ? "Descending"
                                                : "Ascending"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* View Mode */}
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

                                {/* Actions */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowCreateFolderDialog(true)
                                    }
                                >
                                    <FolderPlus className="h-4 w-4 mr-2" />
                                    New Folder
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setShowUploadDialog(true)}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                </Button>
                            </div>
                        </div>

                        {/* Selection Bar */}
                        {selectedItems.size > 0 && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="text-sm text-blue-700">
                                    {selectedItems.size} item(s) selected
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSelection}
                                    >
                                        Clear
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Content Grid/List */}
                        {isLoading ? (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                        : "space-y-2"
                                }
                            >
                                {[...Array(8)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-4">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Folders */}
                                {sortedFolders.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Folders
                                            </h2>
                                            <Badge variant="secondary">
                                                {sortedFolders.length}
                                            </Badge>
                                        </div>
                                        <div
                                            className={
                                                viewMode === "grid"
                                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                                    : "space-y-2"
                                            }
                                        >
                                            {sortedFolders.map((folder) => (
                                                <FolderCard
                                                    key={folder.id}
                                                    folder={folder}
                                                    onOpen={navigateToFolder}
                                                    onEdit={handleEditFolder}
                                                    onDelete={
                                                        handleDeleteFolder
                                                    }
                                                    onMove={handleMoveFolder}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Files */}
                                {sortedFiles.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Files
                                            </h2>
                                            <Badge variant="secondary">
                                                {sortedFiles.length}
                                            </Badge>
                                        </div>
                                        <div
                                            className={
                                                viewMode === "grid"
                                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                                    : "space-y-2"
                                            }
                                        >
                                            {sortedFiles.map((file) => (
                                                <FileCard
                                                    key={file.id}
                                                    file={file}
                                                    onDownload={
                                                        handleDownloadFile
                                                    }
                                                    onShare={handleShareFile}
                                                    onPreview={
                                                        handlePreviewFile
                                                    }
                                                    onTogglePublic={() => {}}
                                                    onEdit={() => {}}
                                                    onDelete={() =>
                                                        handleDeleteFile(
                                                            file.id,
                                                            file.original_name
                                                        )
                                                    }
                                                    onToggleStar={() =>
                                                        handleToggleFileStar(
                                                            file
                                                        )
                                                    }
                                                    isDownloading={false}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {sortedFolders.length === 0 &&
                                    sortedFiles.length === 0 && (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <div className="space-y-4">
                                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <FolderPlus className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            {searchFilters.query ||
                                                            searchFilters
                                                                .fileTypes
                                                                .length > 0 ||
                                                            searchFilters.tags
                                                                .length > 0 ||
                                                            searchFilters.isStarred
                                                                ? "No items found"
                                                                : "This folder is empty"}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4">
                                                            {searchFilters.query ||
                                                            searchFilters
                                                                .fileTypes
                                                                .length > 0 ||
                                                            searchFilters.tags
                                                                .length > 0 ||
                                                            searchFilters.isStarred
                                                                ? "No files or folders match your search criteria"
                                                                : "Get started by creating a folder or uploading files"}
                                                        </p>
                                                        {!searchFilters.query &&
                                                            searchFilters
                                                                .fileTypes
                                                                .length === 0 &&
                                                            searchFilters.tags
                                                                .length === 0 &&
                                                            !searchFilters.isStarred && (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            setShowCreateFolderDialog(
                                                                                true
                                                                            )
                                                                        }
                                                                    >
                                                                        <FolderPlus className="h-4 w-4 mr-2" />
                                                                        Create
                                                                        Folder
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() =>
                                                                            setShowUploadDialog(
                                                                                true
                                                                            )
                                                                        }
                                                                    >
                                                                        <Upload className="h-4 w-4 mr-2" />
                                                                        Upload
                                                                        Files
                                                                    </Button>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.total_pages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Showing {(currentPage - 1) * 20 + 1} to{" "}
                                    {Math.min(
                                        currentPage * 20,
                                        pagination.total
                                    )}{" "}
                                    of {pagination.total} items
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

                {/* Create Folder Dialog */}
                <Dialog
                    open={showCreateFolderDialog}
                    onOpenChange={setShowCreateFolderDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Folder</DialogTitle>
                            <DialogDescription>
                                Create a new folder in{" "}
                                <strong>{getCurrentFolderName()}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="folderName">Folder Name</Label>
                                <Input
                                    id="folderName"
                                    value={newFolderName}
                                    onChange={(e) =>
                                        setNewFolderName(e.target.value)
                                    }
                                    placeholder="Enter folder name"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateFolder();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateFolderDialog(false);
                                    setNewFolderName("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim()}
                            >
                                Create Folder
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Upload Dialog */}
                <Dialog
                    open={showUploadDialog}
                    onOpenChange={setShowUploadDialog}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Upload Files</DialogTitle>
                            <DialogDescription>
                                Upload files to{" "}
                                <strong>{getCurrentFolderName()}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <DragDropUpload
                            currentFolderId={currentFolderId}
                            folderName={getCurrentFolderName()}
                            onUploadComplete={() => {
                                setShowUploadDialog(false);
                                refetch();
                            }}
                        />
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowUploadDialog(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                    onToggleStar={handleToggleFileStar}
                />
            </div>
        </SidebarInset>
    );
}
