# Orchestration Plan — Savesnapfast SEO, Cloudflare & Codebase Health

## Objectives
1. **R1: Google Search Console & Technical SEO Root Cause Investigation**
   - Root cause analysis of `site:savetik-fast.xyz` 0 indexation.
   - Disentangle Google algorithmic penalties (Scaled Content Abuse / Thin Content) vs Manual Actions vs Security/DMCA flags vs technical crawl barriers.
   - Comprehensive actionable GSC remediation checklist & audit criteria.

2. **R2: Cloudflare & Edge Delivery Verification**
   - Audit `worker/index.ts`, WAF configurations, Bot Fight Mode, cache control, status codes under Googlebot User-Agent.
   - Ensure 200 OK responses with clean HTML and zero challenge screens across all locales.

3. **R3: Codebase, Build, Sitemap & Doctor Validation**
   - Validate Astro build (`npx astro build`), static prerendering.
   - Verify `robots.txt`, `sitemap.xml` with 191 clean canonical URLs.
   - Verify 30-language bidirectional hreflang mapping.
   - Run and ensure 100% pass on `npm run doctor` and verification scripts.

## Milestones & Work Breakdown
- **Phase 0: Multi-Explorer Survey (3 Explorers in parallel)**
  - Explorer 1 (SEO/GSC Specialist): Analyze SEO metadata, canonicals, hreflang, robots.txt, sitemaps, thin content risks, GSC recovery strategies.
  - Explorer 2 (Edge/Cloudflare Specialist): Analyze `worker/index.ts`, Cloudflare routing, headers, bot detection bypasses, redirects.
  - Explorer 3 (Codebase & Build Specialist): Inspect project configuration, package scripts (`npm run doctor`), Astro routing, language routes, static asset generation.
- **Phase 1: Implementation & Synthesis (Worker)**
  - Apply any necessary fixes to ensure full compliance across code, edge worker, sitemap/robots, and produce GSC recovery documentation.
- **Phase 2: Independent Review (2 Reviewers in parallel)**
  - Reviewer 1: Technical SEO & Edge architecture compliance.
  - Reviewer 2: Build integrity, route coverage, doctor verification.
- **Phase 3: Adversarial Challenge (2 Challengers in parallel)**
  - Challenger 1: Crawler simulation (Googlebot user agent across all 30 locales and subroutes).
  - Challenger 2: Edge routing, redirect loop, canonical/hreflang reciprocity stress tests.
- **Phase 4: Forensic Integrity Audit (Auditor)**
  - Audit codebase against hardcoding, facade tests, verify genuine implementation.
- **Phase 5: Gate Evaluation & Handoff**
  - Synthesize results, confirm pass criteria, produce handoff report and notify parent.
