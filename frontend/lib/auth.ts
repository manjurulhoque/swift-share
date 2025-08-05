import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse, LoginRequest } from "@/types/auth";
import { JWT } from "next-auth/jwt";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";


async function refreshAccessToken(token: JWT) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: token.refreshToken,
                }),
            }
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access,
            refreshToken: refreshedTokens.refresh ?? token.refreshToken,
            accessTokenExpires: Date.now() + 60 * 60 * 1000, // 60 minutes to match backend
            error: undefined,
        };
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const authOptions: NextAuthOptions = {
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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.isAdmin = user.isAdmin;
                token.isActive = user.isActive;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }

            // // Handle token refresh
            // if (trigger === "update" && session?.accessToken) {
            //     token.accessToken = session.accessToken;
            //     token.refreshToken = session.refreshToken;
            // }

            // // Check if token is expired and refresh if needed
            // if (token.accessToken && token.refreshToken) {
            //     try {
            //         const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({
            //                 refresh_token: token.refreshToken,
            //             }),
            //         });

            //         if (response.ok) {
            //             const data = await response.json();
            //             if (data.success) {
            //                 token.accessToken = data.data.access_token;
            //                 token.refreshToken = data.data.refresh_token;
            //             }
            //         }
            //     } catch (error) {
            //         console.error("Token refresh error:", error);
            //     }
            // }

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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
