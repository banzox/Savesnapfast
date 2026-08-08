## 2026-08-02T17:28:03Z
You are teamwork_preview_worker_m2_1 (Worker for Milestone 2: Technical SEO & Indexability Fixes).
Your working directory is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_m2_1
Project root is: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast

Read c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\PROJECT.md, c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\ORIGINAL_REQUEST.md, and the audit report at c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_explorer_m1_1\seo_audit_report.md.

Mandatory Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Edit `src/components/SEOConfig.astro`:
   - Fix canonical URL generation for translated legal and device pages so that they generate self-referencing canonical URLs (e.g. `/ar/privacy`, `/fr/privacy`, `/ar/terms`, `/es/ios`, etc.) pointing to their exact path rather than forcing English `/privacy`. Ensure canonical URLs never have trailing slashes except for `/`.
   - Remove `skipHreflang` suppression for translated legal and device pages. Ensure self-referencing and cross-linking `<link rel="alternate" hreflang="...">` tags are generated across all 30 languages for all pages (including legal and device pages).
   - Fix `fil` language mapping: Ensure `fil` language maps to `hreflang="fil"` (matching `/fil/` URL paths).
2. Edit `public/robots.txt`:
   - Remove crawl-blocking disallow rules for device and legal translated pages (`/*/about`, `/*/privacy`, `/*/terms`, `/*/ios`, `/*/android`, etc.) that prevent crawlers from reading `<meta name="robots" content="noindex, follow">`.
   - Ensure disallow rules accurately target internal/private endpoints (`/api/`, `/admin/`, `/*?*`) and explicitly allow `/_astro/` and static assets.
3. Verification:
   - Run `npx astro build` to confirm 0 build errors.
   - Run `node verify_build.cjs` to confirm all 11 verification checks pass clean.

Document your changes, build output, and test verification in `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_m2_1\changes.md` and `handoff.md`. Then send a message back to the orchestrator.
