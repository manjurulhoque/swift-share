"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <DashboardSidebar />
                {children}
            </div>
        </SidebarProvider>
    );
}
