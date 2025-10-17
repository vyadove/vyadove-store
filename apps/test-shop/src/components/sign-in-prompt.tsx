import { Button, Heading, Text } from "@medusajs/ui";
import Link from "next/link";

const SignInPrompt = () => {
    return (
        <div className="bg-white flex items-center justify-between">
            <div>
                <Heading className="txt-xlarge" level="h2">
                    Already have an account?
                </Heading>
                <Text className="txt-medium text-ui-fg-subtle mt-2">
                    Sign in for a better experience.
                </Text>
            </div>
            <div>
                <Link href="/account">
                    <Button
                        className="h-10"
                        data-testid="sign-in-button"
                        variant="secondary"
                    >
                        Sign in
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default SignInPrompt;
