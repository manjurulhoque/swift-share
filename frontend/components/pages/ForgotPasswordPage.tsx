import { Link, Share } from "lucide-react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Share className="h-10 w-10 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">
                            SwiftShare
                        </span>
                    </Link>
                </div>
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle>Forgot Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}