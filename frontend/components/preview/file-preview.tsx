"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Download,
    Share,
    Star,
    X,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize,
    Play,
    Pause,
    Volume2,
    VolumeX,
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    File as FileIcon,
    ExternalLink,
    Copy,
} from "lucide-react";
import { File } from "@/types/file";
import { useGetPresignedDownloadUrlMutation } from "@/store/api/filesApi";
import { toast } from "sonner";

interface FilePreviewProps {
    file: File | null;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: (fileId: string, fileName: string) => void;
    onShare?: (fileId: string) => void;
    onToggleStar?: (file: File) => void;
}

const PREVIEWABLE_TYPES = {
    image: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
    video: ["mp4", "webm", "ogg"],
    audio: ["mp3", "wav", "ogg", "m4a"],
    text: ["txt", "md", "json", "xml", "csv"],
    pdf: ["pdf"],
    code: [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "scss",
        "py",
        "java",
        "cpp",
        "c",
        "sql",
    ],
};

const MAX_TEXT_SIZE = 1024 * 1024; // 1MB max for text preview

export function FilePreview({
    file,
    isOpen,
    onClose,
    onDownload,
    onShare,
    onToggleStar,
}: FilePreviewProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [getPresignedUrl] = useGetPresignedDownloadUrlMutation();

    const getFileType = () => {
        if (!file) return null;
        const extension = file.file_extension.toLowerCase().replace(".", "");

        for (const [type, extensions] of Object.entries(PREVIEWABLE_TYPES)) {
            if (extensions.includes(extension)) {
                return type;
            }
        }
        return null;
    };

    const isPreviewable = () => {
        return getFileType() !== null;
    };

    const loadPreview = async () => {
        if (!file || !isPreviewable()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await getPresignedUrl({ id: file.id }).unwrap();
            const url = result.data?.download_url;

            if (!url) {
                throw new Error("Failed to get download URL");
            }

            setPreviewUrl(url);

            // For text files, fetch content
            const fileType = getFileType();
            if (fileType === "text" || fileType === "code") {
                if (file.file_size > MAX_TEXT_SIZE) {
                    setError("File too large for preview");
                    return;
                }

                try {
                    const response = await fetch(url);
                    const text = await response.text();
                    setTextContent(text);
                } catch (err) {
                    setError("Failed to load file content");
                }
            }
        } catch (err) {
            setError("Failed to load preview");
            console.error("Preview error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && file) {
            loadPreview();
        } else {
            setPreviewUrl(null);
            setTextContent(null);
            setZoom(100);
            setRotation(0);
            setError(null);
        }
    }, [isOpen, file?.id]);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = () => {
        const fileType = getFileType();
        switch (fileType) {
            case "image":
                return <FileImage className="h-8 w-8" />;
            case "video":
                return <FileVideo className="h-8 w-8" />;
            case "audio":
                return <FileAudio className="h-8 w-8" />;
            case "text":
            case "code":
                return <FileText className="h-8 w-8" />;
            default:
                return <FileIcon className="h-8 w-8" />;
        }
    };

    const copyFileUrl = async () => {
        if (previewUrl) {
            await navigator.clipboard.writeText(previewUrl);
            toast.success("File URL copied to clipboard");
        }
    };

    const openInNewTab = () => {
        if (previewUrl) {
            window.open(previewUrl, "_blank");
        }
    };

    const renderPreview = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">{getFileIcon()}</div>
                        <p className="text-sm text-gray-600">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={openInNewTab}
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                        </Button>
                    </div>
                </div>
            );
        }

        if (!previewUrl) return null;

        const fileType = getFileType();

        switch (fileType) {
            case "image":
                return (
                    <div className="flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                        <img
                            src={previewUrl}
                            alt={file?.original_name}
                            className="max-w-full max-h-96 object-contain transition-transform"
                            style={{
                                transform: `scale(${
                                    zoom / 100
                                }) rotate(${rotation}deg)`,
                            }}
                        />
                    </div>
                );

            case "video":
                return (
                    <div className="bg-black rounded-lg overflow-hidden">
                        <video
                            controls
                            className="w-full max-h-96"
                            preload="metadata"
                        >
                            <source src={previewUrl} type={file?.mime_type} />
                            Your browser does not support video playback.
                        </video>
                    </div>
                );

            case "audio":
                return (
                    <div className="bg-gray-50 rounded-lg p-8">
                        <div className="flex items-center justify-center mb-4">
                            <FileAudio className="h-16 w-16 text-gray-400" />
                        </div>
                        <audio controls className="w-full">
                            <source src={previewUrl} type={file?.mime_type} />
                            Your browser does not support audio playback.
                        </audio>
                    </div>
                );

            case "pdf":
                return (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <iframe
                            src={previewUrl}
                            className="w-full h-96"
                            title={file?.original_name}
                        />
                    </div>
                );

            case "text":
            case "code":
                return (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <ScrollArea className="h-96">
                            <pre className="text-sm whitespace-pre-wrap break-words">
                                {textContent}
                            </pre>
                        </ScrollArea>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-gray-400 mb-2">
                                {getFileIcon()}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Preview not available for this file type
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openInNewTab}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    if (!file) return null;

    const fileType = getFileType();
    const canZoom = fileType === "image";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center space-x-3">
                        {getFileIcon()}
                        <div>
                            <DialogTitle className="text-left">
                                {file.original_name}
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                {formatFileSize(file.file_size)} •{" "}
                                {file.mime_type}
                                {file.is_starred && (
                                    <Badge variant="secondary" className="ml-2">
                                        <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                                        Starred
                                    </Badge>
                                )}
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {canZoom && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Zoom Out"
                                    onClick={() =>
                                        setZoom(Math.max(25, zoom - 25))
                                    }
                                    disabled={zoom <= 25}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-gray-500 min-w-[3rem] text-center">
                                    {zoom}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Zoom In"
                                    onClick={() =>
                                        setZoom(Math.min(400, zoom + 25))
                                    }
                                    disabled={zoom >= 400}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Rotate 90°"
                                    onClick={() =>
                                        setRotation((rotation + 90) % 360)
                                    }
                                >
                                    <RotateCw className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyFileUrl}
                            title="Copy File URL"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>

                        {onToggleStar && (
                            <Button
                                variant="ghost"
                                size="sm"
                                title="Toggle Star"
                                onClick={() => onToggleStar(file)}
                            >
                                <Star
                                    className={`h-4 w-4 ${
                                        file.is_starred
                                            ? "text-yellow-500 fill-current"
                                            : ""
                                    }`}
                                />
                            </Button>
                        )}

                        {onShare && (
                            <Button
                                variant="ghost"
                                size="sm"
                                title="Share File"
                                onClick={() => onShare(file.id)}
                            >
                                <Share className="h-4 w-4" />
                            </Button>
                        )}

                        {onDownload && (
                            <Button
                                variant="ghost"
                                size="sm"
                                title="Download File"
                                onClick={() =>
                                    onDownload(file.id, file.original_name)
                                }
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">{renderPreview()}</div>

                {/* File Details */}
                <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                                {new Date(file.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Modified</p>
                            <p className="font-medium">
                                {new Date(file.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Downloads</p>
                            <p className="font-medium">{file.download_count}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Visibility</p>
                            <p className="font-medium">
                                {file.is_public ? "Public" : "Private"}
                            </p>
                        </div>
                    </div>

                    {file.description && (
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">Description</p>
                            <p className="text-sm">{file.description}</p>
                        </div>
                    )}

                    {file.tags && (
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
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
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
