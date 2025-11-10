// pages/api/revalidate-content.ts (or app/api/revalidate-content/route.ts in App Router)
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { path, tag, secret }: any = await req.json();

  // 1. Check for secret key to secure the endpoint
  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (path && tag) {
    await revalidatePath(path);

    return NextResponse.json({ revalidated: true, type: "path", path });
  }

  if (path) {
    await revalidatePath(path);

    return NextResponse.json({ revalidated: true, type: "path", path });
  }

  if (tag) {
    await revalidateTag(tag);

    return NextResponse.json({ revalidated: true, type: "tag", tag });
  }

  return NextResponse.json({ message: "Nothing to revalidate" });
}
