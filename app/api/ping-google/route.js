import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    const SITE_URL = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://habitflow.indevs.in"
    ).replace(/\/$/, "");

    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { signal: AbortSignal.timeout(5000) },
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
