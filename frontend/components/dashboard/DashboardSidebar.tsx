"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    Upload,
    File,
    History,
    Settings,
    User,
    Share,
    BarChart3,
    Download,
    Shield,
} from "lucide-react";

const menuItems = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: BarChart3,
    },
    {
        title: "Upload Files",
        url: "/dashboard/upload",
        icon: Upload,
    },
    {
        title: "My Files",
        url: "/dashboard/files",
        icon: File,
    },
    {
        title: "Shared Links",
        url: "/dashboard/shared",
        icon: Share,
    },
    {
        title: "Transfer History",
        url: "/dashboard/history",
        icon: History,
    },
    {
        title: "Downloads",
        url: "/dashboard/downloads",
        icon: Download,
    },
];

const settingsItems = [
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Security",
        url: "/dashboard/security",
        icon: Shield,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Dashboard
                    </h2>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>File Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4 text-xs text-gray-500">CloudShare v1.0</div>
            </SidebarFooter>
        </Sidebar>
    );
}
