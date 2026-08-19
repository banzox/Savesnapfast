# Google Search Console (GSC) Recovery & Edge Deliverability Guide

**Target Domain:** `savetik-fast.xyz` (Savesnapfast / SaveTikFast)  
**System Architecture:** Astro 5.x SSG (Cloudflare Workers Static Asset Binding)  
**Document Version:** 2.0.0  
**Last Updated:** August 2026  

---

## 1. Executive Summary & Incident Overview

The domain `savetik-fast.xyz` experienced a complete de-indexation event where `site:savetik-fast.xyz` returned 0 indexed documents in Google Search despite serving a fully prerendered 191-page static architecture across 30 languages.

This guide provides the authoritative root-cause diagnostic framework, step-by-step Cloudflare WAF configuration instructions, Google Search Console recovery procedures, ad-network safety guidelines, and validation protocols required to achieve full indexing restoration.

---

## 2. 0-Index Root Cause Differentiation Matrix

When a high-utility web application drops to 0 indexed pages, the root cause invariably falls into one (or a combination) of four distinct categories:

```
+---------------------------------------------------------------------------------------------------+
|                                  0-INDEX ROOT CAUSE TAXONOMY                                      |
+------------------------------------+--------------------------------------------------------------+
| 1. Edge & WAF Crawler Blocking     | Cloudflare Bot Fight Mode or WAF challenge pages (403/503/   |
|    (Technical Infrastructure)      | Managed Challenge) preventing Googlebot HTML rendering.      |
+------------------------------------+--------------------------------------------------------------+
| 2. Google Algorithm Penalty        | Scaled Content Abuse, Thin Content, or automated machine-    |
|    (Algorithmic Quality)           | translation spam signals without sufficient unique value.   |
+------------------------------------+--------------------------------------------------------------+
| 3. Ad Network Security Flags       | Malicious popunders, deceptive download redirects, or mobile |
|    (Safe Browsing / Web Risk)      | carrier auto-sub scripts triggering Safe Browsing blocks.    |
+------------------------------------+--------------------------------------------------------------+
| 4. Manual Action or Legal Removal  | Explicit human-reviewed Google Manual Action or DMCA         |
|    (Policy / Legal Enforcement)    | Lumen database copyright removal.                            |
+------------------------------------+--------------------------------------------------------------+
```

### Detailed Diagnostic Matrix

| Root Cause Vector | Distinctive Diagnostic Signals in GSC & Logs | Severity | Primary Remediation Action |
|---|---|---|---|
| **Cloudflare Bot Fight Mode / WAF Challenge** | • GSC Live Test returns *"Page cannot be reached"* or *"Crawl failed"*. <br>• Cloudflare Security Analytics shows HTTP 403 or Managed Challenge for `Googlebot`. <br>• Rendered HTML screenshot shows *"Just a moment..."* or Cloudflare interstitial. | **Critical** (Immediate block) | Deploy Cloudflare WAF Skip Rule for `cf.client.bot` (Verified Bots). Disable Free Bot Fight Mode. |
| **Scaled Content Abuse / Thin Content** | • GSC Coverage shows thousands of pages under *"Discovered - currently not indexed"*. <br>• No Manual Action banner, but total crawl rate drops dramatically. <br>• Machine-translated strings identical across locales. | **High** (Algorithmic suppression) | Prune auto-generated duplicate URLs; enrich primary landing pages with unique localized FAQs, tutorials, and structured metadata. |
| **Ad Network / Safe Browsing Flag** | • GSC displays Red Warning in **Security Issues** (*"Deceptive site ahead"* / *"Harmful downloads"*). <br>• Chrome shows red interstitial screen to visitors. <br>• Popunder scripts injecting unverified ad rotation. | **Critical** (Domain blacklisting) | Disable aggressive popunders, APK direct-download ads, and social bar auto-redirects. Request Safe Browsing review. |
| **Manual Action / DMCA Takedown** | • GSC displays entry in **Security & Manual Actions > Manual Actions**. <br>• DMCA notice on Lumen Database citing specific video download URLs or trademark violations. | **Critical** (Index purge) | Audit DMCA compliance page (`/dmca`), ensure copyright takedown workflow is operational, and file formal GSC reconsideration request. |

---

## 3. Cloudflare WAF Custom Skip Rule Configuration (`cf.client.bot`)

Cloudflare's default **Bot Fight Mode** on Free and Pro tiers frequently challenges verified search engine crawlers (Googlebot, Bingbot, YandexBot, Applebot) because their automated traffic patterns resemble scraping activity.

To guarantee that Googlebot always receives immediate `HTTP 200 OK` with full prerendered HTML, implement the following Custom WAF Rule.

### Step-by-Step Configuration in Cloudflare Dashboard

1. **Log in to Cloudflare Dashboard**:
   - Navigate to `Websites` > select `savetik-fast.xyz`.
2. **Open Security Settings**:
   - In the left-hand navigation sidebar, click **Security** > **WAF**.
3. **Navigate to Custom Rules**:
   - Select the **Custom rules** tab.
   - Click **Create rule**.
4. **Define the Rule Properties**:
   - **Rule name**: `Allow Verified Search Engine Bots (Googlebot Bypass)`
   - **Field**: `Verified Bot`
   - **Operator**: `equals`
   - **Value**: `true` (Expression: `cf.client.bot`)
5. **Select the Action**:
   - Choose **Skip**.
   - Under **WAF components to skip**, check:
     - [x] **WAF Managed Rules**
     - [x] **Bot Fight Mode / Super Bot Fight Mode**
     - [x] **Rate Limiting Rules**
     - [x] **Managed Challenge**
6. **Deploy the Rule**:
   - Click **Deploy**.
   - Ensure the rule is placed at **Priority 1 (Top of list)** so it evaluates prior to any rate limits or geo-blocking rules.

```
+-----------------------------------------------------------------------------------+
|                        CLOUDFLARE WAF RULE DEFINITION                             |
+-------------------+---------------------------------------------------------------+
| Name              | Allow Verified Search Engine Bots                            |
| Filter Expression | cf.client.bot eq true                                         |
| Action            | Skip                                                          |
| Skipped Services  | Bot Fight Mode, Rate Limiting, WAF Managed Rules              |
| Position          | 1 (Highest Priority)                                          |
+-------------------+---------------------------------------------------------------+
```

### Verification via Terminal (cURL Googlebot Simulation)

Test edge deliverability using a Googlebot user-agent header:

```bash
# Test apex homepage with Googlebot User-Agent
curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://savetik-fast.xyz/

# Expected response:
# HTTP/2 200
# content-type: text/html; charset=utf-8
# strict-transport-security: max-age=31536000; includeSubDomains; preload
# cache-control: public, max-age=0, s-maxage=86400, must-revalidate
```

---

## 4. Google Search Console Diagnostic & Recovery Checklist

Execute this 4-phase audit in Google Search Console to systematically diagnose and resolve indexing blockers.

```
  +------------------------------------------------------------------------+
  |              GOOGLE SEARCH CONSOLE RECOVERY ROADMAP                    |
  +------------------------------------------------------------------------+
  | Phase 1: Security & Manual Actions Audit                              |
  |   ↳ Verify zero active penalties, deceptive flags, or malware warnings |
  +------------------------------------------------------------------------+
  | Phase 2: Index Coverage Status Breakdown                               |
  |   ↳ Classify URLs: "Excluded", "Crawled not indexed", "Duplicate"      |
  +------------------------------------------------------------------------+
  | Phase 3: Live URL Test & Render Inspection                             |
  |   ↳ Confirm 200 OK, full DOM rendering, no JS challenge obstruction    |
  +------------------------------------------------------------------------+
  | Phase 4: Sitemap Clean Resubmission & Priority Re-crawl                |
  |   ↳ Submit clean sitemap.xml (191 URLs), ping Googlebot inspection     |
  +------------------------------------------------------------------------+
```

### Phase 1: Security & Manual Actions Audit
1. Open GSC: **Security & Manual Actions** > **Manual Actions**.
   - **Target Status:** *"No issues detected"*.
   - *If an issue exists (e.g., "Scaled content abuse" or "Pure spam"):* Document the penalty scope and prepare a comprehensive reconsideration request detailing the genuine client-side tooling, clean translations, and static site architecture.
2. Open GSC: **Security & Manual Actions** > **Security Issues**.
   - **Target Status:** *"No issues detected"*.
   - *If "Deceptive Site" or "Social Engineering" is present:* Immediately pause Adsterra / popunder ad codes, clear cached CDN assets, and submit a review request.

### Phase 2: Index Coverage Status Breakdown
Navigate to **Indexing** > **Pages** and inspect the breakdown table:
- **"Discovered - currently not indexed"**: Indicates crawl budget starvation or domain-level crawl throttling. Remediation: WAF skip rule and sitemap re-pinging.
- **"Crawled - currently not indexed"**: Indicates Googlebot accessed the page but evaluated content quality as borderline. Remediation: Internal link equity consolidation and enriched unique copy.
- **"Duplicate without user-selected canonical"**: Indicates canonical mismatch. Remediation: Ensure Astro `<link rel="canonical">` points to the exact absolute URL without trailing slashes.

### Phase 3: Live URL Test & Render Inspection
1. Enter `https://savetik-fast.xyz/` in the top search bar of GSC.
2. Click **TEST LIVE URL**.
3. Verify the following:
   - **Availability:** *"URL is available to Google"*.
   - **HTTP Response:** `200 OK`.
   - **Page Resources:** `0` blocked essential JavaScript/CSS resources.
   - **Screenshot:** The rendered screenshot displays the interactive TikTok download UI with full styling (not a Cloudflare challenge screen).
4. Repeat Live URL Test on sample localized pages:
   - `https://savetik-fast.xyz/ar`
   - `https://savetik-fast.xyz/es/mp3`
   - `https://savetik-fast.xyz/de/tools`

### Phase 4: Clean Sitemap Resubmission
1. Navigate to **Indexing** > **Sitemaps**.
2. Remove any old or invalid sitemap URLs (e.g., `sitemap.html`, `feed.xml`).
3. Submit the primary clean sitemap:
   - `https://savetik-fast.xyz/sitemap.xml`
4. Confirm status displays **Success** with **191 discovered URLs**.

---

## 5. Ad Network Safety & Monetization Compliance

Aggressive ad networks (e.g., Adsterra, Monetag, PopAds) can instantly trigger Google Safe Browsing and de-indexing if rogue advertiser campaigns execute malicious behavior.

### Critical Ad Network Configuration Rules:
1. **Disable High-Risk Ad Formats**:
   - ❌ Disable **Direct Link redirects** (forced tab hijack).
   - ❌ Disable **Push Notification prompts** (classified as social engineering if misleading).
   - ❌ Disable **APK Auto-Download / Software Installer campaigns**.
2. **Enforce Frequency Capping**:
   - Limit Popunders / Interstitials to **1 impression per unique visitor per 24 hours**.
3. **Bot Exclusion for Ad Scripts**:
   - Ensure ad tags and popunder scripts do not execute during search crawler visits (render ads only after user interaction like click/keypress or check `navigator.userAgent`).
4. **Clear Ad Labeling**:
   - Ensure all display ad slots use clear labels (`Advertisement` / `Sponsored`) and maintain distinct separation from the TikTok video download buttons to prevent "Deceptive Layout" penalties.

---

## 6. Edge Headers & Caching Strategy

The `public/_headers` configuration applies enterprise-grade security and caching headers across Cloudflare Pages:

```ini
# Security Headers
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

# Static Assets (1 Year Immutable Cache)
/*.js
  Cache-Control: public, max-age=31536000, immutable
/*.css
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=31536000, immutable

# HTML Pages (Edge-cached 24h, Browser revalidates)
/*.html
  Cache-Control: public, max-age=0, s-maxage=86400, must-revalidate
```

---

## 7. Edge Routing & Hostname Canonicalization

All legacy, query-based, and alternative hostnames are resolved in **1 single 301 hop** at the Cloudflare Worker edge (`worker/index.ts` and `src/utils/redirects.ts`):

```
+-----------------------------+------------------------------------+--------------------------+
| Incoming Request            | Edge Transformation Engine         | Final Canonical Target   |
+-----------------------------+------------------------------------+--------------------------+
| www.savetik-fast.xyz/       | Hostname normalization             | savetik-fast.xyz/        |
| /tl/about-us.html           | Alias 'tl'->'fil', slug 'about-us' | /fil/about               |
| /en/about-us.html           | Strip 'en', slug 'about-us'        | /about                   |
| /ar/mp3/                    | Trailing slash removal             | /ar/mp3                  |
| /?lang=tl                   | Query param extraction             | /fil                     |
| /api/*                      | Inject X-Robots-Tag: noindex       | 200/404 + noindex header |
+-----------------------------+------------------------------------+--------------------------+
```

---

## 8. Continuous Verification Protocol

Run the automated verification test suites before and after any deployment:

```bash
# 1. Run Comprehensive Site Doctor (117 assertions)
npm run doctor

# 2. Run Build Artifact Verifier
node verify_build.cjs

# 3. Run Full Production Build
npm run build
```

Expected Result: **117/117 checks passing, 0 errors, 0 warnings, clean exit code 0.**
