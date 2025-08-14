"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Zap,
    Globe,
    Users,
    Lock,
    Cloud,
    CheckCircle,
    FileText,
    Download,
    Clock,
    Settings,
    BarChart,
    Smartphone,
    Key,
    Database,
    Headphones,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function FeaturesPage() {
    const coreFeatures = [
        {
            icon: Shield,
            title: "Enterprise Security",
            description:
                "Military-grade AES-256 encryption, SOC 2 compliance, and zero-knowledge architecture ensure your files are completely secure.",
            features: [
                "End-to-end encryption",
                "SOC 2 Type II certified",
                "Zero-knowledge privacy",
                "SSL/TLS protection",
            ],
        },
        {
            icon: Zap,
            title: "Lightning Performance",
            description:
                "Experience blazing-fast uploads and downloads with our global CDN and intelligent compression technology.",
            features: [
                "Global CDN network",
                "Smart compression",
                "Resume interrupted uploads",
                "Parallel processing",
            ],
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description:
                "Advanced collaboration tools with real-time updates, comments, version control, and granular permissions.",
            features: [
                "Real-time collaboration",
                "Version history",
                "Team workspaces",
                "Permission management",
            ],
        },
        {
            icon: Globe,
            title: "Global Access",
            description:
                "Access your files from anywhere in the world with 99.99% uptime and lightning-fast global delivery.",
            features: [
                "50+ global locations",
                "99.99% uptime SLA",
                "Mobile apps",
                "Offline access",
            ],
        },
        {
            icon: Lock,
            title: "Advanced Privacy",
            description:
                "Complete privacy control with password protection, expiration dates, and detailed access logs.",
            features: [
                "Password protection",
                "Link expiration",
                "Download limits",
                "Access analytics",
            ],
        },
        {
            icon: Cloud,
            title: "Smart Storage",
            description:
                "Intelligent file management with automatic backups, duplicate detection, and unlimited version history.",
            features: [
                "Automatic backups",
                "Duplicate detection",
                "Version control",
                "Smart organization",
            ],
        },
    ];

    const advancedFeatures = [
        {
            icon: FileText,
            title: "Document Preview",
            description:
                "Preview over 100 file types directly in your browser without downloading.",
        },
        {
            icon: Download,
            title: "Bulk Operations",
            description:
                "Upload, download, and manage thousands of files with bulk operations.",
        },
        {
            icon: Clock,
            title: "Scheduled Sharing",
            description:
                "Schedule file sharing for future dates and set automatic expiration.",
        },
        {
            icon: Settings,
            title: "API Integration",
            description:
                "Powerful REST API for seamless integration with your existing workflows.",
        },
        {
            icon: BarChart,
            title: "Advanced Analytics",
            description:
                "Detailed insights into file usage, sharing patterns, and team activity.",
        },
        {
            icon: Smartphone,
            title: "Mobile Apps",
            description:
                "Native iOS and Android apps with full feature parity and offline access.",
        },
        {
            icon: Key,
            title: "SSO Integration",
            description:
                "Single sign-on with popular identity providers like Google, Microsoft, and SAML.",
        },
        {
            icon: Database,
            title: "Compliance Ready",
            description:
                "GDPR, HIPAA, and industry-specific compliance features built-in.",
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description:
                "Round-the-clock expert support with guaranteed response times.",
        },
    ];

    const securityFeatures = [
        "AES-256 encryption at rest and in transit",
        "Zero-knowledge encryption architecture",
        "Two-factor authentication (2FA)",
        "SOC 2 Type II compliance",
        "GDPR and HIPAA compliance",
        "Regular security audits and penetration testing",
        "Data residency controls",
        "Advanced threat detection",
    ];

    const performanceFeatures = [
        "Global CDN with 50+ edge locations",
        "Smart compression algorithms",
        "Parallel upload/download processing",
        "Resume interrupted transfers",
        "Intelligent bandwidth optimization",
        "Real-time sync across devices",
        "99.99% uptime SLA",
        "Sub-second file access globally",
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Powerful Features for
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Modern Teams
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Discover all the advanced features that make
                            SwiftShare the preferred choice for enterprise file
                            sharing and collaboration.
                        </p>
                    </div>
                </section>

                {/* Core Features */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Core Features
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Essential features designed to meet the needs of
                                modern businesses.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coreFeatures.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                >
                                    <CardContent className="p-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                            <feature.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {feature.features.map(
                                                (item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center text-sm text-gray-700"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Advanced Features */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Advanced Capabilities
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Additional features that set SwiftShare apart
                                from the competition.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {advancedFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Security & Performance */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Security */}
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Enterprise Security
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Your data security is our top priority. We
                                    employ multiple layers of protection to
                                    ensure your files remain private and secure.
                                </p>
                                <div className="space-y-3">
                                    {securityFeatures.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance */}
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Global Performance
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Experience lightning-fast file sharing with
                                    our global infrastructure and advanced
                                    optimization technologies.
                                </p>
                                <div className="space-y-3">
                                    {performanceFeatures.map(
                                        (feature, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">
                                                    {feature}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Experience All Features?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Start your free trial today and discover how
                            SwiftShare can transform your file sharing workflow.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/signup"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="/contact"
                                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
