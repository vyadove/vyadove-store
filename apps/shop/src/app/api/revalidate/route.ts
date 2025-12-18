import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type RevalidateBody = {
  path?: string;
  tag?: string;
  secret: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RevalidateBody;
    const { path, tag, secret } = body;

    const expectedSecret = process.env.REVALIDATION_SECRET_TOKEN;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!path && !tag) {
      return NextResponse.json(
        { message: "No path or tag provided" },
        { status: 400 },
      );
    }

    const results: { path?: string; tag?: string } = {};

    if (path) {
      revalidatePath(path);
      results.path = path;
    }

    if (tag) {
      revalidateTag(tag);
      results.tag = tag;
    }

    return NextResponse.json({ revalidated: true, ...results });
  } catch (error) {
    console.error("Revalidation error:", error);

    return NextResponse.json(
      { message: "Revalidation failed", error: String(error) },
      { status: 500 },
    );
  }
}
