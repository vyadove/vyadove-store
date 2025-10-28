// pages/api/revalidate-content.ts (or app/api/revalidate-content/route.ts in App Router)
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  // 1. Check for secret key to secure the endpoint
  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    // return res.status(401).json({ message: 'Invalid token' });

    // return an error
    return new Response("Invalid Token");
  }

  // 2. Determine which path to revalidate (e.g., all products)
  try {
    revalidatePath(path || "/");
    revalidatePath("/shop");
    console.log("Revalidation successful for /store and /");

    return Response.json({ revalidated: true });
  } catch (err) {
    console.error("Revalidation failed:", err);

    return new Response("Error revalidating");

    // return res.status(500).send('Error revalidating');
  }
}
