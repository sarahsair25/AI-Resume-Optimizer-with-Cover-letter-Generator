import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumatch.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/history/", "/api/", "/checkout/success", "/checkout/cancel"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}