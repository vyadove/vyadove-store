import { RichText } from "@payloadcms/richtext-lexical/react";

export default function PolicyTemplate({ policy }: { policy: any }) {
    return (
        <div className="max-w-prose mx-auto py-12 px-4">
            <div className="flex flex-col gap-y-6 text-ui-fg-base">
                <div className="flex flex-col gap-y-4">
                    <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
                    <div
                        className="prose prose-lg"
                        data-testid="policy-description"
                    >
                        <RichText data={policy.description} />
                    </div>
                </div>
            </div>
        </div>
    );
}
