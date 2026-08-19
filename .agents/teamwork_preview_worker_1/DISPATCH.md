## 2026-08-19T16:13:53Z
You are a Worker for Savesnapfast.

Mission: Implement Edge & Codebase Optimizations, Synchronize Test Suites, and Produce Comprehensive GSC Recovery Documentation.
Authoritative Request: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\ORIGINAL_REQUEST.md
Master Project Plan: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\PROJECT.md
Working directory for your metadata: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_1

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks to execute:
1. Edge Worker & Redirects Refinements:
   - In `worker/index.ts`: Add hostname canonicalization defense (`www.savetik-fast.xyz` -> `savetik-fast.xyz` 301 redirect), and add `X-Robots-Tag: noindex, nofollow` to `/api/*` responses.
   - In `src/utils/redirects.ts`: Ensure single-hop resolution for compound legacy paths (e.g. `/tl/about-us.html` -> `/fil/about` in 1 hop).
2. Edge Headers Enhancement:
   - In `public/_headers`: Add HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`) and clean HTML cache-control (`Cache-Control: public, max-age=0, s-maxage=86400, must-revalidate`).
3. Test & Verification Alignment:
   - In `verify_build.cjs` and `audit_check.cjs`: Synchronize sitemap check to accept `sitemap.xml` / `sitemap-0.xml` / `sitemap-index.xml` and align with modern self-referencing multilingual canonical architecture.
4. Comprehensive GSC Recovery Guide:
   - Create `docs/GSC_RECOVERY_GUIDE.md` detailing:
     - 0-index root cause differentiation (WAF/Bot Fight Mode vs Scaled Content Abuse vs Adsterra Safe Browsing flag vs Manual Action / DMCA).
     - Cloudflare WAF custom skip rule configuration (`cf.client.bot`) step-by-step.
     - Google Search Console diagnostic checklist (Manual Actions, Security Issues, URL live inspection, Sitemaps re-submission).
     - Ad network safety toggles and content quality recommendations.
5. Verification Execution:
   - Run `npm run doctor` (ensure 117/117 checks pass).
   - Run `node verify_build.cjs` (ensure all checks pass).
   - Run `npx astro build` (ensure clean exit 0).
6. Write your handoff report to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_1\handoff.md` and report completion via send_message.
