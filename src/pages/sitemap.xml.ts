import type { APIRoute } from 'astro';
import { sitemapResponse } from '../utils/sitemap';

export const prerender = true;

export const GET: APIRoute = async () => sitemapResponse();
