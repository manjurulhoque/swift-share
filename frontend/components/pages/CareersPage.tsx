"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Clock,
    Users,
    Heart,
    TrendingUp,
    Globe,
    Zap,
    Star,
    Building,
    Coffee,
    Shield,
    Lightbulb,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function CareersPage() {
    const openPositions = [
        {
            title: "Senior Software Engineer",
            department: "Engineering",
            location: "San Francisco, CA / Remote",
            type: "Full-time",
            description:
                "Build scalable backend systems and APIs for our file sharing platform.",
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "London, UK / Remote",
            type: "Full-time",
            description:
                "Design intuitive user experiences for our web and mobile applications.",
        },
        {
            title: "DevOps Engineer",
            department: "Infrastructure",
            location: "Singapore / Remote",
            type: "Full-time",
            description:
                "Manage and scale our global cloud infrastructure and deployment pipelines.",
        },
        {
            title: "Customer Success Manager",
            department: "Customer Success",
            location: "Remote",
            type: "Full-time",
            description:
                "Help enterprise customers maximize value from our platform.",
        },
        {
            title: "Security Engineer",
            department: "Security",
            location: "San Francisco, CA",
            type: "Full-time",
            description:
                "Enhance our security posture and implement new security features.",
        },
        {
            title: "Marketing Manager",
            department: "Marketing",
            location: "Remote",
            type: "Full-time",
            description:
                "Drive growth through digital marketing campaigns and content strategy.",
        },
    ];

    const benefits = [
        {
            icon: Heart,
            title: "Health & Wellness",
            description:
                "Comprehensive health insurance, dental, vision, and mental health support",
        },
        {
            icon: TrendingUp,
            title: "Career Growth",
            description:
                "Professional development budget, conferences, and internal mobility opportunities",
        },
        {
            icon: Globe,
            title: "Remote-First",
            description:
                "Work from anywhere with flexible hours and quarterly team meetups",
        },
        {
            icon: Coffee,
            title: "Work-Life Balance",
            description:
                "Unlimited PTO, sabbatical program, and family leave policies",
        },
        {
            icon: Star,
            title: "Equity & Compensation",
            description:
                "Competitive salaries with equity participation in company success",
        },
        {
            icon: Lightbulb,
            title: "Innovation Time",
            description:
                "20% time for personal projects and innovation initiatives",
        },
    ];

    const values = [
        {
            icon: Shield,
            title: "Security First",
            description:
                "We prioritize security and privacy in everything we build.",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "We believe diverse teams build better products.",
        },
        {
            icon: Zap,
            title: "Innovation",
            description:
                "We're always pushing the boundaries of what's possible.",
        },
        {
            icon: Globe,
            title: "Global Impact",
            description: "We're building solutions that connect the world.",
        },
    ];

    const departments = [
        { name: "Engineering", count: 15, icon: Building },
        { name: "Product & Design", count: 8, icon: Lightbulb },
        { name: "Sales & Marketing", count: 12, icon: TrendingUp },
        { name: "Customer Success", count: 6, icon: Heart },
        { name: "Operations", count: 5, icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Build the Future
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                with SwiftShare
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Join our mission to revolutionize secure file
                            sharing. We're looking for passionate individuals
                            who want to make a global impact.
                        </p>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                            View Open Positions
                        </Button>
                    </div>
                </section>

                {/* Why Work Here */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Work at SwiftShare?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We're building something incredible, and we want
                                you to be part of it.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {values.map((value, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Team Stats */}
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                Our Growing Team
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {departments.map((dept, index) => (
                                    <div key={index} className="text-center">
                                        <dept.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {dept.count}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {dept.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Benefits & Perks
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We believe in taking care of our team so they
                                can do their best work.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white"
                                >
                                    <CardContent className="p-8">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                                            <benefit.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Open Positions
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Find your next opportunity to make a meaningful
                                impact.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {openPositions.map((position, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-grow">
                                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {position.title}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                        {position.department}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {position.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {position.location}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {position.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 lg:mt-0 lg:ml-8">
                                                <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
                                                    Apply Now
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-gray-600 mb-4">
                                Don't see a role that fits? We're always looking
                                for exceptional talent.
                            </p>
                            <Button
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                                Send Us Your Resume
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Application Process */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Hiring Process
                            </h2>
                            <p className="text-xl text-gray-600">
                                We've designed our process to be transparent and
                                efficient.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                                    1
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Application
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Submit your application and resume
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                                    2
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Phone Screen
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Initial conversation with our team
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                                    3
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Interviews
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Technical and cultural fit assessment
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                                    4
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Offer
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Join the SwiftShare team!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Join Our Mission?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Help us build the future of secure file sharing.
                            Apply today and become part of our growing team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                                Browse All Positions
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                            >
                                Learn About Our Culture
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
