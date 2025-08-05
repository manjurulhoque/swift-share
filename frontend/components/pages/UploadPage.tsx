"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, X } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [recipients, setRecipients] = useState("");
    const [message, setMessage] = useState("");
    const [expiryDays, setExpiryDays] = useState(7);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
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
                                    disabled={files.length === 0}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Start Transfer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
