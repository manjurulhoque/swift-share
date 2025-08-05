"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, BarChart3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function AdminPage() {
    const stats = [
        { title: "Total Users", value: "1,234", icon: Users },
        { title: "Total Files", value: "5,678", icon: FileText },
        { title: "Storage Used", value: "890 GB", icon: BarChart3 },
        { title: "Active Sessions", value: "42", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage users, files, and system settings
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

                    {/* Admin Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Manage user accounts and permissions
                                </p>
                                <Button className="w-full">Manage Users</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>File Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Monitor and manage uploaded files
                                </p>
                                <Button className="w-full">Manage Files</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>System Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Configure system-wide settings
                                </p>
                                <Button className="w-full">Settings</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
