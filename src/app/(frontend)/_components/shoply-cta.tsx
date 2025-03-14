import { Text } from "@medusajs/ui";
import { PayloadIcon } from "@payloadcms/ui";
import Link from "next/link";
import { ShoplyIcon } from "./icons/shoply-icon";

const ShoplyCTA = () => {
    return (
        <Text className="flex gap-x-2 txt-compact-small-plus items-center">
            Powered by
            <Link href="https://shoplyjs.com" target="_blank" rel="noreferrer" className="-mr-1">
                <ShoplyIcon fill="#9ca3af" />
            </Link>
            &{" "}
            <Link
                href="https://payloadcms.com/"
                target="_blank"
                rel="noreferrer"
                className="size-4"
            >
                <PayloadIcon fill="#9ca3af" />
            </Link>
        </Text>
    );
};

export default ShoplyCTA;
