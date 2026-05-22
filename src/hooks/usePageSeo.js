import { useEffect } from "react";
import {
  DEFAULT_OG_IMAGE,
  PRIVATE_ROUTE_SEO,
  ROUTE_SEO,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo-config";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Updates document title, meta tags, canonical, and optional JSON-LD per route.
 */
export function usePageSeo(pathname, { jsonLd } = {}) {
  useEffect(() => {
    const routeMeta = ROUTE_SEO[pathname] ?? PRIVATE_ROUTE_SEO;
    const canonicalPath = pathname === "/" ? "" : pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = routeMeta.title;

    upsertMeta("name", "description", routeMeta.description);
    upsertMeta("name", "robots", routeMeta.robots);
    upsertMeta("name", "title", routeMeta.title);

    upsertMeta("property", "og:type", routeMeta.ogType);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:title", routeMeta.title);
    upsertMeta("property", "og:description", routeMeta.description);
    upsertMeta("property", "og:image", DEFAULT_OG_IMAGE);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:url", canonicalUrl);
    upsertMeta("name", "twitter:title", routeMeta.title);
    upsertMeta("name", "twitter:description", routeMeta.description);
    upsertMeta("name", "twitter:image", DEFAULT_OG_IMAGE);

    upsertLink("canonical", canonicalUrl);

    if (jsonLd) {
      upsertJsonLd("page-json-ld", jsonLd);
    } else {
      const el = document.getElementById("page-json-ld");
      if (el) el.remove();
    }
  }, [pathname, jsonLd]);
}
