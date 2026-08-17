import type { APIRoute } from "astro";
import { sitemapResponse } from "../utils/sitemap";

export const prerender = true;

// Backward-compatible child URL for the sitemap index already submitted in GSC.
export const GET: APIRoute = async () => sitemapResponse();
