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
            title: "Secure by Default",
            description:
                "Files are encrypted in transit and at rest. We use industry-standard TLS and AES-256 encryption - no fancy marketing speak, just solid security.",
        },
        {
            icon: Zap,
            title: "Fast Uploads",
            description:
                "Upload files up to 2GB on the free plan, 10GB on paid plans. Chunked uploads mean you won't lose progress if your connection drops.",
        },
        {
            icon: Globe,
            title: "Works Everywhere",
            description:
                "Access your files from any device with a web browser. No apps to install, no complicated setup - just upload and share.",
        },
        {
            icon: Users,
            title: "Team Sharing",
            description:
                "Share folders with your team, set permissions, and track who's accessed what. Perfect for small teams who need to stay organized.",
        },
        {
            icon: Lock,
            title: "Password Protection",
            description:
                "Add passwords to your shared links and set expiration dates. Control who sees your files and for how long.",
        },
        {
            icon: Cloud,
            title: "Reliable Storage",
            description:
                "Your files are stored on redundant servers with regular backups. We've got 99.9% uptime and 24/7 monitoring.",
        },
    ];

    const stats = [
        { number: "2GB", label: "Free storage per user" },
        { number: "50MB", label: "Max file size (free)" },
        { number: "99.9%", label: "Uptime guarantee" },
        { number: "24/7", label: "Support available" },
    ];

    const testimonials = [
        {
            name: "Alex Kim",
            role: "Freelance Designer",
            company: "Independent",
            content:
                "Finally, a file sharing tool that doesn't make me want to throw my laptop out the window. Simple, fast, and it just works. My clients love how easy it is to download their files.",
            rating: 5,
        },
        {
            name: "Maria Santos",
            role: "Marketing Manager",
            company: "Local Agency",
            content:
                "We were using Google Drive but the permissions were a nightmare. SwiftShare lets us share client assets without accidentally giving them access to everything. Game changer.",
            rating: 5,
        },
        {
            name: "David Park",
            role: "Small Business Owner",
            company: "Park & Associates",
            content:
                "I needed something simple for my accounting firm. No bells and whistles, just secure file sharing. SwiftShare does exactly what it says on the tin.",
            rating: 5,
        },
    ];

    const useCases = [
        {
            icon: FileText,
            title: "Client Deliverables",
            description:
                "Send finished work to clients without the back-and-forth of email attachments. They get a clean download link that works on any device.",
        },
        {
            icon: Download,
            title: "Large Files",
            description:
                "Photos, videos, and design files that are too big for email. Upload once, share the link, and let recipients download at their own pace.",
        },
        {
            icon: Users,
            title: "Team Projects",
            description:
                "Share project folders with your team. Everyone gets access to the same files without creating duplicate copies everywhere.",
        },
        {
            icon: Clock,
            title: "Temporary Sharing",
            description:
                "Share files that expire after a set time. Perfect for sensitive documents or files you only want available for a limited period.",
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

                    {/* Hero Illustration */}
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block opacity-20">
                        <svg
                            width="400"
                            height="300"
                            viewBox="0 0 400 300"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M50 50h300v200H50z"
                                fill="rgba(255,255,255,0.1)"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="20"
                                fill="rgba(255,255,255,0.3)"
                            />
                            <path
                                d="M120 100h60v20h-60z"
                                fill="rgba(255,255,255,0.3)"
                            />
                            <path
                                d="M120 130h80v20h-80z"
                                fill="rgba(255,255,255,0.3)"
                            />
                            <path
                                d="M120 160h100v20h-100z"
                                fill="rgba(255,255,255,0.3)"
                            />
                            <circle
                                cx="300"
                                cy="100"
                                r="15"
                                fill="rgba(255,255,255,0.2)"
                            />
                            <path
                                d="M285 100h30v30h-30z"
                                fill="rgba(255,255,255,0.2)"
                            />
                            <path
                                d="M200 200l50-50"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                            />
                            <path
                                d="M250 150l50-50"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>

                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                Used by teams at startups to Fortune 500s
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                            Share Files Without
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                the Headaches
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                            Stop wrestling with email attachments and clunky FTP
                            servers. SwiftShare handles the heavy lifting so you
                            can focus on what matters - getting your work done.
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
                            Free forever plan available • No setup required •
                            Works in your browser
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
                <section className="py-24 bg-gray-50 relative overflow-hidden">
                    {/* Background Illustration */}
                    <div className="absolute left-10 top-20 opacity-5 hidden lg:block">
                        <svg
                            width="300"
                            height="200"
                            viewBox="0 0 300 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="50" cy="50" r="30" fill="#3b82f6" />
                            <path d="M80 50h120v20H80z" fill="#3b82f6" />
                            <path d="M80 80h100v20H80z" fill="#3b82f6" />
                            <path d="M80 110h140v20H80z" fill="#3b82f6" />
                            <circle cx="250" cy="50" r="20" fill="#1d4ed8" />
                            <path d="M230 50h40v40h-40z" fill="#1d4ed8" />
                        </svg>
                    </div>

                    <div className="absolute right-10 bottom-20 opacity-5 hidden lg:block">
                        <svg
                            width="250"
                            height="180"
                            viewBox="0 0 250 180"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="20"
                                y="20"
                                width="60"
                                height="40"
                                fill="#3b82f6"
                                rx="5"
                            />
                            <rect
                                x="100"
                                y="20"
                                width="60"
                                height="40"
                                fill="#1d4ed8"
                                rx="5"
                            />
                            <rect
                                x="180"
                                y="20"
                                width="50"
                                height="40"
                                fill="#1e40af"
                                rx="5"
                            />
                            <path
                                d="M50 80l50-30l50 30l50-30"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                fill="none"
                            />
                            <circle cx="50" cy="120" r="15" fill="#3b82f6" />
                            <circle cx="125" cy="120" r="15" fill="#1d4ed8" />
                            <circle cx="200" cy="120" r="15" fill="#1e40af" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                                WHAT YOU GET
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Everything You Need
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                No overcomplicated features or enterprise bloat.
                                Just the tools you actually need to share files
                                securely and efficiently.
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
                <section className="py-24 bg-white relative overflow-hidden">
                    {/* Background Illustration */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-5 hidden lg:block">
                        <svg
                            width="400"
                            height="150"
                            viewBox="0 0 400 150"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="50"
                                y="30"
                                width="80"
                                height="60"
                                fill="#3b82f6"
                                rx="8"
                            />
                            <rect
                                x="150"
                                y="30"
                                width="80"
                                height="60"
                                fill="#1d4ed8"
                                rx="8"
                            />
                            <rect
                                x="250"
                                y="30"
                                width="80"
                                height="60"
                                fill="#1e40af"
                                rx="8"
                            />
                            <path
                                d="M90 100l20-20l20 20l20-20l20 20"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="90" cy="120" r="8" fill="#3b82f6" />
                            <circle cx="150" cy="120" r="8" fill="#1d4ed8" />
                            <circle cx="250" cy="120" r="8" fill="#1e40af" />
                            <circle cx="310" cy="120" r="8" fill="#3b82f6" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Real People, Real Use Cases
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Here's how people actually use SwiftShare in
                                their day-to-day work.
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
                <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
                    {/* Background Illustration */}
                    <div className="absolute bottom-10 right-10 opacity-5 hidden lg:block">
                        <svg
                            width="200"
                            height="150"
                            viewBox="0 0 200 150"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="50" cy="50" r="25" fill="#3b82f6" />
                            <circle cx="150" cy="50" r="25" fill="#1d4ed8" />
                            <path
                                d="M75 50h50"
                                stroke="#1e40af"
                                strokeWidth="3"
                            />
                            <path
                                d="M50 75v50"
                                stroke="#3b82f6"
                                strokeWidth="3"
                            />
                            <path
                                d="M150 75v50"
                                stroke="#1d4ed8"
                                strokeWidth="3"
                            />
                            <path
                                d="M50 125h100"
                                stroke="#1e40af"
                                strokeWidth="3"
                            />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                What People Are Saying
                            </h2>
                            <p className="text-xl text-gray-600">
                                Real feedback from real users who switched from
                                other file sharing tools.
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
                <section className="py-24 bg-white relative overflow-hidden">
                    {/* Background Illustration */}
                    <div className="absolute top-20 left-10 opacity-5 hidden lg:block">
                        <svg
                            width="300"
                            height="200"
                            viewBox="0 0 300 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="20"
                                y="40"
                                width="60"
                                height="40"
                                fill="#3b82f6"
                                rx="5"
                            />
                            <rect
                                x="100"
                                y="40"
                                width="60"
                                height="40"
                                fill="#1d4ed8"
                                rx="5"
                            />
                            <rect
                                x="180"
                                y="40"
                                width="60"
                                height="40"
                                fill="#1e40af"
                                rx="5"
                            />
                            <path
                                d="M50 100l30-20l30 20l30-20"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="50" cy="140" r="10" fill="#3b82f6" />
                            <circle cx="130" cy="140" r="10" fill="#1d4ed8" />
                            <circle cx="210" cy="140" r="10" fill="#1e40af" />
                            <path
                                d="M50 160l80 0"
                                stroke="#3b82f6"
                                strokeWidth="2"
                            />
                            <path
                                d="M130 160l80 0"
                                stroke="#1d4ed8"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Three Simple Steps
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                No complicated setup, no learning curve. Just
                                upload, share, and you're done.
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
                                    Upload Your Files
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Drag and drop files or click to browse.
                                    Works with any file type up to 2GB on the
                                    free plan, 10GB on paid plans.
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
                                    Get Your Link
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Copy the sharing link and send it to anyone.
                                    Add passwords, set expiration dates, or
                                    limit downloads - it's up to you.
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
                                    They Download
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Recipients click the link and download your
                                    files. No accounts needed, no software to
                                    install - just works.
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
                            Ready to Stop Fighting With File Sharing?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Stop wrestling with email attachments and clunky
                            file sharing tools. Get started with SwiftShare and
                            see what simple file sharing actually looks like.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    Get Started Free
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
                                Free forever plan
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Works in any browser
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
