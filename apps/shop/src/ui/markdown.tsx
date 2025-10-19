import { MDXRemote } from "next-mdx-remote/rsc";

import "server-only";

export const Markdown = async ({ source }: { source: string }) => {
  return (
    <MDXRemote options={{ mdxOptions: { format: "md" } }} source={source} />
  );
};
