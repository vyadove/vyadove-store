import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import PolicyTemplate from "../../../_templates/policy";

type PolicyPageProps = {
    params: Promise<{ policy: string }>;
};

export default async function PolicyPage(props: PolicyPageProps) {
    const params = await props.params;
    const payload = await getPayload({ config });
    const policyResult = await payload.find({
        collection: "policies",
        limit: 1,
        where: {
            handle: {
                equals: params.policy,
            },
        },
    });
    const policy = policyResult.docs[0];

    if (!policy) {
        notFound();
    }

    return <PolicyTemplate policy={policy} />;
}
