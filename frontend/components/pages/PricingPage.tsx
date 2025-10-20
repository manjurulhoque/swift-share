"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    CheckCircle,
    X,
    Star,
    Shield,
    Zap,
    Users,
    Crown,
    Building,
    ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Free",
            icon: Star,
            description: "Perfect for personal use and small projects",
            monthlyPrice: 0,
            yearlyPrice: 0,
            color: "from-gray-500 to-gray-600",
            popular: false,
            features: [
                { name: "5 GB storage", included: true },
                { name: "10 file uploads per month", included: true },
                { name: "Basic file sharing", included: true },
                { name: "Password protection", included: true },
                { name: "7-day file retention", included: true },
                { name: "Email support", included: true },
                { name: "Advanced analytics", included: false },
                { name: "Custom branding", included: false },
                { name: "Priority support", included: false },
                { name: "API access", included: false },
            ],
        },
        {
            name: "Professional",
            icon: Zap,
            description: "Ideal for professionals and small teams",
            monthlyPrice: 12,
            yearlyPrice: 120,
            color: "from-blue-500 to-blue-600",
            popular: true,
            features: [
                { name: "100 GB storage", included: true },
                { name: "Unlimited file uploads", included: true },
                { name: "Advanced file sharing", included: true },
                { name: "Password protection", included: true },
                { name: "30-day file retention", included: true },
                { name: "Priority email support", included: true },
                { name: "Advanced analytics", included: true },
                { name: "Custom branding", included: true },
                { name: "Team collaboration", included: true },
                { name: "API access", included: false },
            ],
        },
        {
            name: "Business",
            icon: Users,
            description: "Perfect for growing teams and organizations",
            monthlyPrice: 29,
            yearlyPrice: 290,
            color: "from-purple-500 to-purple-600",
            popular: false,
            features: [
                { name: "500 GB storage", included: true },
                { name: "Unlimited file uploads", included: true },
                { name: "Advanced file sharing", included: true },
                { name: "Password protection", included: true },
                { name: "90-day file retention", included: true },
                { name: "Priority phone & email support", included: true },
                { name: "Advanced analytics", included: true },
                { name: "Custom branding", included: true },
                { name: "Team collaboration", included: true },
                { name: "API access", included: true },
            ],
        },
        {
            name: "Enterprise",
            icon: Building,
            description: "Custom solutions for large organizations",
            monthlyPrice: null,
            yearlyPrice: null,
            color: "from-indigo-500 to-indigo-600",
            popular: false,
            features: [
                { name: "Unlimited storage", included: true },
                { name: "Unlimited file uploads", included: true },
                { name: "Enterprise file sharing", included: true },
                { name: "Advanced security features", included: true },
                { name: "Custom file retention", included: true },
                { name: "24/7 dedicated support", included: true },
                { name: "Advanced analytics & reporting", included: true },
                { name: "White-label solution", included: true },
                { name: "SSO integration", included: true },
                { name: "Full API access", included: true },
            ],
        },
    ];

    const faqs = [
        {
            question: "Can I change my plan at any time?",
            answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.",
        },
        {
            question: "What happens if I exceed my storage limit?",
            answer: "You'll receive notifications when approaching your limit. You can upgrade your plan or delete old files to free up space.",
        },
        {
            question: "Is there a free trial for paid plans?",
            answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.",
        },
        {
            question: "Do you offer discounts for annual billing?",
            answer: "Yes! Annual billing saves you 2 months compared to monthly billing. You can see the savings by toggling the yearly option above.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Absolutely! You can cancel your subscription at any time from your account settings. Your data remains accessible until the end of your billing period.",
        },
    ];

    const formatPrice = (plan: any) => {
        if (plan.monthlyPrice === null) return "Custom";
        if (plan.monthlyPrice === 0) return "Free";

        const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
        return `$${price.toFixed(0)}`;
    };

    const getSavings = (plan: any) => {
        if (plan.monthlyPrice === null || plan.monthlyPrice === 0) return null;
        const yearlySavings = plan.monthlyPrice * 12 - plan.yearlyPrice;
        return yearlySavings;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Simple, Transparent
                            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                                Pricing
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Choose the perfect plan for your needs. Start free
                            and scale as you grow.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center space-x-4 mb-8">
                            <span
                                className={`text-lg ${
                                    !isYearly ? "text-white" : "text-blue-200"
                                }`}
                            >
                                Monthly
                            </span>
                            <Switch
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                                className="data-[state=checked]:bg-green-500"
                            />
                            <span
                                className={`text-lg ${
                                    isYearly ? "text-white" : "text-blue-200"
                                }`}
                            >
                                Yearly
                                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded-full">
                                    Save 2 months
                                </span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Pricing Plans */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {plans.map((plan, index) => (
                                <Card
                                    key={index}
                                    className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                                        plan.popular
                                            ? "ring-2 ring-blue-500 scale-105"
                                            : ""
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    )}

                                    <CardContent
                                        className={`p-8 ${
                                            plan.popular ? "pt-12" : ""
                                        }`}
                                    >
                                        <div
                                            className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}
                                        >
                                            <plan.icon className="h-8 w-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {plan.description}
                                        </p>

                                        <div className="mb-8">
                                            <div className="flex items-baseline">
                                                <span className="text-4xl font-bold text-gray-900">
                                                    {formatPrice(plan)}
                                                </span>
                                                {plan.monthlyPrice !== null &&
                                                    plan.monthlyPrice > 0 && (
                                                        <span className="text-gray-600 ml-2">
                                                            /month
                                                        </span>
                                                    )}
                                            </div>
                                            {isYearly && getSavings(plan) && (
                                                <p className="text-green-600 text-sm mt-1">
                                                    Save ${getSavings(plan)} per
                                                    year
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            className={`w-full mb-8 ${
                                                plan.name === "Enterprise"
                                                    ? "bg-gray-900 hover:bg-gray-800"
                                                    : plan.popular
                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                    : "bg-gray-600 hover:bg-gray-700"
                                            }`}
                                        >
                                            {plan.name === "Enterprise"
                                                ? "Contact Sales"
                                                : plan.name === "Free"
                                                ? "Get Started"
                                                : "Start Free Trial"}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>

                                        <div className="space-y-4">
                                            {plan.features.map(
                                                (feature, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center"
                                                    >
                                                        {feature.included ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                        ) : (
                                                            <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                                                        )}
                                                        <span
                                                            className={`text-sm ${
                                                                feature.included
                                                                    ? "text-gray-900"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >
                                                            {feature.name}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to know about our pricing
                                and plans.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 pb-8"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Start your free trial today. No credit card
                            required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
