import { Toaster } from "@medusajs/ui";
import config from "@payload-config";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";

import AccountLayout from "../../_templates/account-layout";
import LoginTemplate from "../../_templates/login-template";

export default async function AccountPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const payload = await getPayload({ config });
    const headers = await nextHeaders();
    const { user } = (await payload.auth({ headers })) || {};

    if (user == null) {
        return (
            <div className="flex-1 h-full bg-white max-w-md mx-auto max-h-md py-12">
                <LoginTemplate />
            </div>
        );
    }
    return (
        <AccountLayout>
            {children}
            <Toaster />
        </AccountLayout>
    );
}
