## 2026-08-02T17:23:42Z
You are teamwork_preview_explorer_m1_1 (Explorer for Milestone 1: SEO & Indexability Audit).
Your working directory is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_explorer_m1_1
Project root is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast

Read c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\PROJECT.md and c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\ORIGINAL_REQUEST.md.

Perform a deep exploration and audit of the codebase focusing on R1 / SEO & Indexability criteria:
1. Check `public/robots.txt` and all robots directives across pages/routes. Verify accurate disallow rules for device/legal translated pages if specified, or check how disallow rules and meta noindex interact.
2. Inspect sitemap generation (`sitemap-index.xml`, sub-sitemaps, astro sitemap config, or custom sitemap scripts). Verify if any broken/redirecting URLs exist or would be generated in sitemaps.
3. Check `src/components/SEOConfig.astro`, layout files, `src/middleware.ts`, and all page routes (`src/pages/`) for canonical and hreflang URL generation. Check for trailing slash inconsistencies (e.g. `/de/` vs `/de`), duplicate language codes, legacy code (`tl` vs `fil`), self-referencing canonicals, and translated legal/device pages.
4. Check for soft 404s or unhandled SSR errors under bot User-Agent requests across all page routes.

Write your full findings, file paths, line numbers, and recommended fixes in `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_explorer_m1_1\seo_audit_report.md`. Then send a message back to the orchestrator with your report summary and path.
