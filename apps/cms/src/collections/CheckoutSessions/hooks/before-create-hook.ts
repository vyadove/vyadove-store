import { BeforeChangeHook } from "@/admin/types";
import { rateLimitGuard } from "@/utils/rate-limit-guard";
import { CheckoutSession } from "@shopnex/types";

export const beforeCreateHook: BeforeChangeHook<CheckoutSession> = async ({
    operation,
    req,
}) => {
    if (operation !== "create") {
        return;
    }
    const guard = await rateLimitGuard(req);

    if (!guard.ok) {
        return guard.response;
    }
};
