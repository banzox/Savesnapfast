## 2026-08-28T09:58:31Z
You are Milestone 1 Worker (Sitemap & Headers Remediation) for Savesnapfast (savetik-fast.xyz).
Workspace Directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast
Original Request: C:\Users\newFUTURE\.gemini\antigravity\brain\815f585c-6600-4869-bebd-41cdc77658c5\ORIGINAL_REQUEST.md
Survey Explorer 2 Report: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_explorer_survey_2\handoff.md
Project Scope: C:\Users\newFUTURE\.gemini\antigravity\brain\815f585c-6600-4869-bebd-41cdc77658c5\PROJECT.md

Your Write Ownership:
- `src/utils/sitemap.ts`
- `src/pages/sitemap.xml.ts`
- `public/_headers`

Task Objectives:
1. Read ORIGINAL_REQUEST.md and the Survey Explorer 2 report.
2. Update `src/utils/sitemap.ts` to expand sitemap generation to include ALL 520 valid content URLs:
   - 30 Homepages (`/` + 29 `/{lang}`)
   - 120 Tool Landing Pages (`mp3`, `story`, `slideshow`, `tools` across 30 languages)
   - 120 Device Guides (`ios`, `android`, `mac`, `pc` across 30 languages)
   - 181 Legal/Info Pages (`about`, `privacy`, `terms`, `contact`, `dmca`, `disclaimer` across 30 languages + 1 English `editorial-policy`)
   - 30 Blog Category Indexes (`blog` + 29 `/{lang}/blog`)
   - 39 Blog Markdown Articles (9 English + 30 localized)
3. Ensure the XML structure includes:
   - Root `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
   - ISO `<lastmod>` timestamps on all URLs.
   - Reciprocal `<xhtml:link rel="alternate" hreflang="..." href="..."/>` tags for all 30 languages + `x-default` for multilingual routes.
4. Update `public/_headers` to explicitly serve `/sitemap.xml` with `Content-Type: application/xml; charset=utf-8` and `Cache-Control: public, max-age=3600`.
5. Run the build command (`npm run build`) and verify that `dist/sitemap.xml` is generated with 520 URLs and valid XML.
6. Run existing tests (`node tools/site-doctor.cjs`, `node tools/test_crawler_emulation.cjs`) to confirm zero regressions.
7. Write your handoff report in your working directory and send a message back with your verification results.
