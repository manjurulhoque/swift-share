"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileText } from "lucide-react";

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Main 404 Illustration */}
                <div className="mb-8">
                    <svg
                        width="400"
                        height="300"
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto"
                    >
                        {/* Background elements */}
                        <circle
                            cx="80"
                            cy="60"
                            r="3"
                            fill="#3b82f6"
                            opacity="0.3"
                        />
                        <circle
                            cx="320"
                            cy="80"
                            r="2"
                            fill="#8b5cf6"
                            opacity="0.3"
                        />
                        <circle
                            cx="350"
                            cy="200"
                            r="2.5"
                            fill="#06b6d4"
                            opacity="0.3"
                        />
                        <circle
                            cx="50"
                            cy="250"
                            r="2"
                            fill="#10b981"
                            opacity="0.3"
                        />

                        {/* Cloud shapes */}
                        <path
                            d="M60 40c0-8 6-14 14-14s14 6 14 14c4 0 7 3 7 7s-3 7-7 7H60c-4 0-7-3-7-7s3-7 7-7z"
                            fill="#e0f2fe"
                        />
                        <path
                            d="M300 120c0-6 5-11 11-11s11 5 11 11c3 0 6 3 6 6s-3 6-6 6h-22c-3 0-6-3-6-6s3-6 6-6z"
                            fill="#f0f9ff"
                        />

                        {/* Lost file illustration */}
                        <rect
                            x="150"
                            y="100"
                            width="100"
                            height="80"
                            rx="8"
                            fill="#f8fafc"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                        />
                        <rect
                            x="160"
                            y="110"
                            width="80"
                            height="8"
                            rx="4"
                            fill="#cbd5e1"
                        />
                        <rect
                            x="160"
                            y="125"
                            width="60"
                            height="6"
                            rx="3"
                            fill="#cbd5e1"
                        />
                        <rect
                            x="160"
                            y="138"
                            width="70"
                            height="6"
                            rx="3"
                            fill="#cbd5e1"
                        />
                        <rect
                            x="160"
                            y="151"
                            width="50"
                            height="6"
                            rx="3"
                            fill="#cbd5e1"
                        />

                        {/* Question mark */}
                        <circle
                            cx="200"
                            cy="200"
                            r="25"
                            fill="#fef3c7"
                            stroke="#f59e0b"
                            strokeWidth="3"
                        />
                        <text
                            x="200"
                            y="210"
                            textAnchor="middle"
                            fontSize="24"
                            fontWeight="bold"
                            fill="#92400e"
                        >
                            ?
                        </text>

                        {/* Confused face */}
                        <circle cx="200" cy="120" r="8" fill="#374151" />
                        <path
                            d="M190 130 Q200 140 210 130"
                            stroke="#374151"
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Search magnifying glass */}
                        <circle
                            cx="280"
                            cy="180"
                            r="15"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="3"
                        />
                        <path
                            d="M290 190l10 10"
                            stroke="#6b7280"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Floating elements */}
                        <circle
                            cx="100"
                            cy="150"
                            r="4"
                            fill="#3b82f6"
                            opacity="0.6"
                        />
                        <rect
                            x="95"
                            y="145"
                            width="8"
                            height="8"
                            rx="2"
                            fill="#8b5cf6"
                            opacity="0.6"
                        />
                        <polygon
                            points="300,50 305,60 295,60"
                            fill="#10b981"
                            opacity="0.6"
                        />

                        {/* Connection lines */}
                        <path
                            d="M200 100 Q250 80 280 120"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.5"
                        />
                        <path
                            d="M200 200 Q150 180 100 150"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.5"
                        />
                    </svg>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Looks like this page got lost in the digital void! Don't
                        worry, even the best files sometimes go missing. Let's
                        help you find your way back.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Home className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Go Home
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Return to the main dashboard
                            </p>
                            <Link href="/dashboard">
                                <Button className="w-full">
                                    <Home className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowLeft className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Go Back
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Return to the previous page
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Search Files
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Find what you're looking for
                            </p>
                            <Link href="/dashboard/files">
                                <Button variant="outline" className="w-full">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Help */}
                <div className="text-center">
                    <p className="text-gray-500 mb-4">
                        Still can't find what you're looking for?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/help">
                            <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Help Center
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Fun Footer */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-400">
                        💡 Pro tip: Use the search bar in the top navigation to
                        find files quickly!
                    </p>
                </div>
            </div>
        </div>
    );
}
