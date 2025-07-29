"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Share, LogIn, UserPlus, Home, Upload, Users } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Share className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">
                                CloudShare
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                                isActive("/")
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/dashboard"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                                isActive("/dashboard")
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            <Upload className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href="/admin"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                                isActive("/admin")
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            <Users className="h-4 w-4" />
                            <span>Admin</span>
                        </Link>

                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-1"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Login</span>
                            </Button>
                        </Link>

                        <Link href="/signup">
                            <Button
                                size="sm"
                                className="flex items-center space-x-1"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Sign Up</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
