"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Folder as FolderIcon,
    MoreHorizontal,
    Edit,
    Trash2,
    Move,
    FileText,
    FolderOpen,
    Palette,
    Share2,
} from "lucide-react";
import { Folder } from "@/store/api/foldersApi";
import { formatDistanceToNow } from "date-fns";

interface FolderCardProps {
    folder: Folder;
    onOpen: (folderId: string) => void;
    onEdit: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onMove: (folder: Folder) => void;
    onShare?: (folderId: string) => void;
}

const folderColors = [
    { value: "#3B82F6", name: "Blue" },
    { value: "#10B981", name: "Green" },
    { value: "#F59E0B", name: "Yellow" },
    { value: "#EF4444", name: "Red" },
    { value: "#8B5CF6", name: "Purple" },
    { value: "#F97316", name: "Orange" },
    { value: "#06B6D4", name: "Cyan" },
    { value: "#84CC16", name: "Lime" },
];

export function FolderCard({
    folder,
    onOpen,
    onEdit,
    onDelete,
    onMove,
    onShare,
}: FolderCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editName, setEditName] = useState(folder.name);
    const [editColor, setEditColor] = useState(folder.color || "#3B82F6");

    const handleEdit = () => {
        onEdit({
            ...folder,
            name: editName,
            color: editColor,
        });
        setShowEditDialog(false);
    };

    const handleDelete = () => {
        onDelete(folder);
        setShowDeleteDialog(false);
    };

    const getFolderIcon = () => {
        return (
            <FolderIcon
                className="h-12 w-12"
                style={{
                    color: folder.color || "#3B82F6",
                    fill: `${folder.color || "#3B82F6"}20`,
                }}
            />
        );
    };

    return (
        <>
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div
                            className="flex-1 flex items-center space-x-3"
                            onClick={() => onOpen(folder.id)}
                        >
                            {getFolderIcon()}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                    {folder.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center space-x-1">
                                        <FolderOpen className="h-3 w-3" />
                                        <span>
                                            {folder.subfolder_count} folders
                                        </span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <FileText className="h-3 w-3" />
                                        <span>{folder.file_count} files</span>
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(
                                        new Date(folder.updated_at),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    onClick={() => onOpen(folder.id)}
                                >
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Open
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditName(folder.name);
                                        setEditColor(folder.color || "#3B82F6");
                                        setShowEditDialog(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onMove(folder)}
                                >
                                    <Move className="h-4 w-4 mr-2" />
                                    Move
                                </DropdownMenuItem>
                                {onShare && (
                                    <DropdownMenuItem
                                        onClick={() => onShare(folder.id)}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {folder.is_shared && (
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Shared
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Folder</DialogTitle>
                        <DialogDescription>
                            Change the folder name and color.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="folderName">Folder Name</Label>
                            <Input
                                id="folderName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Enter folder name"
                            />
                        </div>
                        <div>
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {folderColors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                                            editColor === color.value
                                                ? "border-gray-800 scale-110"
                                                : "border-gray-300 hover:border-gray-500"
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() =>
                                            setEditColor(color.value)
                                        }
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEditDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={!editName.trim()}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Folder</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{folder.name}"?
                            This action will permanently delete the folder and
                            all its contents. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Folder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
