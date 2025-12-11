"use client";

import type React from "react";
import { createContext, use, useCallback, useEffect, useState } from "react";

import type { User } from "@vyadove/types";

import { payloadSdk, setStoredToken } from "@/utils/payload-sdk";

// Auth status type
type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

// Method parameter types
type LoginArgs = { email: string; password: string };
type CreateArgs = { email: string; password: string; passwordConfirm: string };
type ForgotPasswordArgs = { email: string };
type ResetPasswordArgs = { password: string; token: string };

export type AuthContextType = {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  login: (args: LoginArgs) => Promise<User>;
  logout: () => Promise<void>;
  create: (args: CreateArgs) => Promise<User>;
  forgotPassword: (args: ForgotPasswordArgs) => Promise<void>;
  resetPassword: (args: ResetPasswordArgs) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isLoading = status === "idle" || status === "loading";

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (args: LoginArgs): Promise<User> => {
    setStatus("loading");
    setError(null);

    try {
      const result = await payloadSdk.login({
        collection: "users",
        data: { email: args.email, password: args.password },
      });

      // Store token for persistent auth
      if (result.token) {
        setStoredToken(result.token);
      }

      setUser(result.user as User);
      setStatus("authenticated");

      return result.user as User;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";

      setError(message);
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setStatus("loading");
    setError(null);

    try {
      await payloadSdk.logout({ collection: "users" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
    } finally {
      // Always clear local state and token
      setStoredToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const create = useCallback(async (args: CreateArgs): Promise<User> => {
    setStatus("loading");
    setError(null);

    try {
      // Register the user
      await payloadSdk.register({
        collection: "users",
        data: { email: args.email, password: args.password },
      });
      // Auto-login after registration
      const loginResult = await payloadSdk.login({
        collection: "users",
        data: { email: args.email, password: args.password },
      });

      // Store token for persistent auth
      if (loginResult.token) {
        setStoredToken(loginResult.token);
      }

      setUser(loginResult.user as User);
      setStatus("authenticated");

      return loginResult.user as User;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";

      setError(message);
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const forgotPassword = useCallback(
    async (args: ForgotPasswordArgs): Promise<void> => {
      setError(null);

      try {
        await payloadSdk.forgotPassword({
          collection: "users",
          data: { email: args.email },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to send reset email";

        setError(message);
        throw err;
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (args: ResetPasswordArgs): Promise<void> => {
      setStatus("loading");
      setError(null);

      try {
        const result = await payloadSdk.resetPassword({
          collection: "users",
          data: { password: args.password, token: args.token },
        });

        if (result.user) {
          setUser(result.user as User);
          setStatus("authenticated");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to reset password";

        setError(message);
        setStatus("unauthenticated");
        throw err;
      }
    },
    [],
  );

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<void> => {
      if (!user?.id) {
        setError("No user to update");
        throw new Error("No user to update");
      }
      setError(null);

      try {
        const result = await payloadSdk.update({
          collection: "users",
          id: user.id,
          data: updates,
        });

        setUser(result as User);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update user";

        setError(message);
        throw err;
      }
    },
    [user?.id],
  );

  // Fetch current user on mount
  useEffect(() => {
    let isMounted = true;

    const fetchMe = async () => {
      try {
        const result = await payloadSdk.me({ collection: "users" });

        if (isMounted && result.user) {
          setUser(result.user as User);
          setStatus("authenticated");
        } else if (isMounted) {
          setStatus("unauthenticated");
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    };

    void fetchMe();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext
      value={{
        user,
        status,
        error,
        isLoading,
        login,
        logout,
        create,
        forgotPassword,
        resetPassword,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => use(AuthContext);
