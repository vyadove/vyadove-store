import "server-only";

import { MDXRemote } from "next-mdx-remote/rsc";

export const Markdown = async ({ source }: { source: string }) => {
	return <MDXRemote options={{ mdxOptions: { format: "md" } }} source={source} />;
};
