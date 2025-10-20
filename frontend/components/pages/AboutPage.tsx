"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Target,
    Award,
    Globe,
    Heart,
    Shield,
    Star,
    Lightbulb,
    TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: "Security First",
            description:
                "We believe privacy and security are fundamental rights. Every decision we make prioritizes the protection of your data.",
        },
        {
            icon: Heart,
            title: "User-Centric",
            description:
                "Our users are at the heart of everything we do. We listen, learn, and build features that truly matter to you.",
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description:
                "We constantly push the boundaries of what's possible in file sharing, bringing you cutting-edge solutions.",
        },
        {
            icon: Globe,
            title: "Global Impact",
            description:
                "We're building a platform that connects people worldwide, breaking down barriers to collaboration.",
        },
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Chief Executive Officer",
            bio: "Former VP of Engineering at Dropbox with 15+ years in cloud storage and security.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400&h=400&fit=crop&crop=face",
        },
        {
            name: "Michael Chen",
            role: "Chief Technology Officer",
            bio: "Ex-Google engineer specializing in distributed systems and encryption technologies.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Security",
            bio: "Cybersecurity expert with experience at Amazon and Microsoft, specializing in enterprise security.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        },
        {
            name: "David Kim",
            role: "Head of Product",
            bio: "Product leader with a passion for user experience, previously at Slack and Zoom.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        },
    ];

    const milestones = [
        {
            year: "2020",
            title: "Company Founded",
            description:
                "SwiftShare was founded with a mission to make file sharing secure and simple for everyone.",
        },
        {
            year: "2021",
            title: "First Million Users",
            description:
                "Reached our first million users and launched enterprise features.",
        },
        {
            year: "2022",
            title: "Global Expansion",
            description:
                "Expanded to serve customers in over 50 countries with localized data centers.",
        },
        {
            year: "2023",
            title: "SOC 2 Certification",
            description:
                "Achieved SOC 2 Type II certification and launched advanced collaboration features.",
        },
        {
            year: "2024",
            title: "100M+ Files Shared",
            description:
                "Surpassed 100 million files shared securely across our platform.",
        },
    ];

    const stats = [
        { number: "100K+", label: "Active Users", icon: Users },
        { number: "150+", label: "Countries Served", icon: Globe },
        { number: "99.99%", label: "Uptime", icon: TrendingUp },
        { number: "25M+", label: "Files Shared", icon: Star },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Building the Future of
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                File Sharing
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            We're on a mission to make secure file sharing
                            accessible to everyone, from individual creators to
                            global enterprises.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div>
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    To democratize secure file sharing by
                                    providing enterprise-grade security and
                                    performance in an intuitive, accessible
                                    platform. We believe that everyone deserves
                                    the right to share files securely,
                                    regardless of their technical expertise.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Our mission drives us to continuously
                                    innovate, ensuring that privacy and security
                                    remain at the forefront of everything we
                                    build.
                                </p>
                            </div>

                            <div>
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Award className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Our Vision
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    To create a world where collaboration knows
                                    no boundaries. We envision a future where
                                    teams can work together seamlessly, securely
                                    sharing ideas and files regardless of
                                    location, device, or technical constraints.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    We're building the infrastructure that will
                                    power the next generation of remote work and
                                    global collaboration.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Values
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                The principles that guide every decision we make
                                and every feature we build.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <value.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
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

                {/* Timeline */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Journey
                            </h2>
                            <p className="text-xl text-gray-600">
                                Key milestones in our mission to transform file
                                sharing.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-24 text-right mr-8">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {milestone.year}
                                        </span>
                                    </div>
                                    <div className="flex-grow bg-white p-6 rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Meet Our Team
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                The passionate individuals building the future
                                of secure file sharing.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-600 font-medium mb-3">
                                            {member.role}
                                        </p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Join Our Mission
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Be part of the future of secure file sharing. Start
                            using SwiftShare today and experience the
                            difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Start Free Trial
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                                View Careers
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
