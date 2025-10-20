"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Search,
    BookOpen,
    MessageSquare,
    Video,
    Download,
    Settings,
    Shield,
    Upload,
    Share,
    Users,
    HelpCircle,
    Zap,
    ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        {
            icon: Upload,
            title: "Getting Started",
            description: "Learn the basics of using SwiftShare",
            articles: 12,
            color: "from-blue-500 to-blue-600",
        },
        {
            icon: Share,
            title: "File Sharing",
            description: "How to share files securely",
            articles: 15,
            color: "from-green-500 to-green-600",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Working with teams and permissions",
            articles: 10,
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: Shield,
            title: "Security & Privacy",
            description: "Keeping your files safe",
            articles: 8,
            color: "from-red-500 to-red-600",
        },
        {
            icon: Settings,
            title: "Account Settings",
            description: "Managing your account",
            articles: 14,
            color: "from-orange-500 to-orange-600",
        },
        {
            icon: Zap,
            title: "Advanced Features",
            description: "Power user tips and tricks",
            articles: 9,
            color: "from-indigo-500 to-indigo-600",
        },
    ];

    const popularArticles = [
        {
            title: "How to upload files to SwiftShare",
            category: "Getting Started",
            views: "15.2k",
            readTime: "3 min",
        },
        {
            title: "Creating secure sharing links",
            category: "File Sharing",
            views: "12.8k",
            readTime: "5 min",
        },
        {
            title: "Setting up team workspaces",
            category: "Team Collaboration",
            views: "9.1k",
            readTime: "7 min",
        },
        {
            title: "Understanding file permissions",
            category: "Security & Privacy",
            views: "8.3k",
            readTime: "4 min",
        },
        {
            title: "Managing storage and billing",
            category: "Account Settings",
            views: "7.5k",
            readTime: "6 min",
        },
    ];

    const quickActions = [
        {
            icon: MessageSquare,
            title: "Contact Support",
            description: "Get help from our support team",
            action: "Start Chat",
        },
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Watch step-by-step guides",
            action: "Watch Now",
        },
        {
            icon: Download,
            title: "Download Guides",
            description: "PDF guides and documentation",
            action: "Download",
        },
        {
            icon: BookOpen,
            title: "API Documentation",
            description: "Technical documentation for developers",
            action: "View Docs",
        },
    ];

    const faqs = [
        {
            question: "How do I upload large files?",
            answer: "SwiftShare supports files up to 10GB. For best results, use our desktop app or web uploader with resume capability.",
        },
        {
            question: "Are my files encrypted?",
            answer: "Yes, all files are encrypted with AES-256 encryption both in transit and at rest. We use zero-knowledge encryption for maximum security.",
        },
        {
            question: "How long are files stored?",
            answer: "File retention depends on your plan. Free users get 7 days, Professional users get 30 days, and Business users get 90 days.",
        },
        {
            question: "Can I collaborate with external users?",
            answer: "Yes, you can share files with anyone via secure links, even if they don't have a SwiftShare account.",
        },
        {
            question: "How do I upgrade my plan?",
            answer: "You can upgrade your plan anytime from your account settings. Changes take effect immediately with prorated billing.",
        },
        {
            question: "Is there a mobile app?",
            answer: "Yes, we have native iOS and Android apps available on the App Store and Google Play Store.",
        },
    ];

    const filteredCategories = categories.filter(
        (category) =>
            searchQuery === "" ||
            category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            How Can We
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Help You?
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Find answers, tutorials, and resources to get the
                            most out of SwiftShare.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for help articles, guides, and tutorials..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-12 py-4 text-lg bg-white text-gray-900 border-0"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <action.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {action.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            {action.action}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Help Categories */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Browse by Category
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Find help articles organized by topic and
                                feature area.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCategories.map((category, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                >
                                    <CardContent className="p-8">
                                        <div
                                            className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6`}
                                        >
                                            <category.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {category.articles} articles
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Articles */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Popular Articles
                            </h2>
                            <p className="text-xl text-gray-600">
                                The most helpful articles based on user
                                feedback.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-4">
                                {popularArticles.map((article, index) => (
                                    <Card
                                        key={index}
                                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                            {article.category}
                                                        </span>
                                                        <span>
                                                            {article.views}{" "}
                                                            views
                                                        </span>
                                                        <span>
                                                            {article.readTime}{" "}
                                                            read
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600">
                                Quick answers to common questions about
                                SwiftShare.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex items-start">
                                            <HelpCircle className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Support CTA */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Still Need Help?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Can't find what you're looking for? Our support team
                            is here to help you 24/7.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                                Contact Support
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
