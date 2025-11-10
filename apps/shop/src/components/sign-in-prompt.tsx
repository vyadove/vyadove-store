import Link from "next/link";

import { Button } from "@ui/shadcn/button";
import { TypographyH2, TypographyP } from "@ui/shadcn/typography";

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between bg-white">
      <div>
        <TypographyH2 className="txt-xlarge">
          Already have an account?
        </TypographyH2>
        <TypographyP className="txt-medium text-ui-fg-subtle mt-2">
          Sign in for a better experience.
        </TypographyP>
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
