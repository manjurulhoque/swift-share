"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Upload,
    File,
    Folder,
    Download,
    Share,
    Trash,
    Search,
    Filter,
} from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const mockFiles = [
        {
            id: 1,
            name: "Project Proposal.pdf",
            size: "2.4 MB",
            type: "PDF",
            uploadDate: "2024-01-15",
            shared: true,
        },
        {
            id: 2,
            name: "Design Assets.zip",
            size: "15.8 MB",
            type: "ZIP",
            uploadDate: "2024-01-14",
            shared: false,
        },
        {
            id: 3,
            name: "Meeting Notes.docx",
            size: "156 KB",
            type: "DOCX",
            uploadDate: "2024-01-13",
            shared: true,
        },
        {
            id: 4,
            name: "Screenshots",
            size: "8.2 MB",
            type: "Folder",
            uploadDate: "2024-01-12",
            shared: false,
        },
    ];

    const stats = [
        { title: "Total Files", value: "24", icon: File },
        { title: "Storage Used", value: "2.8 GB", icon: Folder },
        { title: "Shared Files", value: "12", icon: Share },
        { title: "Downloads", value: "156", icon: Download },
    ];

    return (
        <SidebarInset>
            <div className="flex flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold">
                            Dashboard Overview
                        </h1>
                    </div>
                </header>

                <div className="flex-1 p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <p className="text-gray-600">
                                Manage your files and sharing preferences
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    {stat.title}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <stat.icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Upload Section */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Quick Upload</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Drop files here or click to upload
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Support for all file types up to 100MB
                                    </p>
                                    <Button>Choose Files</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Files */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Recent Files</CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search files..."
                                                className="pl-10 w-64"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {mockFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {file.type === "Folder" ? (
                                                    <Folder className="h-6 w-6 text-blue-500" />
                                                ) : (
                                                    <File className="h-6 w-6 text-gray-500" />
                                                )}
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {file.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {file.size} •{" "}
                                                        {file.uploadDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {file.shared && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        Shared
                                                    </span>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Share className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
