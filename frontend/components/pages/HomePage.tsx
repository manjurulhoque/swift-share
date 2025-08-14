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
    CheckCircle,
    Star,
    ArrowRight,
    Download,
    FileText,
    Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
    const features = [
        {
            icon: Shield,
            title: "Enterprise Security",
            description:
                "Bank-level encryption with SOC 2 compliance. Your files are protected with AES-256 encryption at rest and in transit.",
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description:
                "Experience blazing-fast uploads up to 10GB with smart compression and resume capability for interrupted transfers.",
        },
        {
            icon: Globe,
            title: "Global CDN",
            description:
                "Access your files instantly from anywhere with our global content delivery network spanning 50+ locations worldwide.",
        },
        {
            icon: Users,
            title: "Team Workspace",
            description:
                "Advanced collaboration tools with real-time comments, version control, and granular permission management.",
        },
        {
            icon: Lock,
            title: "Zero-Knowledge",
            description:
                "End-to-end encryption ensures only you can access your data. Even we can't see your files - ultimate privacy guaranteed.",
        },
        {
            icon: Cloud,
            title: "Smart Sync",
            description:
                "Intelligent synchronization with conflict resolution, automatic backups, and offline access across all devices.",
        },
    ];

    const stats = [
        { number: "25M+", label: "Files Shared Securely" },
        { number: "100K+", label: "Happy Customers" },
        { number: "99.99%", label: "Uptime SLA" },
        { number: "150+", label: "Countries Served" },
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "CTO, TechCorp",
            company: "TechCorp Inc.",
            content:
                "SwiftShare has revolutionized how our distributed team shares sensitive documents. The security features give us complete peace of mind.",
            rating: 5,
        },
        {
            name: "Michael Rodriguez",
            role: "Creative Director",
            company: "Design Studio",
            content:
                "The speed and reliability are incredible. We can share large design files with clients instantly, and the collaboration features are game-changing.",
            rating: 5,
        },
        {
            name: "Emma Thompson",
            role: "Project Manager",
            company: "Global Consulting",
            content:
                "SwiftShare's enterprise features and compliance certifications make it the perfect solution for our regulated industry.",
            rating: 5,
        },
    ];

    const useCases = [
        {
            icon: FileText,
            title: "Document Sharing",
            description:
                "Securely share contracts, reports, and sensitive documents with clients and partners.",
        },
        {
            icon: Download,
            title: "Large File Transfer",
            description:
                "Send files up to 10GB instantly without email size limitations or compression quality loss.",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description:
                "Collaborate on projects with real-time updates, comments, and version tracking.",
        },
        {
            icon: Clock,
            title: "Temporary Sharing",
            description:
                "Set expiration dates and download limits for time-sensitive file sharing.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                Trusted by 100,000+ professionals worldwide
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                            Secure File Sharing
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Made Simple
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                            SwiftShare is the enterprise-grade file sharing
                            platform that combines military-level security with
                            intuitive design. Share files up to 10GB instantly
                            with advanced collaboration tools.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
                                >
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>
                        <div className="text-sm text-blue-200">
                            No credit card required • 14-day free trial • Cancel
                            anytime
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
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                                ENTERPRISE FEATURES
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Why Choose SwiftShare?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Built for modern teams who demand uncompromising
                                security, lightning-fast performance, and
                                seamless collaboration.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white"
                                >
                                    <CardContent className="p-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                            <feature.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Perfect for Every Use Case
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From small teams to enterprise organizations,
                                SwiftShare adapts to your workflow.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {useCases.map((useCase, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                                        <useCase.icon className="h-10 w-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Loved by Teams Worldwide
                            </h2>
                            <p className="text-xl text-gray-600">
                                See what our customers are saying about
                                SwiftShare
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex mb-4">
                                            {[...Array(testimonial.rating)].map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-5 h-5 text-yellow-400 fill-current"
                                                    />
                                                )
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-6 leading-relaxed italic">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="border-t pt-6">
                                            <div className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium">
                                                {testimonial.company}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Get Started in Minutes
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Simple, intuitive workflow that gets you sharing
                                files securely in just three steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connection lines for desktop */}
                            <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full">
                                <div className="flex justify-between items-center px-16">
                                    <ArrowRight className="w-8 h-8 text-blue-300" />
                                    <ArrowRight className="w-8 h-8 text-blue-300" />
                                </div>
                            </div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Upload className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Upload Instantly
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Drag and drop files up to 10GB or browse
                                    from your device. Our smart compression
                                    ensures blazing-fast uploads with resume
                                    capability.
                                </p>
                            </div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Share className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Share Securely
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Generate encrypted sharing links with custom
                                    passwords, expiration dates, and download
                                    limits for complete control.
                                </p>
                            </div>

                            <div className="text-center relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Users className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Collaborate Effortlessly
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Your team can access, comment, and
                                    collaborate on files in real-time with
                                    version control and activity tracking.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your File Sharing?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Join over 100,000 professionals who trust SwiftShare
                            for secure, fast, and reliable file sharing. Start
                            your free trial today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
                                >
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-8 text-blue-200 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                14-day free trial
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Cancel anytime
                            </div>
                        </div>
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
                                        SwiftShare
                                    </span>
                                </div>
                                <p className="text-gray-400">
                                    Enterprise-grade file sharing platform
                                    trusted by teams worldwide.
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
                            <p>&copy; 2024 SwiftShare. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
