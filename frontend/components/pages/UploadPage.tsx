"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, X, Send, AlertCircle } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUploadMultipleFilesMutation } from "@/store/api/filesApi";
import { useAuth } from "@/hooks/use-auth";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";

export default function UploadPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [recipients, setRecipients] = useState("");
    const [message, setMessage] = useState("");
    const [expiryDays, setExpiryDays] = useState(7);
    const [uploadMultipleFiles, { isLoading: isUploading }] =
        useUploadMultipleFilesMutation();

    // Redirect if not authenticated
    if (!isAuthLoading && !isAuthenticated) {
        redirect("/login", RedirectType.replace);
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleStartTransfer = async () => {
        if (files.length === 0) {
            toast.error("Please select at least one file");
            return;
        }

        try {
            const formData = new FormData();

            // Add files to form data
            files.forEach((file) => {
                formData.append("files", file);
            });

            // Add other form data
            formData.append("description", message);
            formData.append("tags", "");
            formData.append("is_public", "false");
            formData.append("recipients", recipients);
            formData.append("message", message);
            formData.append("expiry_days", expiryDays.toString());

            const result = await uploadMultipleFiles(formData).unwrap();

            toast.success(
                `Successfully uploaded ${result.success_count} files`
            );

            if (result.error_count > 0) {
                toast.error(`${result.error_count} files failed to upload`);
            }

            // Clear form
            setFiles([]);
            setRecipients("");
            setMessage("");
            setExpiryDays(7);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload files. Please try again.");
        }
    };

    return (
        <SidebarInset>
            <div className="flex flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="text-lg font-semibold">Upload Files</h1>
                </header>

                <div className="flex-1 p-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Upload Area */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Drop files here or click to upload
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Support for all file types up to 2GB
                                    </p>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <Button asChild>
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            Choose Files
                                        </label>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Selected Files ({files.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <File className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {(
                                                                file.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeFile(index)
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

                        {/* Transfer Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {files.length > 0 && (
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                                        <span className="text-sm text-blue-700">
                                            {files.length} file
                                            {files.length > 1 ? "s" : ""}{" "}
                                            selected for upload
                                            {(() => {
                                                const totalSize = files.reduce(
                                                    (acc, file) =>
                                                        acc + file.size,
                                                    0
                                                );
                                                const totalSizeMB = (
                                                    totalSize /
                                                    1024 /
                                                    1024
                                                ).toFixed(2);
                                                return ` (${totalSizeMB} MB total)`;
                                            })()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Recipients (optional)
                                    </label>
                                    <Input
                                        placeholder="Enter email addresses separated by commas"
                                        value={recipients}
                                        onChange={(e) =>
                                            setRecipients(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Message (optional)
                                    </label>
                                    <Textarea
                                        placeholder="Add a message for recipients"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Expires after
                                    </label>
                                    <select
                                        value={expiryDays}
                                        onChange={(e) =>
                                            setExpiryDays(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value={1}>1 day</option>
                                        <option value={7}>7 days</option>
                                        <option value={30}>30 days</option>
                                    </select>
                                </div>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={files.length === 0 || isUploading}
                                    onClick={handleStartTransfer}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Start Transfer
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
