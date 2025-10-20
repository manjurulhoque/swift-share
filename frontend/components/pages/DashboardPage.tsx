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
import { SidebarInset } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetDashboardStatsQuery } from "@/store/api/authApi";
import { useGetFilesQuery } from "@/store/api/filesApi";
import { useGetRecentFilesQuery } from "@/store/api/filesApi";

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch dashboard statistics
    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError,
    } = useGetDashboardStatsQuery();

    // Fetch recent files
    const { data: recentFilesData, isLoading: recentFilesLoading } =
        useGetRecentFilesQuery({ limit: 10 });

    // Fetch files for search
    const { data: filesData, isLoading: filesLoading } = useGetFilesQuery({
        page: 1,
        limit: 10,
        search: searchTerm || undefined,
    });

    // Format file size helper
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    // Get files to display (recent files or search results)
    const displayFiles = searchTerm
        ? filesData?.data?.files || []
        : recentFilesData?.data?.recent_files || [];

    // Prepare stats data
    const stats = statsData?.data
        ? [
              {
                  title: "Total Files",
                  value: statsData.data.total_files.toString(),
                  icon: File,
              },
              {
                  title: "Storage Used",
                  value: formatFileSize(statsData.data.storage_used),
                  icon: Folder,
              },
              {
                  title: "Shared Files",
                  value: statsData.data.shared_files.toString(),
                  icon: Share,
              },
              {
                  title: "Downloads",
                  value: statsData.data.total_downloads.toString(),
                  icon: Download,
              },
          ]
        : [
              { title: "Total Files", value: "0", icon: File },
              { title: "Storage Used", value: "0 B", icon: Folder },
              { title: "Shared Files", value: "0", icon: Share },
              { title: "Downloads", value: "0", icon: Download },
          ];

    return (
        <SidebarInset>
            <div className="flex flex-col">
                <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex-1 p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <p className="text-gray-600">
                                Manage your files and sharing preferences
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statsLoading
                                ? [...Array(4)].map((_, index) => (
                                      <Card key={index}>
                                          <CardContent className="p-6">
                                              <div className="flex items-center justify-between">
                                                  <div className="flex-1">
                                                      <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                  </div>
                                                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                              </div>
                                          </CardContent>
                                      </Card>
                                  ))
                                : stats.map((stat, index) => (
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
                                {statsLoading ||
                                recentFilesLoading ||
                                filesLoading ? (
                                    <div className="space-y-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                                                    <div>
                                                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : displayFiles.length > 0 ? (
                                    <div className="space-y-2">
                                        {displayFiles.map((file: any) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <File className="h-6 w-6 text-gray-500" />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {file.original_name ||
                                                                file.file
                                                                    ?.original_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {formatFileSize(
                                                                file.file_size ||
                                                                    file.file
                                                                        ?.file_size ||
                                                                    0
                                                            )}{" "}
                                                            •{" "}
                                                            {new Date(
                                                                file.created_at ||
                                                                    file.file
                                                                        ?.created_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {(file.is_public ||
                                                        file.file
                                                            ?.is_public) && (
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
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {searchTerm
                                            ? "No files found matching your search."
                                            : "No recent files to display."}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
