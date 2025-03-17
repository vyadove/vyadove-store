"use client";

import type { User } from "@/payload-types";
import type React from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

// Generic type for API requests
type APIRequest<T> = (args: T) => Promise<any>;

// Specific API function types
type Create = APIRequest<{
    email: string;
    password: string;
    passwordConfirm: string;
}>;
type ForgotPassword = APIRequest<{ email: string }>;
type Login = APIRequest<{ email: string; password: string }>;
type Logout = () => Promise<void>;
type ResetPassword = APIRequest<{
    password: string;
    passwordConfirm: string;
    token: string;
}>;

export type AuthContextType = {
    create: Create;
    forgotPassword: ForgotPassword;
    login: Login;
    logout: Logout;
    resetPassword: ResetPassword;
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => Promise<void>;
    user: User | null;
    // Derived status: 'loggedIn' if user exists, else 'loggedOut'
    status: "loggedIn" | "loggedOut";
};

// Utility function for API calls
const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch ${url}: ${errorText}`);
        }
        return await res.json();
    } catch (err) {
        console.error(err);
        throw new Error(
            err instanceof Error ? err.message : "An unexpected error occurred."
        );
    }
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    // Derived status: if user exists then loggedIn, else loggedOut.
    const status: "loggedIn" | "loggedOut" = user ? "loggedIn" : "loggedOut";

    const create: Create = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/create`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: args.email,
                    password: args.password,
                    passwordConfirm: args.passwordConfirm,
                }),
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data?.loginUser?.user || null);
    }, []);

    const login: Login = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: args.email,
                    password: args.password,
                }),
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data.user);
        return data.user;
    }, []);

    const updateUser = useCallback(async (updates: Partial<User>) => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/update/${updates?.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updates),
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data.user); // Update local state after a successful update
    }, []);

    const logout: Logout = useCallback(async () => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }
        );
        // You might check for specific data response if needed.
        setUser(null);
    }, []);

    const forgotPassword: ForgotPassword = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: args.email }),
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        // Optionally update the user if your response includes it:
        setUser(data?.loginUser?.user || null);
    }, []);

    const resetPassword: ResetPassword = useCallback(async (args) => {
        const data = await fetchWithErrorHandling(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    password: args.password,
                    passwordConfirm: args.passwordConfirm,
                    token: args.token,
                }),
            }
        );
        if (data.errors) {
            throw new Error(data.errors[0]?.message || "Unknown error");
        }
        setUser(data?.loginUser?.user || null);
    }, []);

    // Fetch current user on mount
    useEffect(() => {
        let isMounted = true;

        const fetchMe = async () => {
            try {
                const data = await fetchWithErrorHandling(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );
                if (isMounted) {
                    setUser(data.user || null);
                }
            } catch (e) {
                if (isMounted) {
                    setUser(null);
                }
            }
        };
        void fetchMe();

        // Cleanup if needed when component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                create,
                forgotPassword,
                login,
                logout,
                resetPassword,
                setUser,
                updateUser,
                user,
                status,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
