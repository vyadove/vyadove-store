"use client";

import Link from "next/link";
import { useActionState } from "react";

import ErrorMessage from "./error-message";
import Input from "./input";
import { SubmitButton } from "./submit-button";

enum LOGIN_VIEW {
    REGISTER = "register",
    SIGN_IN = "sign-in",
}

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Register = ({ setCurrentView }: Props) => {
    //   const [message, formAction] = useActionState(signup, null)

    return (
        <div
            className="max-w-sm flex flex-col items-center"
            data-testid="register-page"
        >
            <h1 className="text-large-semi uppercase mb-6">
                Become a Medusa Store Member
            </h1>
            <p className="text-center text-base-regular text-ui-fg-base mb-4">
                Create your Medusa Store Member profile, and get access to an
                enhanced shopping experience.
            </p>
            <form className="w-full flex flex-col">
                <div className="flex flex-col w-full gap-y-2">
                    <Input
                        autoComplete="given-name"
                        data-testid="first-name-input"
                        label="First name"
                        name="first_name"
                        required
                    />
                    <Input
                        autoComplete="family-name"
                        data-testid="last-name-input"
                        label="Last name"
                        name="last_name"
                        required
                    />
                    <Input
                        autoComplete="email"
                        data-testid="email-input"
                        label="Email"
                        name="email"
                        required
                        type="email"
                    />
                    <Input
                        autoComplete="tel"
                        data-testid="phone-input"
                        label="Phone"
                        name="phone"
                        type="tel"
                    />
                    <Input
                        autoComplete="new-password"
                        data-testid="password-input"
                        label="Password"
                        name="password"
                        required
                        type="password"
                    />
                </div>
                {/* <ErrorMessage error={message} data-testid="register-error" /> */}
                <span className="text-center text-ui-fg-base text-small-regular mt-6">
                    By creating an account, you agree to Medusa Store&apos;s{" "}
                    <Link className="underline" href="/content/privacy-policy">
                        Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link className="underline" href="/content/terms-of-use">
                        Terms of Use
                    </Link>
                    .
                </span>
                <SubmitButton
                    className="w-full mt-6"
                    data-testid="register-button"
                >
                    Join
                </SubmitButton>
            </form>
            <span className="text-center text-ui-fg-base text-small-regular mt-6">
                Already a member?{" "}
                <button
                    className="underline"
                    onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
                >
                    Sign in
                </button>
                .
            </span>
        </div>
    );
};

export default Register;
