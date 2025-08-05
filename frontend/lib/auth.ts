import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse, LoginRequest } from "@/types/auth";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        } as LoginRequest),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const data: AuthResponse = await response.json();

                    if (data.success) {
                        return {
                            id: data.data.user.id,
                            email: data.data.user.email,
                            name: `${data.data.user.first_name} ${data.data.user.last_name}`,
                            firstName: data.data.user.first_name,
                            lastName: data.data.user.last_name,
                            isAdmin: data.data.user.is_admin,
                            isActive: data.data.user.is_active,
                            emailVerified: data.data.user.email_verified,
                            accessToken: data.data.tokens.access_token,
                            refreshToken: data.data.tokens.refresh_token,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.isAdmin = user.isAdmin;
                token.isActive = user.isActive;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!;
                session.user.email = token.email!;
                session.user.name = token.name!;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.isActive = token.isActive as boolean;
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/login",
        verifyRequest: "/login",
        newUser: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
