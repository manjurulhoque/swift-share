"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageSquare,
    Headphones,
    Building,
    User,
    Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiryType: "general",
    });

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "Get help from our support team",
            contact: "support@swiftshare.com",
            availability: "24/7 Response within 2 hours",
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Speak directly with our team",
            contact: "+1 (555) 123-4567",
            availability: "Mon-Fri 9AM-6PM EST",
        },
        {
            icon: MessageSquare,
            title: "Live Chat",
            description: "Instant support via chat",
            contact: "Available in dashboard",
            availability: "24/7 for Premium users",
        },
        {
            icon: Building,
            title: "Enterprise Sales",
            description: "Custom solutions for your business",
            contact: "sales@swiftshare.com",
            availability: "Mon-Fri 9AM-6PM EST",
        },
    ];

    const offices = [
        {
            city: "San Francisco",
            address: "123 Market Street, Suite 400",
            zipCode: "San Francisco, CA 94105",
            country: "United States",
        },
        {
            city: "London",
            address: "456 Oxford Street, Floor 5",
            zipCode: "London W1C 1AP",
            country: "United Kingdom",
        },
        {
            city: "Singapore",
            address: "789 Marina Bay Road, Level 15",
            zipCode: "Singapore 018980",
            country: "Singapore",
        },
    ];

    const inquiryTypes = [
        { value: "general", label: "General Inquiry" },
        { value: "support", label: "Technical Support" },
        { value: "sales", label: "Sales Question" },
        { value: "partnership", label: "Partnership" },
        { value: "security", label: "Security Issue" },
        { value: "billing", label: "Billing Question" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Get in Touch
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                We're Here to Help
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Have questions about SwiftShare? Need help with your
                            account? Want to explore enterprise solutions? We'd
                            love to hear from you.
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Multiple Ways to Reach Us
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Choose the method that works best for you. We're
                                committed to providing excellent support.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {contactMethods.map((method, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <method.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {method.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            {method.description}
                                        </p>
                                        <p className="text-blue-600 font-semibold mb-2">
                                            {method.contact}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {method.availability}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Send Us a Message
                            </h2>
                            <p className="text-xl text-gray-600">
                                Fill out the form below and we'll get back to
                                you as soon as possible.
                            </p>
                        </div>

                        <Card className="border-0 shadow-xl">
                            <CardContent className="p-8">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label
                                                htmlFor="name"
                                                className="text-gray-700 font-medium"
                                            >
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="email"
                                                className="text-gray-700 font-medium"
                                            >
                                                Email Address *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2"
                                                placeholder="your.email@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label
                                                htmlFor="company"
                                                className="text-gray-700 font-medium"
                                            >
                                                Company
                                            </Label>
                                            <Input
                                                id="company"
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "company",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="inquiryType"
                                                className="text-gray-700 font-medium"
                                            >
                                                Inquiry Type *
                                            </Label>
                                            <select
                                                id="inquiryType"
                                                required
                                                value={formData.inquiryType}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "inquiryType",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {inquiryTypes.map((type) => (
                                                    <option
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="subject"
                                            className="text-gray-700 font-medium"
                                        >
                                            Subject *
                                        </Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "subject",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                            placeholder="Brief description of your inquiry"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="message"
                                            className="text-gray-700 font-medium"
                                        >
                                            Message *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            required
                                            value={formData.message}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "message",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 min-h-[120px]"
                                            placeholder="Please provide details about your inquiry..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                    >
                                        <Send className="mr-2 w-5 h-5" />
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Office Locations */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Global Offices
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We have offices around the world to better serve
                                our global customer base.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {offices.map((office, index) => (
                                <Card
                                    key={index}
                                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CardContent className="p-8 text-center">
                                        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {office.city}
                                        </h3>
                                        <div className="text-gray-600 space-y-1">
                                            <p>{office.address}</p>
                                            <p>{office.zipCode}</p>
                                            <p className="font-medium">
                                                {office.country}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Teaser */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Looking for Quick Answers?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Check out our comprehensive help center and FAQ
                            section for instant answers to common questions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                                Visit Help Center
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                            >
                                View FAQ
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
