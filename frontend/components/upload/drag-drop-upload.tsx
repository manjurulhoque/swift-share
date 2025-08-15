"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Upload,
    File as FileIcon,
    X,
    CheckCircle,
    AlertCircle,
    Folder,
} from "lucide-react";
import { toast } from "sonner";
import { useUploadMultipleFilesMutation } from "@/store/api/filesApi";

interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: "pending" | "uploading" | "completed" | "error";
    error?: string;
}

interface DragDropUploadProps {
    currentFolderId?: string;
    folderName?: string;
    onUploadComplete?: () => void;
    maxFiles?: number;
    maxSize?: number; // in bytes
    acceptedTypes?: string[];
}

export function DragDropUpload({
    currentFolderId,
    folderName = "Root",
    onUploadComplete,
    maxFiles = 10,
    maxSize = 100 * 1024 * 1024, // 100MB default
    acceptedTypes = [],
}: DragDropUploadProps) {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMultipleFiles] = useUploadMultipleFilesMutation();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Validate file count
            if (uploadFiles.length + acceptedFiles.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} files allowed`);
                return;
            }

            // Create upload file objects
            const newUploadFiles: UploadFile[] = acceptedFiles.map((file) => ({
                id: Math.random().toString(36).substring(7),
                file,
                progress: 0,
                status: "pending",
            }));

            setUploadFiles((prev) => [...prev, ...newUploadFiles]);
        },
        [uploadFiles.length, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            maxSize,
            maxFiles: maxFiles - uploadFiles.length,
            accept:
                acceptedTypes.length > 0
                    ? acceptedTypes.reduce((acc, type) => {
                          acc[type] = [];
                          return acc;
                      }, {} as Record<string, string[]>)
                    : undefined,
            disabled: isUploading,
        });

    const removeFile = (id: string) => {
        setUploadFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const clearAll = () => {
        setUploadFiles([]);
    };

    const uploadAllFiles = async () => {
        if (uploadFiles.length === 0) return;

        setIsUploading(true);

        try {
            // Simulate individual file progress updates
            const uploadPromises = uploadFiles.map(async (uploadFile) => {
                try {
                    setUploadFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? { ...f, status: "uploading", progress: 0 }
                                : f
                        )
                    );

                    // Create FormData for this file
                    const formData = new FormData();
                    formData.append("files", uploadFile.file);
                    formData.append("description", "");
                    formData.append("tags", "");
                    formData.append("is_public", "false");
                    if (currentFolderId) {
                        formData.append("folder_id", currentFolderId);
                    }

                    // Simulate progress updates
                    const progressInterval = setInterval(() => {
                        setUploadFiles((prev) =>
                            prev.map((f) =>
                                f.id === uploadFile.id && f.progress < 90
                                    ? { ...f, progress: f.progress + 10 }
                                    : f
                            )
                        );
                    }, 100);

                    // Upload the file
                    await uploadMultipleFiles(formData).unwrap();

                    clearInterval(progressInterval);

                    setUploadFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? { ...f, status: "completed", progress: 100 }
                                : f
                        )
                    );

                    return { success: true, fileName: uploadFile.file.name };
                } catch (error) {
                    setUploadFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? {
                                      ...f,
                                      status: "error",
                                      error:
                                          error instanceof Error
                                              ? error.message
                                              : "Upload failed",
                                  }
                                : f
                        )
                    );
                    return {
                        success: false,
                        fileName: uploadFile.file.name,
                        error,
                    };
                }
            });

            const results = await Promise.all(uploadPromises);
            const successful = results.filter((r) => r.success);
            const failed = results.filter((r) => !r.success);

            if (successful.length > 0) {
                toast.success(
                    `${successful.length} file(s) uploaded successfully!`
                );
                onUploadComplete?.();
            }

            if (failed.length > 0) {
                toast.error(`${failed.length} file(s) failed to upload`);
            }
        } catch (error) {
            toast.error("Failed to upload files");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getStatusIcon = (status: UploadFile["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "error":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <FileIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <Card
                {...getRootProps()}
                className={`border-2 border-dashed transition-all cursor-pointer ${
                    isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : isDragReject
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
            >
                <CardContent className="p-8 text-center">
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">
                            {isDragActive
                                ? "Drop files here..."
                                : "Drag & drop files here"}
                        </p>
                        <p className="text-sm text-gray-500">
                            or click to browse files
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                            <Folder className="h-3 w-3" />
                            <span>Uploading to: {folderName}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            Max {maxFiles} files, {formatFileSize(maxSize)} each
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* File List */}
            {uploadFiles.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">
                                Files ({uploadFiles.length})
                            </h3>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAll}
                                    disabled={isUploading}
                                >
                                    Clear All
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={uploadAllFiles}
                                    disabled={
                                        isUploading ||
                                        uploadFiles.length === 0 ||
                                        uploadFiles.every(
                                            (f) => f.status === "completed"
                                        )
                                    }
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload All"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {uploadFiles.map((uploadFile) => (
                                <div
                                    key={uploadFile.id}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    {getStatusIcon(uploadFile.status)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {uploadFile.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(
                                                uploadFile.file.size
                                            )}
                                        </p>
                                        {uploadFile.status === "uploading" && (
                                            <Progress
                                                value={uploadFile.progress}
                                                className="w-full mt-1"
                                            />
                                        )}
                                        {uploadFile.status === "error" && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {uploadFile.error}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            removeFile(uploadFile.id)
                                        }
                                        disabled={
                                            uploadFile.status === "uploading"
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
