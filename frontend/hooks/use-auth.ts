"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginRequest } from "@/types/auth";

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok) {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
        router.refresh();
    };

    const isAuthenticated = status === "authenticated";
    const isAdmin = session?.user?.isAdmin || false;
    const isActive = session?.user?.isActive || false;

    return {
        session,
        status,
        isLoading,
        isAuthenticated,
        isAdmin,
        isActive,
        login,
        logout,
    };
}
