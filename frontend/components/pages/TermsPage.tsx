"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    FileText,
    Shield,
    Users,
    AlertTriangle,
    CreditCard,
    Scale,
    Globe,
    Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function TermsPage() {
    const sections = [
        {
            id: "acceptance",
            title: "Acceptance of Terms",
            icon: FileText,
            content: [
                "By accessing SwiftShare, you agree to be bound by these terms",
                "These terms constitute a legal agreement between you and SwiftShare",
                "If you do not agree to these terms, please do not use our service",
                "Continued use of the service indicates acceptance of any updates",
            ],
        },
        {
            id: "service-description",
            title: "Service Description",
            icon: Zap,
            content: [
                "SwiftShare provides secure file sharing and collaboration services",
                "We offer various plans with different storage and feature limits",
                "Service availability may vary by geographic location",
                "We may modify or discontinue features with reasonable notice",
                "Beta features are provided as-is without warranties",
            ],
        },
        {
            id: "user-accounts",
            title: "User Accounts",
            icon: Users,
            content: [
                "You must be at least 13 years old to create an account",
                "You are responsible for maintaining account security",
                "One person may not maintain multiple free accounts",
                "You must provide accurate and current information",
                "We reserve the right to suspend accounts for violations",
            ],
        },
        {
            id: "acceptable-use",
            title: "Acceptable Use Policy",
            icon: Shield,
            content: [
                "Do not upload illegal, harmful, or copyrighted content without permission",
                "Do not use the service to spam, phish, or distribute malware",
                "Do not attempt to access other users' files without authorization",
                "Do not reverse engineer or attempt to hack our systems",
                "Commercial use requires an appropriate business plan",
            ],
        },
        {
            id: "billing-payments",
            title: "Billing & Payments",
            icon: CreditCard,
            content: [
                "Paid plans are billed in advance on a monthly or annual basis",
                "All fees are non-refundable except as required by law",
                "We may change pricing with 30 days advance notice",
                "Failed payments may result in service suspension",
                "Taxes are additional and based on your billing address",
            ],
        },
        {
            id: "data-content",
            title: "Your Data & Content",
            icon: FileText,
            content: [
                "You retain ownership of all files and content you upload",
                "You grant us permission to store and process your content",
                "We do not claim ownership of your intellectual property",
                "You are responsible for backing up important data",
                "We may remove content that violates these terms",
            ],
        },
    ];

    const prohibitedContent = [
        "Copyrighted material without proper authorization",
        "Malware, viruses, or other harmful software",
        "Content that violates privacy or publicity rights",
        "Illegal pornography or child exploitation material",
        "Content that promotes violence or terrorism",
        "Spam, phishing, or fraudulent material",
        "Personal information of others without consent",
        "Content that infringes on trademark rights",
    ];

    const limitations = [
        "We provide the service 'as-is' without warranties",
        "We are not liable for data loss or service interruptions",
        "Our liability is limited to the amount you paid in the last 12 months",
        "We are not responsible for user-generated content",
        "Force majeure events may affect service availability",
        "Some jurisdictions may not allow limitation of liability",
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Terms of Service
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Clear & Fair Terms
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            These terms govern your use of SwiftShare. We've
                            written them in plain language to be as clear as
                            possible.
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
                                Welcome to SwiftShare
                            </h2>
                            <p className="text-blue-800 leading-relaxed">
                                These Terms of Service ("Terms") govern your
                                access to and use of SwiftShare's file sharing
                                platform and services. By using SwiftShare, you
                                agree to these terms. We've made them as
                                straightforward as possible while ensuring they
                                protect both you and us.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Terms Sections */}
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

                {/* Prohibited Content */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Prohibited Content
                            </h2>
                            <p className="text-xl text-gray-600">
                                The following types of content are not permitted
                                on SwiftShare.
                            </p>
                        </div>

                        <Card className="border-0 shadow-lg border-l-4 border-red-500">
                            <CardContent className="p-8">
                                <div className="flex items-center mb-6">
                                    <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Strictly Prohibited
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {prohibitedContent.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-gray-700">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-800 text-sm">
                                        <strong>Note:</strong> Uploading
                                        prohibited content may result in
                                        immediate account suspension and
                                        potential legal action. When in doubt,
                                        please contact our support team.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Service Levels */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Service Levels & Availability
                        </h2>

                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Uptime Commitment
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        We strive to maintain 99.9% uptime for
                                        our services. However, planned
                                        maintenance, security updates, and
                                        unforeseen circumstances may
                                        occasionally affect availability.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-blue-800 text-sm">
                                            Enterprise customers receive
                                            priority support and advance notice
                                            of planned maintenance.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Data Backup & Recovery
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        We maintain regular backups of your data
                                        across multiple geographic locations.
                                        However, you are responsible for
                                        maintaining your own backups of critical
                                        data.
                                    </p>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Important:</strong> We
                                            recommend keeping local copies of
                                            important files as an additional
                                            safety measure.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Limitations & Liability */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Limitations of Liability
                            </h2>
                            <p className="text-xl text-gray-600">
                                Important limitations on our liability and
                                responsibilities.
                            </p>
                        </div>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                <div className="flex items-center mb-6">
                                    <Scale className="w-8 h-8 text-blue-600 mr-3" />
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Legal Limitations
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {limitations.map((limitation, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-gray-700">
                                                {limitation}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Termination */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Account Termination
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        You may terminate your account at any
                                        time through your account settings. Upon
                                        termination, your data will be deleted
                                        according to our retention policy.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        <strong>Data Export:</strong> You can
                                        export your data before termination.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Service Suspension
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        We may suspend or terminate accounts
                                        that violate these terms, engage in
                                        abusive behavior, or pose security risks
                                        to our platform or other users.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        <strong>Appeal Process:</strong> You can
                                        appeal suspension decisions through
                                        support.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Governing Law & Contact */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <Globe className="w-12 h-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Governing Law
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        These terms are governed by the laws of
                                        the State of California, United States.
                                        Any disputes will be resolved in
                                        California courts.
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        For EU users, applicable consumer
                                        protection laws take precedence.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <FileText className="w-12 h-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Questions & Updates
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        If you have questions about these terms,
                                        please contact our legal team. We'll
                                        notify you of any material changes to
                                        these terms.
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        Email: legal@swiftshare.com
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
                            Questions About These Terms?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Our legal team is available to clarify any aspects
                            of these terms of service.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Contact Legal Team
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Download PDF Version
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
