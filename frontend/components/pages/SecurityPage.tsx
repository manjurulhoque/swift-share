"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Lock,
    Key,
    Database,
    CheckCircle,
    FileText,
    Eye,
    Server,
    Users,
    AlertTriangle,
    Award,
    Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SecurityPage() {
    const securityFeatures = [
        {
            icon: Shield,
            title: "End-to-End Encryption",
            description:
                "All files are encrypted with AES-256 encryption before leaving your device and remain encrypted throughout transmission and storage.",
            details: [
                "Client-side encryption",
                "Zero-knowledge architecture",
                "Encrypted file metadata",
                "Secure key derivation",
            ],
        },
        {
            icon: Key,
            title: "Advanced Authentication",
            description:
                "Multi-factor authentication and single sign-on options to ensure only authorized users can access your files.",
            details: [
                "Two-factor authentication",
                "SSO integration",
                "OAuth 2.0 support",
                "Biometric authentication",
            ],
        },
        {
            icon: Database,
            title: "Secure Infrastructure",
            description:
                "Our infrastructure is built with security-first principles, hosted in SOC 2 compliant data centers.",
            details: [
                "SOC 2 Type II certified",
                "ISO 27001 compliant",
                "24/7 security monitoring",
                "Regular penetration testing",
            ],
        },
        {
            icon: Eye,
            title: "Privacy Controls",
            description:
                "Granular privacy settings give you complete control over who can access your files and when.",
            details: [
                "Password protection",
                "Link expiration",
                "Download limits",
                "Access logs",
            ],
        },
        {
            icon: Server,
            title: "Data Residency",
            description:
                "Choose where your data is stored with our global network of secure data centers.",
            details: [
                "Choose your region",
                "GDPR compliance",
                "Data sovereignty",
                "Local encryption keys",
            ],
        },
        {
            icon: Users,
            title: "Team Security",
            description:
                "Enterprise-grade team management with role-based access controls and audit trails.",
            details: [
                "Role-based permissions",
                "Team audit logs",
                "Admin controls",
                "Activity monitoring",
            ],
        },
    ];

    const certifications = [
        {
            name: "SOC 2 Type II",
            description:
                "Independently audited for security, availability, and confidentiality",
            icon: Award,
        },
        {
            name: "ISO 27001",
            description:
                "International standard for information security management systems",
            icon: Shield,
        },
        {
            name: "GDPR Compliant",
            description:
                "Full compliance with European data protection regulations",
            icon: FileText,
        },
        {
            name: "HIPAA Ready",
            description:
                "Healthcare industry compliance for protected health information",
            icon: Lock,
        },
    ];

    const securityPractices = [
        "Regular security audits and penetration testing",
        "24/7 security operations center (SOC) monitoring",
        "Incident response and disaster recovery plans",
        "Employee background checks and security training",
        "Secure development lifecycle (SDLC) practices",
        "Regular vulnerability assessments",
        "Bug bounty program with security researchers",
        "Data backup and recovery procedures",
    ];

    const threatProtection = [
        {
            icon: AlertTriangle,
            title: "Malware Detection",
            description: "Real-time scanning for malicious files and content",
        },
        {
            icon: Zap,
            title: "DDoS Protection",
            description:
                "Advanced protection against distributed denial of service attacks",
        },
        {
            icon: Eye,
            title: "Anomaly Detection",
            description:
                "AI-powered monitoring for unusual access patterns and behaviors",
        },
        {
            icon: Lock,
            title: "Intrusion Prevention",
            description:
                "Multi-layered defense against unauthorized access attempts",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Enterprise-Grade
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Security
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Your data security is our top priority. Learn about
                            the comprehensive security measures that protect
                            your files and ensure your privacy.
                        </p>
                    </div>
                </section>

                {/* Security Features */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Multi-Layered Security
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We implement multiple layers of security to
                                protect your data at every stage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {securityFeatures.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                >
                                    <CardContent className="p-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                                            <feature.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {feature.details.map(
                                                (detail, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center text-sm text-gray-700"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {detail}
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

                {/* Certifications */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Industry Certifications
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We maintain the highest industry standards and
                                certifications.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <cert.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {cert.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {cert.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Threat Protection */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Advanced Threat Protection
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Proactive security measures to defend against
                                modern threats.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {threatProtection.map((threat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 transition-colors">
                                        <threat.icon className="h-10 w-10 text-orange-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {threat.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {threat.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Security Practices */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Security Best Practices
                            </h2>
                            <p className="text-xl text-gray-600">
                                Our comprehensive approach to keeping your data
                                secure.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {securityPractices.map((practice, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {practice}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Report */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Transparency & Trust
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            We believe in transparency. Download our security
                            whitepaper to learn more about our security
                            architecture and practices.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                Download Security Whitepaper
                            </button>
                            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
                                View Compliance Reports
                            </button>
                        </div>
                    </div>
                </section>

                {/* Contact Security Team */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Questions About Security?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Our security team is here to help. Contact us for
                            security-related questions or to report
                            vulnerabilities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Contact Security Team
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Report Security Issue
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
