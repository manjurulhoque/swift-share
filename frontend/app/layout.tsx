import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./providers/QueryProvider";

export const metadata: Metadata = {
    title: "CloudShare - Secure File Sharing",
    description:
        "Professional file sharing platform trusted by thousands of businesses worldwide.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        {children}
                    </TooltipProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
