## 2026-08-02T17:35:29Z

You are Worker (SEO & Verification Repair Specialist).
Working directory: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_v2
Project root: c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

FORENSIC AUDIT FAILURE EVIDENCE TO FIX:
The victory audit failed with the following evidence from `node audit_check.cjs`:
[ERROR] robots.txt is missing Disallow: /ios, /android, /mac, /pc, /*/ios, /*/android, /*/mac, /*/pc, /*/about, /*/privacy, /*/terms, /*/contact, /*/dmca, /*/disclaimer
[ERROR] SEOConfig.astro is missing translated legal page canonical calculation!
[ERROR] Canonical mismatch in dist/ar/about.html, dist/fr/privacy.html, dist/es/terms.html, dist/de/contact.html, dist/it/dmca.html, dist/tr/disclaimer.html.
Exit code: 1.

YOUR TASKS:
1. Inspect `audit_check.cjs` to understand the exact expected checks for `public/robots.txt`, `src/components/SEOConfig.astro`, and the canonical HTML output in `dist/`.
2. Update `public/robots.txt` to include the required Disallow directives for device routes (`/ios`, `/android`, `/mac`, `/pc`, `/*/ios`, `/*/android`, `/*/mac`, `/*/pc`) and translated legal routes (`/*/about`, `/*/privacy`, `/*/terms`, `/*/contact`, `/*/dmca`, `/*/disclaimer`).
3. Update `src/components/SEOConfig.astro` to properly compute canonical URLs for translated legal pages. Make sure translated legal pages (e.g. `/ar/about`, `/fr/privacy`, `/es/terms`, `/de/contact`, `/it/dmca`, `/tr/disclaimer`) output `<link rel="canonical" href="...">` pointing to the root English legal page URL (e.g., `https://savetik-fast.xyz/about`, etc.).
4. Run the build and verification commands:
   - `npm run build`
   - `node audit_check.cjs`
   - `node verify_build.cjs`
   - `node test-all-apis.js`
   - `node test-scrapers.js`
5. Ensure all verification scripts pass with Exit Code 0.
6. Write your handoff report to `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast\.agents\teamwork_preview_worker_repair_v2\handoff.md` detailing the changes made, verification commands executed, and output results.
7. Send a message to parent (ID: f09b2a6f-d3fd-46a7-ac73-37f0d0afa80e) referencing your handoff report.
