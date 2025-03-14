import { Button } from "@payloadcms/ui";
import type { FieldServerComponent } from "payload";
import type React from "react";

const RefundButton: FieldServerComponent = ({ payload, data }) => {
    // if (!data || data.status !== "paid") return null;

    return (
        <Button buttonStyle="secondary" size="small" className="mr-2">
            Refund
        </Button>
    );
};

export default RefundButton;
