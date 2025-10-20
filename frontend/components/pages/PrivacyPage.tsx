"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Eye,
    Lock,
    Database,
    Globe,
    Users,
    FileText,
    Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
    const sections = [
        {
            id: "information-collection",
            title: "Information We Collect",
            icon: Database,
            content: [
                "Account information (name, email, password)",
                "File metadata (names, sizes, types, upload dates)",
                "Usage data (features used, session duration)",
                "Device information (browser type, operating system)",
                "IP addresses and location data (for security purposes)",
            ],
        },
        {
            id: "information-use",
            title: "How We Use Your Information",
            icon: Eye,
            content: [
                "Provide and maintain our file sharing services",
                "Process uploads, downloads, and sharing requests",
                "Send important service notifications",
                "Improve our platform based on usage patterns",
                "Ensure security and prevent unauthorized access",
                "Comply with legal obligations",
            ],
        },
        {
            id: "information-sharing",
            title: "Information Sharing",
            icon: Users,
            content: [
                "We never sell your personal information to third parties",
                "Files are only shared with users you explicitly grant access to",
                "We may share aggregated, anonymized data for research",
                "Legal compliance may require disclosure to authorities",
                "Service providers may access data to provide technical support",
            ],
        },
        {
            id: "data-security",
            title: "Data Security",
            icon: Shield,
            content: [
                "All files encrypted with AES-256 encryption",
                "Zero-knowledge encryption architecture",
                "Secure data centers with 24/7 monitoring",
                "Regular security audits and penetration testing",
                "Two-factor authentication available",
                "Automatic logout after inactivity periods",
            ],
        },
        {
            id: "data-retention",
            title: "Data Retention",
            icon: Clock,
            content: [
                "Files are retained according to your plan's retention policy",
                "Account data is kept while your account is active",
                "Deleted files are permanently removed within 30 days",
                "You can request account deletion at any time",
                "Some data may be retained for legal compliance",
            ],
        },
        {
            id: "international-transfers",
            title: "International Data Transfers",
            icon: Globe,
            content: [
                "Data may be processed in countries where we operate",
                "We ensure adequate protection through legal safeguards",
                "EU users' data is processed under GDPR requirements",
                "You can choose your preferred data storage region",
                "Cross-border transfers are encrypted and monitored",
            ],
        },
    ];

    const rights = [
        "Access your personal data and file metadata",
        "Correct inaccurate or incomplete information",
        "Delete your account and associated data",
        "Export your data in a portable format",
        "Restrict processing of your information",
        "Object to certain types of data processing",
        "Withdraw consent for data processing",
        "File complaints with data protection authorities",
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Privacy Policy
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Your Privacy Matters
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            We're committed to protecting your privacy and being
                            transparent about how we handle your data.
                        </p>
                        <div className="text-blue-200">
                            Last updated: January 15, 2024
                        </div>
                    </div>
                </section>

                {/* Overview */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                            <h2 className="text-xl font-bold text-blue-900 mb-3">
                                Privacy at SwiftShare
                            </h2>
                            <p className="text-blue-800 leading-relaxed">
                                At SwiftShare, we believe privacy is a
                                fundamental right. This policy explains how we
                                collect, use, and protect your information when
                                you use our file sharing platform. We're
                                committed to transparency and giving you control
                                over your data.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Privacy Sections */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {sections.map((section, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                                <section.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {section.content.map(
                                                (item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start"
                                                    >
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                        <span className="text-gray-700 leading-relaxed">
                                                            {item}
                                                        </span>
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

                {/* Your Rights */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Your Privacy Rights
                            </h2>
                            <p className="text-xl text-gray-600">
                                You have comprehensive rights regarding your
                                personal data and how we use it.
                            </p>
                        </div>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {rights.map((right, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <Lock className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {right}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Cookies & Tracking */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Cookies & Tracking Technologies
                        </h2>

                        <div className="space-y-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Essential Cookies
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        These cookies are necessary for the
                                        platform to function properly. They
                                        enable core features like
                                        authentication, file uploads, and
                                        security protections.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        These cookies cannot be disabled as they
                                        are essential for the service.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Analytics Cookies
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        We use analytics cookies to understand
                                        how users interact with our platform.
                                        This helps us improve the user
                                        experience and identify areas for
                                        enhancement.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        You can opt out of analytics cookies in
                                        your account settings.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Marketing Cookies
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        These cookies are used to show you
                                        relevant advertisements and measure the
                                        effectiveness of our marketing
                                        campaigns. They are only set with your
                                        consent.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        You can manage your marketing cookie
                                        preferences at any time.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Children's Privacy */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="border-0 shadow-lg bg-yellow-50 border-yellow-200">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Children's Privacy
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    SwiftShare is not intended for use by
                                    children under 13 years of age. We do not
                                    knowingly collect personal information from
                                    children under 13. If we become aware that a
                                    child under 13 has provided us with personal
                                    information, we will take steps to delete
                                    such information.
                                </p>
                                <p className="text-gray-700">
                                    If you are a parent or guardian and you
                                    believe your child has provided us with
                                    personal information, please contact us
                                    immediately so we can take appropriate
                                    action.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Updates & Contact */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <FileText className="w-12 h-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Policy Updates
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        We may update this privacy policy from
                                        time to time. We will notify you of any
                                        material changes by email or through our
                                        platform.
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Continued use after changes constitutes
                                        acceptance of the updated policy.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <Users className="w-12 h-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Contact Us
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        If you have questions about this privacy
                                        policy or how we handle your data,
                                        please don't hesitate to contact us.
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>Email: privacy@swiftshare.com</div>
                                        <div>
                                            Address: 123 Privacy St, Security
                                            City, CA 90210
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Questions About Privacy?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Our privacy team is here to help. Contact us with
                            any questions about your data or privacy rights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Contact Privacy Team
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Manage Privacy Settings
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
