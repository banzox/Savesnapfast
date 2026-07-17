# Context - Savesnapfast SEO & Redirects Fix

## Project Overview
- **Name**: Savesnapfast
- **Technology**: Astro-based website (savetik-fast.xyz)
- **Goal**: Fix SEO, indexing, redirect, canonical, and link issues per Google Search Console audits.

## Key Files Identified
- `astro.config.mjs`: Astro project configuration
- `src/middleware.ts`: Redirect / language handling middleware
- `src/components/SEOConfig.astro`: Generates canonical and hreflang tags
- `src/components/Navbar.astro` & `src/components/Footer.astro`: Main navigation components
- `src/components/LanguageSelector.astro`: Language switching selector
- `verify_build.cjs`: Local verification script checking build output format and canonical constraints
- `audit_check.cjs`: Check script analyzing files and configuration issues
- `public/robots.txt`: Robots configuration
- `public/_redirects`: Cloudflare redirect configuration

## Current Audit Findings
- Astro is configured with `trailingSlash: 'never'` but `SEOConfig.astro` uses trailing slashes for canonical URLs, creating 301/308 redirects.
- Some hreflang URLs might have trailing slashes.
- Navbar/Footer links might contain trailing slashes or produce invalid link formats.
- Language `tl` (Tagalog) needs to be redirected/mapped to `fil` (Filipino).
- Translated legal pages need canonical points to main English version, excluded from hreflang.
- Device-specific pages (`ios`, `android`, `mac`, `pc`) need `noindex` rules, exclusion from hreflang, and exclusion from sitemaps.
