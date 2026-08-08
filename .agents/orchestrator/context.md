# Context — Savesnapfast Audit & Automated Repair

## Project Overview
- **Project**: Savesnapfast
- **Working Directory**: `c:\Users\newFUTURE\Desktop\xmax2\Savesnapfast`
- **Integrity Mode**: development
- **Stack**: Astro, TypeScript, Node.js, Custom API routes & scrapers, i18n localization dictionaries.

## Key Audit Scripts & Utilities
- `npm run build`: Astro static build runner.
- `node verify_build.cjs`: Verifies links, trailing slashes, canonical tags.
- `node audit_check.cjs`: Localization and link completeness check.
- `node analyze_links.cjs`: Link structure analysis.
- `node test-all-apis.js`: Automated API test suite.
- `node test-scrapers.js`: Scraper test suite.

## Initial Requirements Checklist
- [ ] R1. Codebase & Build Audit: Scan entire codebase, run build verification.
- [ ] R2. Localization & Link Integrity: Check language routes, meta tags, schema structures, internal links.
- [ ] R3. API Endpoints & Scrapers: Test API routes and scraper integration scripts.
- [ ] R4. Automated Bug Fixes: Repair build failures, broken paths, code syntax errors, missing translations, API flaws.
