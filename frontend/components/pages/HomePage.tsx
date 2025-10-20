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
import Footer from "@/components/layout/Footer";

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
                <section
                    className="text-white py-24 relative overflow-hidden"
                    style={{ backgroundColor: "#1e40af" }}
                >
                    {/* SVG Background Pattern */}
                    <div className="absolute inset-0">
                        <svg
                            className="w-full h-full object-cover"
                            viewBox="0 0 1200 800"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <defs>
                                <pattern
                                    id="hero-pattern"
                                    x="0"
                                    y="0"
                                    width="100"
                                    height="100"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="2"
                                        fill="rgba(255,255,255,0.1)"
                                    />
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="1"
                                        fill="rgba(255,255,255,0.05)"
                                    />
                                    <circle
                                        cx="80"
                                        cy="30"
                                        r="1.5"
                                        fill="rgba(255,255,255,0.08)"
                                    />
                                    <circle
                                        cx="30"
                                        cy="80"
                                        r="1"
                                        fill="rgba(255,255,255,0.06)"
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r="1"
                                        fill="rgba(255,255,255,0.04)"
                                    />
                                </pattern>
                                <linearGradient
                                    id="hero-gradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#3b82f6"
                                        stopOpacity="0.8"
                                    />
                                    <stop
                                        offset="50%"
                                        stopColor="#1d4ed8"
                                        stopOpacity="0.9"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#1e3a8a"
                                        stopOpacity="1"
                                    />
                                </linearGradient>
                            </defs>
                            <rect
                                width="1200"
                                height="800"
                                fill="url(#hero-gradient)"
                            />
                            <rect
                                width="1200"
                                height="800"
                                fill="url(#hero-pattern)"
                            />

                            {/* Floating geometric shapes */}
                            <g opacity="0.1">
                                <polygon
                                    points="100,150 150,100 200,150 150,200"
                                    fill="white"
                                />
                                <circle cx="300" cy="200" r="30" fill="white" />
                                <rect
                                    x="500"
                                    y="100"
                                    width="60"
                                    height="60"
                                    fill="white"
                                    transform="rotate(45 530 130)"
                                />
                                <polygon
                                    points="800,180 850,130 900,180 850,230"
                                    fill="white"
                                />
                                <circle
                                    cx="1000"
                                    cy="250"
                                    r="25"
                                    fill="white"
                                />
                                <rect
                                    x="200"
                                    y="400"
                                    width="50"
                                    height="50"
                                    fill="white"
                                    transform="rotate(30 225 425)"
                                />
                                <polygon
                                    points="400,450 450,400 500,450 450,500"
                                    fill="white"
                                />
                                <circle cx="700" cy="500" r="35" fill="white" />
                                <rect
                                    x="900"
                                    y="400"
                                    width="70"
                                    height="70"
                                    fill="white"
                                    transform="rotate(60 935 435)"
                                />
                                <polygon
                                    points="150,650 200,600 250,650 200,700"
                                    fill="white"
                                />
                                <circle cx="450" cy="700" r="20" fill="white" />
                                <rect
                                    x="650"
                                    y="600"
                                    width="40"
                                    height="40"
                                    fill="white"
                                    transform="rotate(45 670 620)"
                                />
                                <polygon
                                    points="950,650 1000,600 1050,650 1000,700"
                                    fill="white"
                                />
                            </g>

                            {/* Connection lines */}
                            <g
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                                fill="none"
                                opacity="0.3"
                            >
                                <line x1="100" y1="150" x2="300" y2="200" />
                                <line x1="300" y1="200" x2="500" y2="130" />
                                <line x1="500" y1="130" x2="800" y2="180" />
                                <line x1="800" y1="180" x2="1000" y2="250" />
                                <line x1="200" y1="425" x2="400" y2="450" />
                                <line x1="400" y1="450" x2="700" y2="500" />
                                <line x1="700" y1="500" x2="900" y2="435" />
                                <line x1="150" y1="650" x2="450" y2="700" />
                                <line x1="450" y1="700" x2="650" y2="620" />
                                <line x1="650" y1="620" x2="950" y2="650" />
                            </g>
                        </svg>
                    </div>
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
                                    className="border-2 border-white text-blue-800 hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
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
                <section
                    className="py-24 relative overflow-hidden"
                    style={{ backgroundColor: "#1e40af" }}
                >
                    {/* SVG Background Pattern */}
                    <div className="absolute inset-0">
                        <svg
                            className="w-full h-full object-cover"
                            viewBox="0 0 1200 600"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <defs>
                                <pattern
                                    id="cta-pattern"
                                    x="0"
                                    y="0"
                                    width="80"
                                    height="80"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="1.5"
                                        fill="rgba(255,255,255,0.08)"
                                    />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="0.8"
                                        fill="rgba(255,255,255,0.04)"
                                    />
                                    <circle
                                        cx="70"
                                        cy="20"
                                        r="1"
                                        fill="rgba(255,255,255,0.06)"
                                    />
                                    <circle
                                        cx="20"
                                        cy="70"
                                        r="0.8"
                                        fill="rgba(255,255,255,0.05)"
                                    />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="0.8"
                                        fill="rgba(255,255,255,0.03)"
                                    />
                                </pattern>
                                <linearGradient
                                    id="cta-gradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#2563eb"
                                        stopOpacity="0.9"
                                    />
                                    <stop
                                        offset="50%"
                                        stopColor="#1e40af"
                                        stopOpacity="1"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#1e3a8a"
                                        stopOpacity="1"
                                    />
                                </linearGradient>
                                <radialGradient
                                    id="cta-radial"
                                    cx="50%"
                                    cy="50%"
                                    r="50%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgba(59, 130, 246, 0.3)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgba(30, 64, 175, 0.8)"
                                    />
                                </radialGradient>
                            </defs>
                            <rect
                                width="1200"
                                height="600"
                                fill="url(#cta-gradient)"
                            />
                            <rect
                                width="1200"
                                height="600"
                                fill="url(#cta-pattern)"
                            />

                            {/* Wave-like shapes */}
                            <g opacity="0.15">
                                <path
                                    d="M0,200 Q300,150 600,200 T1200,200 L1200,300 Q900,250 600,300 T0,300 Z"
                                    fill="white"
                                />
                                <path
                                    d="M0,400 Q400,350 800,400 T1200,400 L1200,500 Q800,450 400,500 T0,500 Z"
                                    fill="white"
                                />
                            </g>

                            {/* Floating elements */}
                            <g opacity="0.1">
                                <circle cx="150" cy="100" r="20" fill="white" />
                                <rect
                                    x="300"
                                    y="80"
                                    width="30"
                                    height="30"
                                    fill="white"
                                    transform="rotate(45 315 95)"
                                />
                                <polygon
                                    points="500,90 530,60 560,90 530,120"
                                    fill="white"
                                />
                                <circle cx="750" cy="120" r="15" fill="white" />
                                <rect
                                    x="900"
                                    y="100"
                                    width="25"
                                    height="25"
                                    fill="white"
                                    transform="rotate(30 912.5 112.5)"
                                />

                                <circle cx="200" cy="300" r="18" fill="white" />
                                <rect
                                    x="400"
                                    y="280"
                                    width="35"
                                    height="35"
                                    fill="white"
                                    transform="rotate(60 417.5 297.5)"
                                />
                                <polygon
                                    points="650,290 680,260 710,290 680,320"
                                    fill="white"
                                />
                                <circle cx="850" cy="320" r="22" fill="white" />
                                <rect
                                    x="1000"
                                    y="300"
                                    width="28"
                                    height="28"
                                    fill="white"
                                    transform="rotate(45 1014 314)"
                                />

                                <circle cx="100" cy="500" r="16" fill="white" />
                                <rect
                                    x="350"
                                    y="480"
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="rotate(15 366 496)"
                                />
                                <polygon
                                    points="600,490 630,460 660,490 630,520"
                                    fill="white"
                                />
                                <circle cx="800" cy="520" r="19" fill="white" />
                                <rect
                                    x="950"
                                    y="500"
                                    width="26"
                                    height="26"
                                    fill="white"
                                    transform="rotate(60 963 513)"
                                />
                            </g>

                            {/* Connecting lines */}
                            <g
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="1"
                                fill="none"
                                opacity="0.4"
                            >
                                <path d="M150,100 Q300,200 500,90" />
                                <path d="M500,90 Q700,150 900,100" />
                                <path d="M200,300 Q400,250 650,290" />
                                <path d="M650,290 Q800,350 1000,300" />
                                <path d="M100,500 Q300,450 600,490" />
                                <path d="M600,490 Q750,550 950,500" />
                            </g>
                        </svg>
                    </div>
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
                                    className="border-2 border-white text-blue-800 hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
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

                <Footer />
            </main>
        </div>
    );
}
