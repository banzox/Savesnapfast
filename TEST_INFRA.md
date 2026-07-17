# E2E Test Infrastructure Specification

This document defines the E2E testing framework, test philosophy, feature inventory, and coverage thresholds for the Savesnapfast SEO and redirects project.

---

## 1. Test Philosophy

The primary objective of Savesnapfast's testing infrastructure is to ensure absolute correctness of SEO metadata, URL routes, indexation directives, and language configurations. Because our project is a static site built using Astro and deployed on Cloudflare Pages, our tests focus on two complementary verification strategies:

1. **Static Auditing (`audit_check.cjs`)**: Scans source configurations, codebase structures, and static public assets before building, ensuring that code layout conventions match the specified SEO guidelines.
2. **Build-Output Verification (`verify_build.cjs`)**: Directly analyzes the generated files in the `dist/` directory post-build. By parsing the compiled HTML files, XML sitemaps, and built `robots.txt`, it guarantees that the actual page outputs meet all canonical and indexation requirements without hardcoding test results.

Our testing is built on the principle of **Zero Trust in Stale Artifacts** — verification scripts execute dynamically on actual filesystem states, and any violation of interface contracts results in a non-zero exit code to block deployments.

---

## 2. Feature Inventory

The test suite validates the following core features:

### A. SEO Canonicals & Trailing Slashes
- **Self-Referential Canonicals**: Every indexable page must contain a single `<link rel="canonical">` tag pointing to its own absolute URL.
- **Canonical Trailing Slash Setting**: In alignment with Astro's configuration `trailingSlash: 'never'`, all canonical URLs must omit the trailing slash (except for the root homepage `https://savetik-fast.xyz/`).
- **No Redirect Chains**: Canonicals must not point to URLs that generate redirects.

### B. Hreflang Configuration
- **Self-Reference Rule**: A localized page must include an `hreflang` tag referencing its own absolute URL.
- **Alternate Language Mapping**: Each page must reference alternate language variants correctly using language codes (with `fil` mapped to `tl` in the `hreflang` attribute value).
- **Excluded Pages**: Non-English legal pages and device-specific pages must completely omit `hreflang` tags to prevent indexing bloat.

### C. XML Sitemaps
- **Sitemap Structure**: Verification of `sitemap-index.xml` and `sitemap-0.xml` formats.
- **Exclusion of Thin Content**: Localized blog listing pages with fewer than 2 posts (thin content) must be excluded from `sitemap-0.xml` to prevent GSC indexation mismatches.
- **Exclusion of Disallowed Pages**: Device-specific pages (`/ios`, `/android`, etc.) and translated legal pages must not be included in the sitemaps.

### D. Robots.txt Directives
- **Disallowed Directories**: Ensure `robots.txt` blocks crawlers from accessing `/api/`, `/_astro/`, `/ios`, `/android`, `/mac`, `/pc`, and non-English legal pages.
- **Sitemap Pointer**: Verify that `robots.txt` contains a valid pointer to the generated `sitemap-index.xml`.

### E. Redirect Rules
- **Middleware Redirects**: Ensure that legacy paths (e.g. `tl` to `fil`, `/en` to `/`) are redirected cleanly with 301 status.
- **Trailing Slash Normalization**: Ensure that URLs requested with a trailing slash are normalized to their clean, non-trailing slash format.

---

## 3. 4-Tier Coverage Thresholds

To guarantee thorough validation, the testing suite is structured into four distinct coverage tiers:

| Tier | Tier Name | Scope & Verification Items | Target Threshold |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Feature Coverage** | Checks presence and correct formatting of SEO canonical tags, hreflang alternates, `robots.txt` disallows, and `sitemap-index.xml` entries. | **100% of indexable pages** |
| **Tier 2** | **Boundary/Corner Cases** | Validates behavior for empty/malformed paths, double-slash normalization, and legacy Filipino language code routing (`tl` -> `fil`). | **Zero unexpected 404s/routing loops** |
| **Tier 3** | **Cross-Feature Interactions** | Checks that trailing-slash normalizations do not clash with middleware language routing and sitemap exclusions do not cause missing page errors. | **Zero redirect chain conflicts** |
| **Tier 4** | **Real-World Workload** | End-to-end execution: running a full `npm run build` and checking all output html/xml/txt files for compliance. | **Exit Code 0 across all verification scripts** |

---

## 4. Testing Execution Commands

To execute the full verification suite, use the commands defined in `TEST_READY.md`:
- Static code audit: `node audit_check.cjs`
- Build-output E2E verification: `node verify_build.cjs`
