#!/usr/bin/env node
/**
 * CARMELSOLV™ MCP Server
 *
 * Provides project context, product catalog, blog conventions, and
 * development tools for agents working on the carmelsolv.com website.
 *
 * Usage: Add to .claude/settings.json MCP servers, or run directly:
 *   node mcp/server.js
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ─── Product Catalog ───────────────────────────────────────────────

const PRODUCTS = [
  {
    name: "Dimethyl Carbonate (DMC)",
    slug: "dimethyl-carbonate",
    cas: "616-38-6",
    grades: ["Industrial (≥99.5%)", "Battery/Electronic (≥99.99%)"],
    category: "Carbonate Solvent",
    page: "products/dimethyl-carbonate.html",
  },
  {
    name: "Propylene Carbonate (PC)",
    slug: "propylene-carbonate",
    cas: "108-32-7",
    grades: ["Industrial (≥99.5%)", "Battery/Electronic (≥99.9%)"],
    category: "Carbonate Solvent",
    page: "products/propylene-carbonate.html",
  },
  {
    name: "Ethylene Carbonate (EC)",
    slug: "ethylene-carbonate",
    cas: "96-49-1",
    grades: ["Industrial (≥99.5%)", "Battery/Electronic (≥99.95%)"],
    category: "Carbonate Solvent",
    page: "products/ethylene-carbonate.html",
  },
  {
    name: "Ethyl Methyl Carbonate (EMC)",
    slug: "ethyl-methyl-carbonate",
    cas: "623-53-0",
    grades: ["Industrial (≥99.5%)", "Battery/Electronic (≥99.99%)"],
    category: "Carbonate Solvent",
    page: "products/ethyl-methyl-carbonate.html",
  },
  {
    name: "Diethyl Carbonate (DEC)",
    slug: "diethyl-carbonate",
    cas: "105-58-8",
    grades: ["Industrial (≥99.5%)", "Battery/Electronic (≥99.99%)"],
    category: "Carbonate Solvent",
    page: "products/diethyl-carbonate.html",
  },
  {
    name: "Propylene Glycol Industrial",
    slug: "propylene-glycol-industrial",
    cas: "57-55-6",
    grades: ["Industrial (≥99.5%)"],
    category: "Glycol",
    page: "products/propylene-glycol-industrial.html",
  },
  {
    name: "Propylene Glycol USP",
    slug: "propylene-glycol-usp",
    cas: "57-55-6",
    grades: ["USP-NF", "FCC"],
    category: "Glycol",
    page: "products/propylene-glycol-usp.html",
  },
  {
    name: "Methyl Propionate",
    slug: "methyl-propionate",
    cas: "554-12-1",
    grades: ["Technical", "Flavor/Fragrance (FEMA GRAS 2752)"],
    category: "Propionate Ester",
    page: "products/methyl-propionate.html",
  },
  {
    name: "Ethyl Propionate",
    slug: "ethyl-propionate",
    cas: "105-37-3",
    grades: ["Technical", "Flavor/Fragrance (FEMA GRAS 2456)"],
    category: "Propionate Ester",
    page: "products/ethyl-propionate.html",
  },
  {
    name: "Propyl Propionate",
    slug: "propyl-propionate",
    cas: "106-36-5",
    grades: ["Technical", "Flavor/Fragrance (FEMA GRAS 2958)"],
    category: "Propionate Ester",
    page: "products/propyl-propionate.html",
  },
  {
    name: "Succinic Acid",
    slug: "succinic-acid",
    cas: "110-15-6",
    grades: ["Industrial", "Food (FCC/E363)", "Pharma (USP/Ph.Eur)"],
    category: "Dicarboxylic Acid",
    page: "products/succinic-acid.html",
  },
];

// ─── Resource Definitions ───────────────────────────────────────────

const RESOURCES = {
  "project://overview": {
    title: "Project Overview",
    mimeType: "text/markdown",
    content: `# CARMELSOLV™ Website — Project Overview

## Architecture

**Pure static HTML website** — no framework, no build step, no package manager.

| Layer | Technology |
|-------|-----------|
| Pages | Static HTML files (index.html + subdirectories) |
| Styling | Single css/style.css (~13KB), CSS custom properties, rem-based |
| JavaScript | Single js/nav.js — mobile nav toggle only |
| Backend | contact.php — Formspree-backed contact form |
| Deployment | deploy.sh — FTP mirror via lftp to Namecheap hosting |
| Analytics | Google Analytics 4 (G-8BMD1ZJM2E) |

## Key Files

| File | Purpose |
|------|---------|
| index.html | Homepage (hero, about, products grid, contact form) |
| products/*.html | 11 individual product detail pages |
| blog/index.html | Blog listing page |
| blog/*.html | 21 individual blog posts |
| css/style.css | All global + product page styles |
| js/nav.js | Mobile hamburger menu toggle |
| .htaccess | Apache: HTTPS redirect, clean URLs |
| deploy.sh | lftp mirror to Namecheap |
| sitemap.xml | 12-URL XML sitemap |
| robots.txt | Crawl rules |
| llms.txt | AI crawler site summary |

## Directory Layout

\`\`\`
carmelsolv.com/
├── index.html              # Homepage
├── products/               # 11 product detail pages
├── blog/                   # 21 posts + index + README.md
├── css/style.css           # Global styles
├── js/nav.js               # Mobile nav toggle
├── images/                 # Blog images, logo, comparison chart
├── contact.php             # PHP mail handler
├── .htaccess               # Apache rewrites
├── deploy.sh               # FTP deployment
├── sitemap.xml / robots.txt / llms.txt
└── mcp/                    # This MCP server
\`\`\`

## Key Patterns

- **No components/templates** — HTML is copy-pasted between pages
- **Every page is self-contained** — includes full <nav>, <footer>, schema JSON-LD
- **Dark theme** — navy/charcoal (#0B1526) with gold accent (#C8922A)
- **rem-based spacing** — 1rem = 16px; only 1px borders use px
- **Blog README** at blog/README.md — detailed template docs for new posts`,
  },

  "project://conventions/blog": {
    title: "Blog Post Conventions",
    mimeType: "text/markdown",
    content: `# Blog Post Conventions

> Source: blog/README.md + project memory

## Before Creating a Post

1. **Dates are back-dated**, not today's date. Posts follow a fictional timeline:
   Jan 20 → Feb 18/23 → Mar 30 → Apr 3/10/17/24 → May 1/5/10/15/20 → Jun 17/20/24.
   Ask or continue the cadence. Each new post must be the newest.
2. **Brand split**: Body copy uses "CarmelSolv". Chrome (footer, author card, hero author span) uses "CARMELSOLV™" / "Carmel Solvents Supply LLC".
3. **Kicker varies by post type**: "Technical Deep-Dive" for formulation posts, "Supply Chain" for commercial posts — match the post's nature.
4. **Unique form ID per post**: .cta-box gets a unique id (e.g., \`pg-cta\`, \`uv-cta\`); floating quote pill href and IntersectionObserver must match.

## File Structure

Each blog post is a standalone HTML file in /blog/.
- Shares the same layout template (copy an existing post)
- All rem-based responsive design
- Floating TOC sidebar + author card + contact form

## Required Metadata (3 sections in <head>)

### 1. SEO tags
\`\`\`html
<title>Post Title | CARMELSOLV™</title>
<meta name="description" content="1-2 sentence summary. Keep under 160 chars.">
<link rel="canonical" href="https://www.carmelsolv.com/blog/post-slug.html">
<meta property="og:title" content="Post Title | CARMELSOLV™">
<meta property="og:description" content="Same summary for social previews.">
<meta property="og:url" content="https://www.carmelsolv.com/blog/post-slug.html">
<meta property="og:image" content="https://www.carmelsolv.com/images/...">
<meta name="twitter:card" content="summary_large_image">
\`\`\`

### 2. BlogPosting Schema
\`\`\`json
{
  "@type": "BlogPosting",
  "headline": "Full post headline",
  "description": "Full description",
  "image": "https://www.carmelsolv.com/images/...",
  "datePublished": "2026-MM-DD",
  "dateModified": "2026-MM-DD",
  "author": { "@type": "Organization", "name": "CARMELSOLV" }
}
\`\`\`

### 3. BreadcrumbList Schema
Position 3 name and item must match the post.

## Article Shell (CSS Grid Layout)
\`\`\`html
<div class="article-shell">
  <!-- Left: sticky TOC + Author Card -->
  <aside class="toc-card">...</aside>
  <div class="author-card-premium">...</div>
  <!-- Right: main article -->
  <main class="article-content">
    <article class="article-body">
      <section id="section-id" aria-labelledby="section-id-title">
        <h2 id="section-id-title">Section Heading</h2>
        ...
      </section>
    </article>
  </main>
</div>
\`\`\`

## Contact Form (last section)
- Uses Formspree: action="https://formspree.io/f/xnjwgzdz"
- Unique id on .cta-box per post
- Shared product dropdown (solvent products + "Multiple / Other")

## Floating Quote Pill
- Fixed bottom-right, IntersectionObserver hides it when CTA is visible
- href must match the form's id
- observer target must match the form's id

## After Creating
- Add card at top of blog/index.html (newest first)
- Verify all section ids match TOC links

## Responsive Breakpoints
| Width | Layout |
|-------|--------|
| >66.25em (1060px) | Full: wide padding, 13.75rem TOC |
| 56.25em–66.25em (900–1060px) | Mid: narrower TOC (11rem) |
| 40em–56.25em (640–900px) | Tablet: tight TOC (10rem) |
| <40em (640px) | Mobile: stacked, pill-link TOC items |
| <35em (560px) | Small mobile: single-column TOC |

## Fastest Build Path
1. Copy the cleanest recent post to a new slug
2. Swap head/schema/breadcrumb/hero/TOC via Edit
3. Splice new <article class="article-body"> inner content
4. Add card to blog/index.html`,
  },

  "project://conventions/product-pages": {
    title: "Product Page Conventions",
    mimeType: "text/markdown",
    content: `# Product Page Conventions

Each product page in /products/ follows a consistent structure:

## <head> Metadata
- **Title**: "{Product Name} ({Abbrev}) | CAS {number} | CARMELSOLV™"
- **Description**: "Buy {product} from CARMELSOLV™ — U.S. distributor... SDS & COA available. Request a quote."
- **Canonical**: https://www.carmelsolv.com/products/{slug}.html
- **Schema**: Product + BreadcrumbList + FAQPage (10 questions)

## Page Sections (in order)
1. **Hero** — product name, CAS, tagline, CTA button
2. **Stats Bar** — CAS, MW, density, boiling point, flash point
3. **Grades Table** — industrial vs battery/USP grade specs
4. **Properties** — physical/chemical properties table
5. **Applications** — industry use cases with icons
6. **Packaging** — available packaging options
7. **Documents** — SDS, COA availability
8. **FAQ** — 10 Q&A items (FAQPage schema)
9. **Quote Form** — Formspree contact form

## Product Categories
- **Carbonate Solvents**: DMC, PC, EC, EMC, DEC
- **Glycols**: Propylene Glycol (Industrial + USP)
- **Propionate Esters**: Methyl, Ethyl, Propyl Propionate
- **Dicarboxylic Acids**: Succinic Acid

## Shared Elements
- Same <nav> and <footer> as homepage
- Same Formspree endpoint (xnjwgzdz)
- GA4 tag on every page
- Product schema includes: name, alternateName[], description, identifier (CAS), category, offers`,
  },

  "project://products": {
    title: "Product Catalog",
    mimeType: "text/markdown",
    content: PRODUCTS.map(
      (p) =>
        `- **${p.name}** — CAS ${p.cas}, ${p.grades.join(" / ")}, [${p.page}](${p.page})`
    ).join("\n"),
  },

  "project://design": {
    title: "Design Tokens",
    mimeType: "text/markdown",
    content: `# Design Tokens (CSS Custom Properties)

## Theme (Dark)
\`\`\`css
:root {
  --bg-primary:   #0B1526;   /* Page background */
  --bg-secondary: #101E35;   /* Section backgrounds */
  --bg-card:      #162033;   /* Card/table backgrounds */
  --border:       #1E3050;   /* Borders, dividers */
  --accent:       #C8922A;   /* Gold — links, CTAs, highlights */
  --accent-dark:  #A87520;   /* Darker gold for hover states */
  --text-primary: #F0F6FF;   /* Headings, body text */
  --text-secondary: #94A3B8; /* Secondary text */
  --text-muted:   #64748B;   /* Muted/caption text */
  --white:        #FFFFFF;   /* White for contrast */
  --font: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --max-w: 1100px;           /* Max content width */
  --radius: 8px;             /* Border radius */
}
\`\`\`

## Blog Page-Scoped Variables
\`\`\`css
--ssap-navy: #0D1F3C;
--ssap-gold: var(--accent, #C8922A);
--ssap-card: var(--bg-card, rgba(255,255,255,0.04));
--ssap-border: var(--border, rgba(255,255,255,0.12));
--ssap-text: var(--text-secondary, #b8c1d1);
--ssap-muted: var(--text-muted, #7f8ca3);
--ssap-white: var(--white, #ffffff);
--ssap-radius: var(--radius, 0.875rem);
\`\`\`

## Spacing
- **rem-based** — 1rem = 16px
- Only 1px borders, 0px in calc(), and sr-only use px
- All layout values use rem

## Responsive Breakpoints
| Breakpoint | Target |
|-----------|--------|
| 1440px | Wide desktop |
| 1060px | Desktop |
| 900px | Small desktop / tablet landscape |
| 700px | Tablet |
| 640px | Mobile (stack) |
| 560px | Small mobile |
`,
  },

  "project://deployment": {
    title: "Deployment",
    mimeType: "text/markdown",
    content: `# Deployment Workflow

## How to Deploy
\`\`\`bash
./deploy.sh
\`\`\`

## What it does
- Uses \`lftp\` to mirror the repo to Namecheap FTP hosting
- FTP host: ftp.carmelsolv.com
- Only uploads changed/new files (mirror --reverse)
- Parallel uploads (5 connections)

## Excluded from deploy
.git/, .DS_Store, .gitignore, .ftpquota, deploy.sh, BingSiteAuth.xml,
googlecf7df8a767bec398.html, SEO-REVIEW.md, seo-review-deepseek.md,
llms.txt, contact.php

## Server Stack
- Apache with mod_rewrite (.htaccess)
- PHP (for contact.php, excluded from deploy)
- Namecheap shared hosting

## .htaccess Rules
1. HTTP → HTTPS 301 redirect
2. Remove index.html from URLs
3. Clean URLs: strip .html extension for product pages`,
  },

  "project://seo-gaps": {
    title: "Known SEO Gaps",
    mimeType: "text/markdown",
    content: `# Known SEO Gaps (from SEO reviews)

**Current Score: ~7.8/10**

## Priority Action Items

### Trust Signals
- Add phone number to contact section and schema
- Add physical address to footer (already in Organization schema)
- Consider dedicated About page for E-E-A-T

### Technical
- Add \`<lastmod>\` to sitemap.xml entries
- Add OG images to product pages
- Verify all product pages have Twitter Card markup

### Content / Internal Linking
- Add cross-links between related product pages
- Add cross-links from blog posts to relevant product pages
- Consider author bio pages or team section

### Social / Discoverability
- Add social media profile links if they exist
- Consider LinkedIn company page link`,
  },

  "project://blog-posts": {
    title: "Blog Post Index",
    mimeType: "text/markdown",
    content: `# Blog Posts (newest first)

| Date | Post | Slug |
|------|------|------|
| Jun 24, 2026 | Raw-Material Uncertainty in Battery Electrolyte Research | battery-electrolyte-uncertainty |
| Jun 20, 2026 | Food Ingredient Supplier Qualification — Compliance & Risk | supplier-qualification-compliance-risk |
| Jun 17, 2026 | Epoxy Flooring & Tool Cleaning — Solvent Solutions | epoxy-flooring-tool-cleaning |
| May 20, 2026 | Oleochemicals — Building Blocks of Modern Formulations | building-blocks-modern-formulations |
| May 15, 2026 | Functional Textiles — From Innovation to Industrialization | innovation-to-industrialization |
| May 10, 2026 | Evaluating NMP and Processing Materials | evaluating-nmp-processing-materials |
| May 5, 2026 | When a COA Isn't Enough — Fit-for-Purpose Verification | coa-fit-for-purpose |
| May 1, 2026 | Bridging Research and Reality in Textile Innovation | bridging-research-reality |
| Apr 30, 2026 | Why Functional Textile Projects Fail to Scale Up | functional-textile-scale-up |
| Apr 24, 2026 | Direct China-India Propylene Glycol Supply | direct-china-india-propylene-glycol |
| Apr 17, 2026 | Ingredient Validation — Making the Right Material Decisions | ingredient-validation |
| Apr 10, 2026 | Managing Batch Variance in UV-Curable Protective Coatings | uv-batch-variance |
| Apr 3, 2026 | Propylene Glycol Formulation Design | propylene-glycol-formulation-design |
| Mar 30, 2026 | Propylene Carbonate — A Versatile Solvent for Modern Formulations | propylene-carbonate-formulation |
| Feb 23, 2026 | Why Supply Stability Matters More Than Price | supply-stability |
| Feb 18, 2026 | Reflections on the American Coatings Show 2026 | american-coatings-show-2026 |
| Jan 20, 2026 | Introducing the Spot Stock Allocation Program | ssap_article |

**Total: 21 posts** (includes "Where to Start" orientation post at blog/where-to-start.html)`,
  
  "project://conventions/category-pages": {
    title: "Category Page Conventions",
    mimeType: "text/markdown",
    content: `# Category Page Conventions

Used by all 4 category pages: \`carbonate-solvents.html\`, \`oleochemicals.html\`, \`surfactants.html\`, \`oem-odm-detergent-products.html\`.

## Page Structure

Each category page follows this skeleton (in order):
1. **<head>** — GA4 tag, meta tags, OG tags, BreadcrumbList schema
2. **<nav>** — identical across all pages; Products link points to \`index.html\`
3. **Hero** — \`<section class="product-hero">\` with breadcrumb, H1, intro paragraph
4. **Product Grid** — \`<section>\` with \`.prod-grid\` of \`.prod-card\` items
5. **Applications** — optional \`<section>\` with \`.app-list\` of \`.app-tag\` pills
6. **Documentation** — \`<section>\` with \`.doc-grid\` / \`.doc-item\` cards
7. **RFQ Form** — \`<section id="quote">\` with Formspree \`.contact-form\`
8. **Footer** — standard copyright + address

## Product Card HTML Pattern

\`\`\`html
<div class="prod-card">
  <div class="cas-badge">CAS XXXXXX-X</div>
  <h3>Product Name</h3>
  <div class="prod-aliases">Alias · Other Name · CAS XXXXXX-X</div>
  <div class="prod-variants">
    <div class="label">Variants / Grades</div>
    <span class="variant-tag">Variant 1</span>
  </div>
  <div class="prod-apps">
    <strong>Common applications:</strong> Description.
  </div>
  <div class="prod-docs">SDS, TDS, and COA available upon request.</div>
  <a href="#quote" class="prod-cta">Request Quote</a>
</div>
\`\`\`

## Product Card CSS (page-scoped <style> block)

\`\`\`css
.prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; margin-top: 32px; }
.prod-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; transition: border-color 0.2s, transform 0.2s; display: flex; flex-direction: column; }
.prod-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.prod-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--white); margin-bottom: 6px; }
.prod-aliases { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; }
.prod-variants .label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
.variant-tag { display: inline-block; background: rgba(200,146,42,0.08); border: 1px solid rgba(200,146,42,0.2); border-radius: 4px; padding: 4px 10px; font-size: 0.8rem; color: var(--text-secondary); margin: 0 6px 6px 0; }
.prod-apps { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; flex: 1; margin-bottom: 16px; }
.prod-docs { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 16px; padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 6px; border-left: 2px solid var(--border); }
.prod-cta { display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: var(--accent); color: var(--bg-primary); font-weight: 700; font-size: 0.85rem; padding: 10px 20px; border-radius: var(--radius); text-decoration: none; }
.prod-cta:hover { background: var(--white); color: var(--bg-primary); }
\`\`\`

## Surfactants: Ion-Type Grouping

Group under \`.type-section\` headers:
\`\`\`html
<div class="type-section">
  <h3><span class="ion">Anionic</span> Surfactants</h3>
  <div class="prod-grid">...</div>
</div>
\`\`\`

## Key Rules

- **No Chinese characters** — site is English-only. Removed 2026-07-11. Do NOT add Chinese.
- **No emoji in headings** — removed from homepage cards. Keep headings text-only.
- **Disclaimer on every page**: "All specifications are typical values. Final specifications confirmed at quotation."
- **CAB naming**: Always "CAB — Cocamidopropyl Betaine", never "CAB/LAB".
- **GMS and GML are separate** — never call GML a GMS grade.
- **No "authorized distributor"** or **"FDA approved"** language.
- **"pharmaceutical"** only as application context, never a grade claim.`,
  },

  "project://conventions/homepage": {
    title: "Homepage Structure",
    mimeType: "text/markdown",
    content: `# Homepage Structure

## Sections (in order)
1. **Nav** — sticky, links: Philosophy (#about), Products (products/), Blog (blog/), Contact (#contact)
2. **Hero** — tagline, H1, CTA buttons
3. **Why CARMELSOLV** — #about, 6 .why-card items
4. **Products** — #products, 4 category cards in 4-column grid
5. **Contact** — #contact, Formspree form
6. **Footer** — copyright + address

## Category Cards (Homepage)

4 cards in \`grid-template-columns: repeat(4, 1fr)\`:

\`\`\`html
<div class="product-card" style="border-color: rgba(200,146,42,0.3); background: linear-gradient(135deg, #162033 0%, #1a2a3d 100%);">
  <div class="product-cas">11 Products</div>
  <h3>Carbonate Solvents &amp; Specialty Chemicals</h3>
  <p>Description...</p>
  <a href="products/carbonate-solvents.html" class="product-link">View Products →</a>
</div>
\`\`\`

## Card Links
- Carbonate Solvents → \`products/carbonate-solvents.html\`
- Oleochemicals → \`products/oleochemicals.html\`
- Surfactants → \`products/surfactants.html\`
- OEM / ODM → \`products/oem-odm-detergent-products.html\`

## Nav Convention for Sub-pages

All sub-pages use:
\`\`\`html
<li><a href="../index.html#about">Philosophy</a></li>
<li><a href="index.html">Products</a></li>
<li><a href="../blog/">Blog</a></li>
<li><a href="../index.html#contact">Contact</a></li>
\`\`\`

## No Chinese / No Emoji Rule

English-only. Chinese removed 2026-07-11. Emoji removed from homepage cards. Do NOT add either back.`,
  },
},
};

// ─── Server Setup ───────────────────────────────────────────────────

const server = new Server(
  {
    name: "carmelsolv-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// ─── Resource Handlers ──────────────────────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: Object.entries(RESOURCES).map(([uri, res]) => ({
    uri,
    name: res.title,
    mimeType: res.mimeType,
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const resource = RESOURCES[uri];
  if (!resource) {
    throw new Error(`Resource not found: ${uri}`);
  }
  return {
    contents: [
      {
        uri,
        mimeType: resource.mimeType,
        text: resource.content,
      },
    ],
  };
});

// ─── Tool Handlers ──────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_product",
      description:
        "Look up a product by name, slug, or CAS number. Returns full details including grades, category, and page path.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Product name, slug, or CAS number (e.g., 'DMC', 'dimethyl-carbonate', or '616-38-6')",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "list_products",
      description:
        "List all products in the catalog with name, CAS number, grades, and page path.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "list_blog_posts",
      description:
        "List all blog posts with dates, topics, and slugs. Useful for finding existing posts or checking the publication timeline.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "blog_template",
      description:
        "Get the full HTML template and checklist for creating a new blog post. Includes metadata, schema, hero, article shell, TOC, author card, contact form, and floating quote pill patterns.",
      inputSchema: {
        type: "object",
        properties: {
          kicker_type: {
            type: "string",
            enum: ["Technical Deep-Dive", "Supply Chain", "Industry Insights", "Product Spotlight"],
            description: "The kicker/category label for the post hero (defaults to 'Technical Deep-Dive')",
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ── get_product ──
    case "get_product": {
      const query = (args?.query || "").toLowerCase().trim();
      const product = PRODUCTS.find(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.slug === query ||
          p.cas === query ||
          p.name.toLowerCase().match(new RegExp(`\\b${query}\\b`))
      );
      if (!product) {
        return {
          content: [
            {
              type: "text",
              text: `No product found matching "${args.query}". Try a name (e.g., "DMC"), slug (e.g., "dimethyl-carbonate"), or CAS (e.g., "616-38-6").`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: [
              `**${product.name}**`,
              `CAS: ${product.cas}`,
              `Category: ${product.category}`,
              `Grades: ${product.grades.join(", ")}`,
              `Page: ${product.page}`,
              `URL: https://www.carmelsolv.com/${product.page}`,
            ].join("\n"),
          },
        ],
      };
    }

    // ── list_products ──
    case "list_products": {
      const text = PRODUCTS.map(
        (p, i) =>
          `${i + 1}. **${p.name}** — CAS ${p.cas}, ${p.grades.join(" / ")}, \`${p.page}\``
      ).join("\n");
      return {
        content: [{ type: "text", text: `# Product Catalog (${PRODUCTS.length} products)\n\n${text}` }],
      };
    }

    // ── list_blog_posts ──
    case "list_blog_posts": {
      const posts = [
        { date: "2026-06-24", title: "Raw-Material Uncertainty in Battery Electrolyte Research", slug: "battery-electrolyte-uncertainty" },
        { date: "2026-06-20", title: "Food Ingredient Supplier Qualification — Compliance & Risk", slug: "supplier-qualification-compliance-risk" },
        { date: "2026-06-17", title: "Epoxy Flooring & Tool Cleaning — Solvent Solutions", slug: "epoxy-flooring-tool-cleaning" },
        { date: "2026-05-20", title: "Oleochemicals — Building Blocks of Modern Formulations", slug: "building-blocks-modern-formulations" },
        { date: "2026-05-15", title: "Functional Textiles — From Innovation to Industrialization", slug: "innovation-to-industrialization" },
        { date: "2026-05-10", title: "Evaluating NMP and Processing Materials", slug: "evaluating-nmp-processing-materials" },
        { date: "2026-05-05", title: "When a COA Isn't Enough — Fit-for-Purpose Verification", slug: "coa-fit-for-purpose" },
        { date: "2026-05-01", title: "Bridging Research and Reality in Textile Innovation", slug: "bridging-research-reality" },
        { date: "2026-04-30", title: "Why Functional Textile Projects Fail to Scale Up", slug: "functional-textile-scale-up" },
        { date: "2026-04-24", title: "Direct China-India Propylene Glycol Supply", slug: "direct-china-india-propylene-glycol" },
        { date: "2026-04-17", title: "Ingredient Validation — Making the Right Material Decisions", slug: "ingredient-validation" },
        { date: "2026-04-10", title: "Managing Batch Variance in UV-Curable Protective Coatings", slug: "uv-batch-variance" },
        { date: "2026-04-03", title: "Propylene Glycol Formulation Design", slug: "propylene-glycol-formulation-design" },
        { date: "2026-03-30", title: "Propylene Carbonate — A Versatile Solvent for Modern Formulations", slug: "propylene-carbonate-formulation" },
        { date: "2026-02-23", title: "Why Supply Stability Matters More Than Price", slug: "supply-stability" },
        { date: "2026-02-18", title: "Reflections on the American Coatings Show 2026", slug: "american-coatings-show-2026" },
        { date: "2026-01-20", title: "Introducing the Spot Stock Allocation Program", slug: "ssap_article" },
      ];
      const text = posts
        .map((p) => `- **${p.date}** — ${p.title} (\`blog/${p.slug}.html\`)`)
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: `# Blog Posts (${posts.length} published, newest first)\n\n${text}\n\nNote: Also includes \`blog/where-to-start.html\` (orientation post). Total: 21 HTML files in blog/.`,
          },
        ],
      };
    }

    // ── blog_template ──
    case "blog_template": {
      const kicker = args?.kicker_type || "Technical Deep-Dive";
      const text = `# Blog Post Template — "${kicker}"

## File: \`blog/{slug}.html\`

### Step 1: Copy an existing post
Copy the cleanest recent post (e.g., \`battery-electrolyte-uncertainty.html\`) to a new slug.

### Step 2: Update <head> metadata
\`\`\`html
<title>Post Title | CARMELSOLV™</title>
<meta name="description" content="1-2 sentence summary. Keep under 160 chars.">
<link rel="canonical" href="https://www.carmelsolv.com/blog/{slug}.html">

<meta property="og:title" content="Post Title | CARMELSOLV™">
<meta property="og:description" content="Same summary.">
<meta property="og:url" content="https://www.carmelsolv.com/blog/{slug}.html">
<meta property="og:image" content="https://www.carmelsolv.com/images/{image-name}">
<meta name="twitter:card" content="summary_large_image">
\`\`\`

### Step 3: Update BlogPosting schema
- datePublished: "2026-MM-DD" (back-dated — continue the fictional cadence)
- dateModified: same as datePublished
- headline: full post headline
- image: same as og:image

### Step 4: Update BreadcrumbList schema
- position 3: name = post title, item = full URL

### Step 5: Update Hero
\`\`\`html
<header class="article-hero">
  <div class="container">
    <div class="breadcrumb"><a href="../index.html">Home</a> › <a href="index.html">Blog</a> › Post Title</div>
    <div class="article-kicker">${kicker}</div>
    <h1>Full Post Headline</h1>
    <p class="article-deck">1-2 sentence deck/subtitle.</p>
    <div class="article-meta">
      <span>Month DD, 2026</span>
      <span>CARMELSOLV™</span>
      <span>X min read</span>
    </div>
  </div>
</header>
\`\`\`

### Step 6: Update TOC
- Match each <a href="#section-id"> to a section's id

### Step 7: Update article body
- Each section: \`<section id="section-id" aria-labelledby="section-id-title">\`
- First section gets \`<div class="intro-lede">\` with bold key takeaway

### Step 8: Unique form ID
- Set unique id on \`.cta-box\` (e.g., \`{slug-prefix}-cta\`)
- Update floating quote pill \`href\` and IntersectionObserver \`querySelector\`

### Step 9: Add to blog/index.html
- New card at top of \`.blog-list\` (newest first):
\`\`\`html
<article class="blog-card">
  <div class="blog-date">Month DD, 2026</div>
  <h2><a href="{slug}.html">Post Title</a></h2>
  <p>1-2 sentence excerpt.</p>
  <a href="{slug}.html" class="blog-read">Read article →</a>
</article>
\`\`\`

### Checklist
- [ ] <title>, <meta description>, <link canonical>
- [ ] OG tags (title, description, url, image)
- [ ] BlogPosting schema (datePublished, dateModified, headline)
- [ ] BreadcrumbList schema (position 3)
- [ ] Hero: breadcrumb, kicker, H1, deck, date, read time
- [ ] TOC: section links match section ids
- [ ] Author card: name, role, LinkedIn URL
- [ ] Contact form: unique id on .cta-box
- [ ] Quote pill: href matches form id, observer target matches
- [ ] Blog listing: new card at top of blog/index.html
- [ ] All ids match between TOC links and section ids

### Brand Rules
- Body copy: "CarmelSolv"
- Chrome (footer, author card, hero span): "CARMELSOLV™" / "Carmel Solvents Supply LLC"
- Dates: back-dated, not today's date
- Shared Formspree endpoint: https://formspree.io/f/xnjwgzdz`;

      return {
        content: [{ type: "text", text }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ─── Start ──────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CARMELSOLV MCP server running on stdio");
}

main().catch((err) => {
  console.error("MCP server fatal error:", err);
  process.exit(1);
});
