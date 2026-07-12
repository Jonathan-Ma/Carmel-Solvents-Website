# Blog Format Documentation

## File Structure

Each blog post is a standalone HTML file in `/blog/` sharing the same layout template. All rem-based responsive design with floating TOC sidebar, author card, and contact form.

## Quick Start — New Post

1. Copy any existing blog (e.g., `supply-stability.html`)
2. Update the 3 metadata sections below
3. Replace the hero, TOC, and article body content
4. Add a card to `blog/index.html` (newest first)

## Required Metadata

### 1. `<head>` tags (lines 17–28)

```html
<title>Post Title | CARMELSOLV™</title>
<meta name="description" content="1–2 sentence summary. Keep under 160 chars. Include primary keyword.">
<link rel="canonical" href="https://carmelsolv.com/blog/post-slug.html">

<meta property="og:title" content="Post Title | CARMELSOLV™">
<meta property="og:description" content="Same summary for social previews.">
<meta property="og:url" content="https://carmelsolv.com/blog/post-slug.html">
<meta property="og:image" content="https://carmelsolv.com/images/...">
<meta name="twitter:card" content="summary_large_image">
```

### 2. BlogPosting Schema (lines 30–57)

```json
{
  "@type": "BlogPosting",
  "mainEntityOfPage": { "@id": "https://carmelsolv.com/blog/post-slug.html" },
  "headline": "Full post headline",
  "description": "Full description for schema",
  "image": "https://carmelsolv.com/images/...",
  "datePublished": "2025-MM-DD",
  "dateModified": "2025-MM-DD",
  "author": { "@type": "Organization", "name": "CARMELSOLV" },
  "publisher": { ... }
}
```

### 3. BreadcrumbList Schema (lines 59–70)

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://carmelsolv.com/" },
    { "position": 2, "name": "Blog", "item": "https://carmelsolv.com/blog/" },
    { "position": 3, "name": "Post Title", "item": "https://carmelsolv.com/blog/post-slug.html" }
  ]
}
```

## Hero Section

```html
<header class="article-hero">
  <div class="container">
    <div class="breadcrumb"><a href="../index.html">Home</a> › <a href="index.html">Blog</a> › Post Title</div>
    <div class="article-kicker">Category Label</div>
    <h1>Full Post Headline</h1>
    <p class="article-deck">Subtitle / deck — 1–2 sentences expanding on the title.</p>
    <div class="article-meta" aria-label="Article information">
      <span>Month DD, 2025</span>
      <span>CARMELSOLV™</span>
      <span>X min read</span>
    </div>
  </div>
</header>
```

## Article Shell (TOC + Content Grid)

The main layout uses a CSS Grid with two columns:

```html
<div class="article-shell">
  <!-- Left column: sticky TOC + Author Card -->
  <div style="position:sticky;top:5.75rem;grid-column:1;grid-row:1 / 3;">
    <aside class="toc-card" style="position:static;top:auto;padding:1.125rem;">
      <h2 id="toc-title">On this page</h2>
      <ol>
        <li><a href="#section-id">Section Label</a></li>
        ...
      </ol>
    </aside>

    <div class="author-card-premium" style="margin:1.125rem 0 0;padding:1.25rem;border-radius:1rem;">
      <div>
        <div class="author-name">Written by Biao Wu</div>
        <div class="author-role">Founder, Carmel Solvents Supply LLC</div>
      </div>
      <a href="https://www.linkedin.com/in/biao-wu-8708ba40b/" class="pill-link" target="_blank" rel="noopener">LinkedIn →</a>
    </div>
  </div>

  <!-- Right column: main article -->
  <main class="article-content" style="grid-column:2;grid-row:1 / 3;">
    <article class="article-body">
      <!-- sections go here -->
    </article>
  </main>
</div>
```

## Article Body

Each content section follows this pattern:

```html
<section id="section-id" aria-labelledby="section-id-title">
  <h2 id="section-id-title">Section Heading</h2>
  <p>Content paragraph.</p>
  <ul>
    <li>Bullet point</li>
  </ul>
</section>
```

### Intro lede (first section only)

```html
<section id="overview" aria-labelledby="overview-title">
  <div class="intro-lede">
    <p><strong>Key takeaway in bold:</strong> supporting text.</p>
  </div>
  <p>Additional overview content.</p>
</section>
```

## Contact Form (last section)

Every blog ends with the same Formspree contact form:

```html
<section id="last-section" aria-labelledby="last-section-title">
  <h2 id="last-section-title">Section Heading</h2>
  <p>Closing content before the form.</p>

  <div class="cta-box" id="unique-form-id">
    <h2>Request a Quote</h2>
    <p>Tell us what you need and we'll get back to you with pricing, specs, and availability.</p>
    <form action="https://formspree.io/f/xnjwgzdz" method="POST" class="contact-form">
      <!-- Name, Company, Email, Phone, Product select, Message textarea, Submit button -->
    </form>
  </div>
</section>
```

**Important:** The `id` on `.cta-box` must be unique per blog (e.g., `#ssap-form`, `#supply-cta`, `#pc-cta`).

## Floating Quote Pill

```html
<a href="#unique-form-id" class="quote-pill" id="floating-quote-pill">Request a Quote</a>

<script>
(function () {
  var pill = document.getElementById('floating-quote-pill');
  var cta = document.querySelector('#unique-form-id');
  if (!pill || !cta) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      pill.style.opacity = entry.isIntersecting ? '0' : '1';
      pill.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      pill.style.transition = 'opacity 0.25s ease';
    });
  }, { threshold: 0 });
  observer.observe(cta);
})();
</script>
```

The pill:
- Floats fixed at bottom-right
- Scrolls to the form when clicked (`href` must match the form's `id`)
- Fades out when the form scrolls into view (IntersectionObserver)
- Fades back in when scrolling up

## Responsive Breakpoints

| Width | Layout |
|-------|--------|
| **>66.25em (1060px)** | Full: wide left padding, 13.75rem TOC column, 2 columns |
| **56.25em–66.25em (900–1060px)** | Mid: reduced left padding, narrower TOC (11rem), still 2 columns |
| **40em–56.25em (640–900px)** | Tablet: tight TOC (10rem), smaller fonts, 2 columns |
| **<40em (640px)** | Mobile: `display: block` — TOC + author card stacked above article, pill-link TOC items |
| **<35em (560px)** | Small mobile: single-column TOC links, tightened padding |

## Blog Listing (`index.html`)

Add new posts at the top of `<div class="blog-list">`:

```html
<article class="blog-card">
  <div class="blog-date">Month DD, 2025</div>
  <h2><a href="post-slug.html">Post Title</a></h2>
  <p>1–2 sentence excerpt for the listing card.</p>
  <a href="post-slug.html" class="blog-read">Read article →</a>
</article>
```

## Design Tokens (rem-based)

All layout values use rem (1rem = 16px). Only these stay as px:
- `1px` borders (hairline rendering)
- `0px` in `calc()`
- `1px`/`2px` transforms and text-decoration (sub-pixel decorative)
- `1px` `.sr-only` accessibility class

## CSS Variables (page-scoped)

```css
--ssap-navy: #0D1F3C;
--ssap-gold: var(--accent, #C8922A);
--ssap-card: var(--bg-card, rgba(255,255,255,0.04));
--ssap-border: var(--border, rgba(255,255,255,0.12));
--ssap-text: var(--text-secondary, #b8c1d1);
--ssap-muted: var(--text-muted, #7f8ca3);
--ssap-white: var(--white, #ffffff);
--ssap-radius: var(--radius, 0.875rem);
```

## Checklist for New Post

- [ ] `<title>`, `<meta description>`, `<link canonical>`
- [ ] OG tags (`og:title`, `og:description`, `og:url`, `og:image`)
- [ ] BlogPosting schema (`datePublished`, `dateModified`, `headline`)
- [ ] BreadcrumbList schema (position 3 name and item)
- [ ] Hero: breadcrumb, kicker, H1, deck, date, read time
- [ ] TOC: section links match section `id`s
- [ ] Author card: name, role, LinkedIn URL
- [ ] Contact form: unique `id` on `.cta-box`
- [ ] Quote pill: `href` matches form `id`, observer target matches
- [ ] Blog listing: new card at top of `blog/index.html`
- [ ] All `id`s match between TOC links and section `id`s
