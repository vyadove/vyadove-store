import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth";
import Input from "./input";
import { SubmitButton } from "./submit-button";
import React, { useState } from "react";
import ErrorMessage from "@/components/error-message";

enum LOGIN_VIEW {
    REGISTER = "register",
    SIGN_IN = "sign-in",
}

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("handle sumit  ---------");

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as {
            email: string;
            password: string;
        };

        try {
            await login(data);
            router.refresh();
        } catch (error: any) {
            console.error("Login error -- : ", error);
            setMessage(`Error logging in ${error?.message}`);
        }
    };

    return (
        <div
            className="max-w-sm w-full flex flex-col items-center"
            data-testid="login-page"
        >
            <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
            <p className="text-center text-base-regular text-ui-fg-base mb-8">
                Sign in to access an enhanced shopping experience. ---
            </p>
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full gap-y-2">
                    <Input
                        autoComplete="email"
                        data-testid="email-input"
                        label="Email"
                        name="email"
                        required
                        title="Enter a valid email address."
                        type="email"
                    />
                    <Input
                        autoComplete="current-password"
                        data-testid="password-input"
                        label="Password"
                        name="password"
                        required
                        type="password"
                    />
                </div>
                <ErrorMessage
                    data-testid="login-error-message"
                    error={message}
                />
                <SubmitButton
                    className="w-full mt-6"
                    data-testid="sign-in-button"
                >
                    Sign in
                </SubmitButton>
            </form>
            <span className="text-center text-ui-fg-base text-small-regular mt-6">
                Not a member?{" "}
                <button
                    className="underline"
                    data-testid="register-button"
                    onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
                >
                    Join us
                </button>
                .
            </span>
        </div>
    );
};

export default Login;
