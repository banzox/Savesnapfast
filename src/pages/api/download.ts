import type { APIRoute } from "astro";
import { handleDownloadGet, handleDownloadOptions } from "../../server/download-api";

export const prerender = false;

export const OPTIONS: APIRoute = async () => handleDownloadOptions();

export const GET: APIRoute = async ({ request }) => handleDownloadGet(request);
