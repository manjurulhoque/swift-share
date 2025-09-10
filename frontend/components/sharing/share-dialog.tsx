"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Share2,
    Copy,
    Eye,
    MessageCircle,
    Edit,
    Calendar as CalendarIcon,
    Lock,
    Globe,
    Download,
    MoreVertical,
    Trash2,
    Settings,
    Users,
    Clock,
    Shield,
    UserPlus,
    Search,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    useCreateShareLinkMutation,
    useGetShareLinksQuery,
    useUpdateShareLinkMutation,
    useDeleteShareLinkMutation,
    SharePermission,
    ShareLink,
    ShareLinkCreateRequest,
} from "@/store/api/shareApi";
import {
    useGetFileCollaboratorsQuery,
    useAddFileCollaboratorMutation,
    useUpdateFileCollaboratorMutation,
    useRemoveFileCollaboratorMutation,
    useGetFolderCollaboratorsQuery,
    useAddFolderCollaboratorMutation,
    useUpdateFolderCollaboratorMutation,
    useRemoveFolderCollaboratorMutation,
    useSearchUsersQuery,
    CollaboratorRole,
    Collaborator,
    AddCollaboratorRequest,
} from "@/store/api/collaboratorsApi";

interface ShareDialogProps {
    fileId?: string;
    folderId?: string;
    fileName?: string;
    folderName?: string;
    isOpen: boolean;
    onClose: () => void;
}

const PERMISSION_OPTIONS = [
    {
        value: "view" as SharePermission,
        label: "View only",
        description: "Can view and download",
        icon: Eye,
    },
    {
        value: "comment" as SharePermission,
        label: "Can comment",
        description: "Can view, download, and comment",
        icon: MessageCircle,
    },
    {
        value: "edit" as SharePermission,
        label: "Can edit",
        description: "Can view, download, comment, and edit",
        icon: Edit,
    },
];

const COLLABORATOR_ROLE_OPTIONS = [
    {
        value: "viewer" as CollaboratorRole,
        label: "Viewer",
        description: "Can view and download",
        icon: Eye,
    },
    {
        value: "commenter" as CollaboratorRole,
        label: "Commenter",
        description: "Can view, download, and comment",
        icon: MessageCircle,
    },
    {
        value: "editor" as CollaboratorRole,
        label: "Editor",
        description: "Can view, download, comment, and edit",
        icon: Edit,
    },
];

export function ShareDialog({
    fileId,
    folderId,
    fileName,
    folderName,
    isOpen,
    onClose,
}: ShareDialogProps) {
    const [activeTab, setActiveTab] = useState("links");

    // Share link states
    const [permission, setPermission] = useState<SharePermission>("view");
    const [password, setPassword] = useState("");
    const [allowDownload, setAllowDownload] = useState(true);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>();
    const [showCalendar, setShowCalendar] = useState(false);

    // Collaborator states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
        email: string;
    } | null>(null);
    const [collaboratorRole, setCollaboratorRole] =
        useState<CollaboratorRole>("viewer");
    const [collaboratorExpiration, setCollaboratorExpiration] = useState<
        Date | undefined
    >();
    const [showCollaboratorCalendar, setShowCollaboratorCalendar] =
        useState(false);

    // API hooks
    const [createShareLink, { isLoading: isCreating }] =
        useCreateShareLinkMutation();
    const [updateShareLink] = useUpdateShareLinkMutation();
    const [deleteShareLink] = useDeleteShareLinkMutation();

    const [addFileCollaborator] = useAddFileCollaboratorMutation();
    const [updateFileCollaborator] = useUpdateFileCollaboratorMutation();
    const [removeFileCollaborator] = useRemoveFileCollaboratorMutation();

    const [addFolderCollaborator] = useAddFolderCollaboratorMutation();
    const [updateFolderCollaborator] = useUpdateFolderCollaboratorMutation();
    const [removeFolderCollaborator] = useRemoveFolderCollaboratorMutation();

    const {
        data: shareLinksData,
        isLoading: isLoadingLinks,
        refetch: refetchShareLinks,
    } = useGetShareLinksQuery({ page: 1, limit: 50 });

    const {
        data: fileCollaboratorsData,
        isLoading: isLoadingFileCollaborators,
        refetch: refetchFileCollaborators,
    } = useGetFileCollaboratorsQuery(fileId || "", {
        skip: !fileId,
    });

    const {
        data: folderCollaboratorsData,
        isLoading: isLoadingFolderCollaborators,
        refetch: refetchFolderCollaborators,
    } = useGetFolderCollaboratorsQuery(folderId || "", {
        skip: !folderId,
    });

    const {
        data: searchResults,
        isLoading: isSearching,
        refetch: searchUsers,
    } = useSearchUsersQuery(searchTerm, {
        skip: searchTerm.length < 2,
    });

    const shareLinks = shareLinksData?.data?.share_links || [];
    const currentItemLinks = shareLinks.filter((link) =>
        fileId ? link.file?.id === fileId : link.folder?.id === folderId
    );

    const collaborators = fileId
        ? fileCollaboratorsData?.data || []
        : folderCollaboratorsData?.data || [];

    const users = searchResults?.data || [];

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            setPassword("");
            setExpirationDate(undefined);
            setPermission("view");
            setAllowDownload(true);
            setSearchTerm("");
            setSelectedUser(null);
            setCollaboratorRole("viewer");
            setCollaboratorExpiration(undefined);
        }
    }, [isOpen]);

    const handleCreateShareLink = async () => {
        const requestData: ShareLinkCreateRequest = {
            permission,
            allow_download: allowDownload,
            ...(fileId && { file_id: fileId }),
            ...(folderId && { folder_id: folderId }),
            ...(password && { password }),
            ...(expirationDate && { expires_at: expirationDate.toISOString() }),
        };

        try {
            const result = await createShareLink(requestData).unwrap();
            toast.success("Share link created successfully!");

            // Copy to clipboard
            if (result.data?.share_url) {
                await navigator.clipboard.writeText(result.data.share_url);
                toast.success("Share link copied to clipboard!");
            }

            // Reset form
            setPassword("");
            setExpirationDate(undefined);
            setPermission("view");
            setAllowDownload(true);

            refetchShareLinks();
        } catch (error) {
            toast.error("Failed to create share link");
            console.error("Create share link error:", error);
        }
    };

    const handleCopyLink = async (shareUrl: string) => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const handleDeleteLink = async (linkId: string) => {
        try {
            await deleteShareLink(linkId).unwrap();
            toast.success("Share link deleted successfully!");
            refetchShareLinks();
        } catch (error) {
            toast.error("Failed to delete share link");
            console.error("Delete share link error:", error);
        }
    };

    const handleAddCollaborator = async () => {
        if (!selectedUser) {
            toast.error("Please select a user");
            return;
        }

        const requestData: AddCollaboratorRequest = {
            user_id: selectedUser.id,
            role: collaboratorRole,
            ...(collaboratorExpiration && {
                expires_at: collaboratorExpiration.toISOString(),
            }),
        };

        try {
            if (fileId) {
                await addFileCollaborator({
                    fileId,
                    data: requestData,
                }).unwrap();
            } else if (folderId) {
                await addFolderCollaborator({
                    folderId,
                    data: requestData,
                }).unwrap();
            }

            toast.success("Collaborator added successfully!");
            setSelectedUser(null);
            setSearchTerm("");
            setCollaboratorRole("viewer");
            setCollaboratorExpiration(undefined);

            if (fileId) {
                refetchFileCollaborators();
            } else {
                refetchFolderCollaborators();
            }
        } catch (error) {
            toast.error("Failed to add collaborator");
            console.error("Add collaborator error:", error);
        }
    };

    const handleRemoveCollaborator = async (collaboratorId: string) => {
        try {
            if (fileId) {
                await removeFileCollaborator({
                    fileId,
                    collaboratorId,
                }).unwrap();
            } else if (folderId) {
                await removeFolderCollaborator({
                    folderId,
                    collaboratorId,
                }).unwrap();
            }

            toast.success("Collaborator removed successfully!");

            if (fileId) {
                refetchFileCollaborators();
            } else {
                refetchFolderCollaborators();
            }
        } catch (error) {
            toast.error("Failed to remove collaborator");
            console.error("Remove collaborator error:", error);
        }
    };

    const getPermissionIcon = (permission: SharePermission) => {
        const option = PERMISSION_OPTIONS.find(
            (opt) => opt.value === permission
        );
        const Icon = option?.icon || Eye;
        return <Icon className="h-4 w-4" />;
    };

    const getPermissionLabel = (permission: SharePermission) => {
        const option = PERMISSION_OPTIONS.find(
            (opt) => opt.value === permission
        );
        return option?.label || "View only";
    };

    const getRoleIcon = (role: CollaboratorRole) => {
        const option = COLLABORATOR_ROLE_OPTIONS.find(
            (opt) => opt.value === role
        );
        const Icon = option?.icon || Eye;
        return <Icon className="h-4 w-4" />;
    };

    const getRoleLabel = (role: CollaboratorRole) => {
        const option = COLLABORATOR_ROLE_OPTIONS.find(
            (opt) => opt.value === role
        );
        return option?.label || "Viewer";
    };

    const formatExpirationDate = (dateString?: string) => {
        if (!dateString) return "Never expires";
        const date = new Date(dateString);
        const now = new Date();

        if (date < now) {
            return "Expired";
        }

        return `Expires ${format(date, "MMM dd, yyyy")}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share "{fileName || folderName}"
                    </DialogTitle>
                    <DialogDescription>
                        Create share links and manage collaborators for this{" "}
                        {fileId ? "file" : "folder"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="links"
                            className="flex items-center gap-2"
                        >
                            <Globe className="h-4 w-4" />
                            Share Links
                        </TabsTrigger>
                        <TabsTrigger
                            value="collaborators"
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            Collaborators
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="links" className="space-y-6">
                        {/* Create New Share Link */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Create New Share Link
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Permission Selection */}
                                <div className="space-y-2">
                                    <Label>Permission Level</Label>
                                    <Select
                                        value={permission}
                                        onValueChange={(
                                            value: SharePermission
                                        ) => setPermission(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PERMISSION_OPTIONS.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <option.icon className="h-4 w-4" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {
                                                                        option.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Password Protection */}
                                <div className="space-y-2">
                                    <Label>
                                        Password Protection (Optional)
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter password to protect this link"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Expiration Date */}
                                <div className="space-y-2">
                                    <Label>Expiration Date (Optional)</Label>
                                    <Popover
                                        open={showCalendar}
                                        onOpenChange={setShowCalendar}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                            >
                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                {expirationDate
                                                    ? format(
                                                          expirationDate,
                                                          "MMM dd, yyyy"
                                                      )
                                                    : "Set expiration date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={expirationDate}
                                                onSelect={(date) => {
                                                    setExpirationDate(date);
                                                    setShowCalendar(false);
                                                }}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {expirationDate && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setExpirationDate(undefined)
                                            }
                                        >
                                            Clear expiration
                                        </Button>
                                    )}
                                </div>

                                {/* Download Permission */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Downloads</Label>
                                        <div className="text-sm text-gray-500">
                                            Allow users to download the file
                                        </div>
                                    </div>
                                    <Switch
                                        checked={allowDownload}
                                        onCheckedChange={setAllowDownload}
                                    />
                                </div>

                                <Button
                                    onClick={handleCreateShareLink}
                                    disabled={isCreating}
                                    className="w-full"
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {isCreating
                                        ? "Creating..."
                                        : "Create Share Link"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Existing Share Links */}
                        {currentItemLinks.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Existing Share Links (
                                        {currentItemLinks.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {currentItemLinks.map((link) => (
                                            <div
                                                key={link.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getPermissionIcon(
                                                            link.permission
                                                        )}
                                                        <span className="font-medium">
                                                            {getPermissionLabel(
                                                                link.permission
                                                            )}
                                                        </span>
                                                        {link.has_password && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                <Lock className="h-3 w-3 mr-1" />
                                                                Protected
                                                            </Badge>
                                                        )}
                                                        {!link.allow_download && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                No Downloads
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                {
                                                                    link.view_count
                                                                }{" "}
                                                                views
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Download className="h-3 w-3" />
                                                                {
                                                                    link.download_count
                                                                }{" "}
                                                                downloads
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatExpirationDate(
                                                                    link.expires_at
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="font-mono text-xs bg-gray-50 p-1 rounded truncate">
                                                            {link.share_url}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleCopyLink(
                                                                link.share_url
                                                            )
                                                        }
                                                    >
                                                        <Copy className="h-4 w-4" />
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
                                                                    handleCopyLink(
                                                                        link.share_url
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                Copy Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    handleDeleteLink(
                                                                        link.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Link
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="collaborators" className="space-y-6">
                        {/* Add New Collaborator */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Add Collaborator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* User Search */}
                                <div className="space-y-2">
                                    <Label>Search Users</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                    {searchTerm.length >= 2 &&
                                        users.length > 0 && (
                                            <div className="border rounded-lg max-h-40 overflow-y-auto">
                                                {users.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                        {selectedUser?.id ===
                                                            user.id && (
                                                            <div className="text-blue-600">
                                                                ✓
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    {selectedUser && (
                                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">
                                                    {selectedUser.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {selectedUser.email}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedUser(null)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select
                                        value={collaboratorRole}
                                        onValueChange={(
                                            value: CollaboratorRole
                                        ) => setCollaboratorRole(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COLLABORATOR_ROLE_OPTIONS.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <option.icon className="h-4 w-4" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {
                                                                        option.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Expiration Date */}
                                <div className="space-y-2">
                                    <Label>Expiration Date (Optional)</Label>
                                    <Popover
                                        open={showCollaboratorCalendar}
                                        onOpenChange={
                                            setShowCollaboratorCalendar
                                        }
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                            >
                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                {collaboratorExpiration
                                                    ? format(
                                                          collaboratorExpiration,
                                                          "MMM dd, yyyy"
                                                      )
                                                    : "Set expiration date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    collaboratorExpiration
                                                }
                                                onSelect={(date) => {
                                                    setCollaboratorExpiration(
                                                        date
                                                    );
                                                    setShowCollaboratorCalendar(
                                                        false
                                                    );
                                                }}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {collaboratorExpiration && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setCollaboratorExpiration(
                                                    undefined
                                                )
                                            }
                                        >
                                            Clear expiration
                                        </Button>
                                    )}
                                </div>

                                <Button
                                    onClick={handleAddCollaborator}
                                    disabled={!selectedUser}
                                    className="w-full"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Add Collaborator
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Existing Collaborators */}
                        {collaborators.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Collaborators ({collaborators.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {collaborators.map((collaborator) => (
                                            <div
                                                key={collaborator.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getRoleIcon(
                                                            collaborator.role
                                                        )}
                                                        <span className="font-medium">
                                                            {getRoleLabel(
                                                                collaborator.role
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <div className="font-medium">
                                                            {
                                                                collaborator
                                                                    .user.name
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                collaborator
                                                                    .user.email
                                                            }
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatExpirationDate(
                                                                collaborator.expires_at
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
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
                                                            <DropdownMenuItem>
                                                                <Settings className="h-4 w-4 mr-2" />
                                                                Edit Role
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    handleRemoveCollaborator(
                                                                        collaborator.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Security Notice */}
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-amber-800 mb-1">
                                    Security Notice
                                </p>
                                <p className="text-amber-700">
                                    Share links are public and accessible to
                                    anyone with the link. Collaborators have
                                    specific permissions and can be managed
                                    individually. Use password protection and
                                    expiration dates for sensitive content.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
