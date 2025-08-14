"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Share,
    LogIn,
    UserPlus,
    Home,
    Upload,
    Users,
    User,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
    const pathname = usePathname();
    const { session, isAuthenticated, logout, isAdmin } = useAuth();

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

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {session?.user?.firstName?.charAt(
                                                    0
                                                ) ||
                                                    session?.user?.name?.charAt(
                                                        0
                                                    ) ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {session?.user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session?.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="flex items-center"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/admin"
                                                className="flex items-center"
                                            >
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="flex items-center"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
