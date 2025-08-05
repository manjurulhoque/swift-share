import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Share,
    Trash,
    Edit,
    Calendar,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File } from "@/types/file";

interface FileCardProps {
    file: File;
    onDownload: (fileId: string, fileName: string) => void;
    onShare: (fileId: string) => void;
    onEdit: (file: File) => void;
    onDelete: (file: File) => void;
    isDownloading?: boolean;
}

export function FileCard({
    file,
    onDownload,
    onShare,
    onEdit,
    onDelete,
    isDownloading = false,
}: FileCardProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith("image/")) return "🖼️";
        if (mimeType.startsWith("video/")) return "🎥";
        if (mimeType.startsWith("audio/")) return "🎵";
        if (mimeType.includes("pdf")) return "📄";
        if (mimeType.includes("word") || mimeType.includes("document"))
            return "📝";
        if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
            return "📊";
        if (
            mimeType.includes("presentation") ||
            mimeType.includes("powerpoint")
        )
            return "📈";
        if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
        return "📄";
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                            {getFileIcon(file.mime_type)}
                        </span>
                        <div className="flex-1 min-w-0 max-w-[200px]">
                            <h3
                                className="font-medium text-gray-900 truncate"
                                title={file.original_name}
                            >
                                {file.original_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {formatFileSize(file.file_size)}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    onDownload(file.id, file.original_name)
                                }
                                disabled={isDownloading}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onShare(file.id)}>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(file)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(file)}
                                className="text-red-600"
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {file.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(file.created_at)}
                            </span>
                            <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {file.download_count}
                            </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {file.is_public ? "Public" : "Private"}
                        </Badge>
                    </div>
                    {file.tags && (
                        <div className="flex flex-wrap gap-1">
                            {file.tags.split(",").map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {tag.trim()}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
