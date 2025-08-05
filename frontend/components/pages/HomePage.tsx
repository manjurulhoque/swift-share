"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Zap,
    Globe,
    Users,
    Upload,
    Share,
    Lock,
    Cloud,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
    const features = [
        {
            icon: Shield,
            title: "Secure Storage",
            description:
                "Enterprise-grade encryption keeps your files safe and secure.",
        },
        {
            icon: Zap,
            title: "Fast Upload",
            description: "Lightning-fast upload speeds with resume capability.",
        },
        {
            icon: Globe,
            title: "Global Access",
            description:
                "Access your files from anywhere in the world, anytime.",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Share and collaborate with your team seamlessly.",
        },
        {
            icon: Lock,
            title: "Privacy First",
            description:
                "Your data is private and never shared with third parties.",
        },
        {
            icon: Cloud,
            title: "Cloud Sync",
            description: "Automatic synchronization across all your devices.",
        },
    ];

    const stats = [
        { number: "10M+", label: "Files Shared" },
        { number: "50K+", label: "Active Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Share Files Securely
                            <span className="block text-blue-200">
                                With CloudShare
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            The professional file sharing platform trusted by
                            thousands of businesses worldwide. Upload, share,
                            and collaborate with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                                >
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                                >
                                    View Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose CloudShare?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Built for professionals who need reliable,
                                secure, and fast file sharing solutions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-8 text-center">
                                        <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600">
                                Simple, fast, and secure file sharing in three
                                easy steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    1. Upload
                                </h3>
                                <p className="text-gray-600">
                                    Drag and drop your files or click to upload.
                                    Supports all file types up to 100MB.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Share className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    2. Share
                                </h3>
                                <p className="text-gray-600">
                                    Generate secure sharing links with optional
                                    passwords and expiration dates.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    3. Collaborate
                                </h3>
                                <p className="text-gray-600">
                                    Your team can access, download, and
                                    collaborate on files instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-blue-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who trust CloudShare
                            for their file sharing needs.
                        </p>
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                            >
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Share className="h-8 w-8 text-blue-400" />
                                    <span className="text-xl font-bold">
                                        CloudShare
                                    </span>
                                </div>
                                <p className="text-gray-400">
                                    Secure file sharing for modern businesses.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Product
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link
                                            href="/features"
                                            className="hover:text-white"
                                        >
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/pricing"
                                            className="hover:text-white"
                                        >
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/security"
                                            className="hover:text-white"
                                        >
                                            Security
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Company
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link
                                            href="/about"
                                            className="hover:text-white"
                                        >
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/contact"
                                            className="hover:text-white"
                                        >
                                            Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/careers"
                                            className="hover:text-white"
                                        >
                                            Careers
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Support
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link
                                            href="/help"
                                            className="hover:text-white"
                                        >
                                            Help Center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/privacy"
                                            className="hover:text-white"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/terms"
                                            className="hover:text-white"
                                        >
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 CloudShare. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
