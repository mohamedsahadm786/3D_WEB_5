# Content & Assets Reference

> **Purpose.** A complete record of (1) **every piece of written content** in
> this website and (2) the **image-asset system** — folder structure, naming,
> and what each slot is.
>
> **Why this file exists.** It is the hand-off document for spinning up a *new
> recreation project*. In the new repo you can:
> - drop in the existing `s
../images/` folder as-is and have Claude wire each
>   image to its slot just by reading the file names (see §6–§7);
> - see exactly which copy is placeholder text, so it can be swapped for the
>   new site's wording section by section.
>
> Companion files in this folder: `information.md` (full codebase overview),
> `recreation-rules.md` (how to recreate a site like this), `changes.md` (log).

---

## 1. Brand & contact details

| Field            | Value                                                        |
|------------------|--------------------------------------------------------------|
| Brand name       | **Luma** (a recreation of *Luma UAE* — `lumauae.com`)        |
| Sector           | Premium research peptide / supplement formulations          |
| Browser title    | `Luma — Premium Research Formulations`                       |
| Meta description | `Premium research formulations sourced from verified suppliers — consistency, purity, and reliability.` |
| Address          | Level 5, Dubai, UAE                                          |
| Email            | sales@lumauae.com                                            |
| Phone            | +971 54 380 0625                                             |
| WhatsApp         | `https://wa.me/971543800625`                                 |
| Social           | Facebook, Instagram (placeholder `#` links)                  |
| Copyright        | `© {current year} Luma. All Rights Reserved.`                |

---

## 2. Navigation

- **Header nav links:** Home, About Us, Products, Why Us, Testimonials, Contact
- **Header buttons:** "Buy Now" (→ `/shop`), cart icon, search icon
- **Section anchors:** `#home`, `#about`, `#products`, `#why-us`, `#testimonials`, `#contact`
- **Routes:** `/` (Home), `/shop` (Shop), `/product/:slug` (Product detail)

---

## 3. Home page copy — section by section

### 3.1 Hero (`#home`)
- **Eyebrow pill:** `High-Purity Research Peptides`
- **Headline (typewriter, rotates between two strings):**
  1. `Your Weight-Loss Journey Reinvented by Science`
  2. `Lab-Engineered Formulations for Your Biology`
- **Sub-paragraph:** `Our products are sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability.`
- **Buttons:** `Shop Products` (→ `/shop`), `Discover Luma` (→ `#about`)
- **Scroll cue text:** `Scroll`

### 3.2 Feature trio
Three feature cards (each: icon, title, text, index label `01 / 03` …) + one image tile.

| Title                  | Text                                                                                          |
|------------------------|-----------------------------------------------------------------------------------------------|
| Purity First           | Each product is checked thoroughly to maintain clean, high-quality formulations you can rely on. |
| Reliable Consistency   | Our controlled processes ensure every unit is produced with uniform standards for a dependable experience. |
| Secure Packaging       | Every product is sealed and protected to preserve freshness, stability, and overall product integrity. |

### 3.3 About (`#about`)
- **Oversized section label:** `About Us`
- **Eyebrow:** `Who We Are`
- **Heading:** `Advancing Modern Research with Smarter Formulations`
- **Stat counter:** counts up to `25+` — label `High-Purity Research Peptides`
- **Paragraph 1:** `Luma is committed to advancing high-quality peptide and supplement research through clean, reliable, and precisely developed formulations. Our goal is simple — to provide controlled, consistent, and easy-to-use products designed for structured research applications.`
- **Paragraph 2:** `Every formulation is created with a strong focus on purity, consistency, and safe handling practices, giving you the confidence to work with products that meet strict quality standards.`
- **Check items:** `Verified Suppliers`, `Sealed & Protected`, `Uniform Standards`

### 3.4 Marquee strip
Infinite scrolling slash-separated phrases:
`Premium Research Formulations` / `Fast WhatsApp Support` / `Trusted by Thousands` / `Customer-Focused Service` / `Easy WhatsApp Ordering` / `Precision in Every Product`

### 3.5 Products (`#products`)
- **Oversized section label:** `Our Products`
- **Heading:** `Research formulations packed with precision and care`
- **Link:** `View All Products` (→ `/shop`)
- Grid of all 8 product cards (see §5).

### 3.6 Why Us (`#why-us`)
- **Eyebrow:** `Why Choose Luma`
- **Statement heading:** `We deliver dependable, quality formulations with careful handling and supportive customer service.`
- **Flip circles** (front = title, back = description):

| Title              | Description                                                                          |
|--------------------|--------------------------------------------------------------------------------------|
| Consistent Results | Designed to keep your routine structured and support goal-focused progress.          |
| Verified Purity    | Sourced from manufacturers that follow strict testing, handling, and documentation standards. |
| Reliable Service   | Every step is designed to provide a smooth, dependable customer experience.          |
| Quick Support      | Fast WhatsApp assistance for queries, updates, and product guidance.                 |

### 3.7 Help / CTA
- **Eyebrow:** `Here to Guide You`
- **Heading:** `Let's Talk To` + `Get Instant Help` (second line greyed)
- **Paragraph:** `Transparent communication, every step of the way.`
- **Button:** `Chat on WhatsApp` (→ WhatsApp)

### 3.8 Testimonials (`#testimonials`)
- **Oversized section label:** `Testimonials`
- **Eyebrow:** `Trusted by Thousands`
- **Heading:** `What Our Customers Say`
- **Paragraph:** `Trusted feedback from people who choose Luma for purity and precision every time.`
- **Reviews (carousel):**

| Name          | Role                  | Quote                                                                                                            |
|---------------|-----------------------|------------------------------------------------------------------------------------------------------------------|
| Michael Reed  | Research Assistant    | Consistent products, clear guidance, and quick replies made the whole process simple and genuinely reassuring from start to finish. |
| Emily Carter  | Wellness Consultant   | Fast support and reliable formulations every time — ordering with Luma has been smooth, dependable, and refreshingly straightforward. |
| Sofia Bennett | Fitness Coordinator   | Everything arrived securely sealed, communication was excellent, and the overall service felt exactly like a premium brand should. |

### 3.9 Contact (`#contact`)
- **Contact details:** `Level 5, Dubai, UAE` · `sales@lumauae.com` · `+971 54 380 0625`
- **Heading:** `Get in Touch`
- **Paragraph:** `Reach out anytime for product details, order help, or personalised assistance — we're here to support you smoothly.`
- **Button:** `Chat With Us` (→ WhatsApp)

---

## 4. Other pages & shared copy

### 4.1 Footer
- **Eyebrow:** `Here to Help You Anytime`
- **Address / phone / email:** `Level 5, Dubai, UAE` · `+971 54 380 0625` · `sales@lumauae.com`
- **Button:** `Start Your Order` (→ `/shop`)
- **Quick Links column:** Home, About Us, Products, Why Us, Testimonials, Contact
- **Newsletter:** eyebrow `Get Latest Offers`; heading `Don't miss the latest offers`;
  text `Be the first to know about new products, promotions, and store updates from Luma.`;
  input placeholder `Enter your email`; success state `Subscribed — thank you`
- **Social links:** `Facebook`, `Instagram`
- **Bottom bar:** `© {year} Luma. All Rights Reserved.` · `Recreation build — placeholder assets.`
- **Background watermark:** giant faint `Luma` text

### 4.2 Shop page (`/shop`)
- **Breadcrumb:** `Home / Shop`
- **Heading:** `All Products`
- **Intro:** `{count} research formulations — sourced from verified suppliers and packed with precision.`
- Grid of all 8 product cards.

### 4.3 Product detail page (`/product/:slug`)
- **Breadcrumb:** `Home / Shop / {product name}`
- **Tag:** `Research Formulation`
- **Heading:** the product name
- **Price:** the product price, or `Price on enquiry` when there is none
- **Rating:** 5 stars (static)
- **Description:** the product `blurb` (see §5)
- **Quantity stepper** + button: `Add to Cart` (priced) or `Enquire on WhatsApp` (no price)
- **Details accordion** (4 rows):

| Row      | Value                          |
|----------|--------------------------------|
| Form     | Lyophilised powder             |
| Purity   | Verified — third-party tested  |
| Storage  | Cool, dry, away from light     |
| Handling | Sealed & protected packaging   |

- **Related block heading:** `You May Also Like` (4 other products)
- **Not-found state:** `Product not found` + `Back to Shop` button

### 4.4 Product card (hover)
- Hover action button: **`Enquire`** (same for every product) + a wishlist heart icon.

---

## 5. Product catalogue (8 items)

Data lives in `src/lib/products.ts`. Each product: `slug`, `name`, `price`
(string or `null` = "enquire"), `tint` (placeholder gradient colours), `blurb`.
Prices are in AED (`د.إ`).

| # | Slug                    | Name                  | Price          | Blurb |
|---|-------------------------|-----------------------|----------------|-------|
| 1 | `bpc-157-tb-500-40mg`   | BPC-157 & TB-500 40mg | د.إ 999.00     | A dual research blend prepared under controlled conditions for consistent, reliable handling. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 2 | `nad-1000mg`            | NAD+ 1,000mg          | — (enquire)    | NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications. |
| 3 | `glow-70mg`             | Glow 70mg             | د.إ 1,199.00   | A higher-capacity formulation packed securely to preserve freshness and stability. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 4 | `retatrutide-20mg`      | Retatrutide 20mg      | — (enquire)    | Developed with a strong focus on purity, consistency, and safe handling practices. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 5 | `retatrutide-40mg`      | Retatrutide 40mg      | د.إ 1,990.00   | A research formulation produced with uniform standards for a dependable experience. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 6 | `tirzepatide-20mg`      | Tirzepatide 20mg      | — (enquire)    | Checked thoroughly to maintain clean, high-quality formulations you can rely on. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 7 | `tirzepatide-40mg`      | Tirzepatide 40mg      | — (enquire)    | Sealed and protected to preserve overall product integrity through delivery. Sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |
| 8 | `tirzepatide-5mg`       | Tirzepatide 5mg       | — (enquire)    | A starter-scale formulation sourced from verified suppliers and carefully packed to ensure consistency, purity, and reliability. |

> The **slug** is the single source of truth: it drives the URL
> (`/product/<slug>`) **and** the image file names (see §6). Renaming a product
> means changing the slug *and* renaming its image files to match.

---

## 6. Image asset system — how it works

The whole site loads real images from one place: **`src/images/`**, organised
into one sub-folder per section. There is no manual import list.

**Resolver — `src/lib/images.ts`:** `import.meta.glob` eagerly imports every
file under `src/images/**`. It builds a lookup keyed by `"<folder>/<name>"`
**without the extension**, lower-cased.

**`<Img>` component — `src/components/Img.tsx`:** given `name="folder/name"`
(no extension) it renders:
- the real photo if a matching file exists;
- a looping muted `<video>` if the file is a video;
- a sized grey `<Placeholder>` if no file exists yet.
Props: `fit` (`cover` | `contain`), `rounded`, `tint`, `fallback`, `className`.

**Naming rules:**
- Lower-case, no spaces, exact name from the tables in §7.
- The **extension may be anything** supported — only the name must match.
- Supported: `png, jpg, jpeg, webp, avif, svg` (images) and `mp4, webm, mov`
  (videos — they autoplay, muted, looping).
- Drop a correctly-named file in the folder → it appears, **no code change**.
  Remove it → the placeholder returns.

---

## 7. Image folders — what goes where

One folder per area. To place an image, save it into the folder with the
exact name below (any supported extension).

### `logo/`
| Name        | Used for                              | Notes |
|-------------|---------------------------------------|-------|
| `site-logo` | Header, footer, and search-bar logo   | If absent, a `LUMA` wordmark shows. Transparent PNG/SVG best. |

### `hero/` — home page top section
| Name                          | Used for                                | Notes |
|--------------------------------|------------------------------------------|-------|
| `home-hero-background-image`   | Full-bleed parallax background of the hero | Wide / landscape, dark. |
| `home-hero-product-image`      | Floating product render on the right     | PNG with transparency ideal. |

### `about/` — About section
Three media items that **cycle clockwise** through the three About tiles. Each
may be an image **or a video** (`.mp4` / `.webm` / `.mov` autoplay muted loop).
| Name                       | Used for          |
|----------------------------|-------------------|
| `video`                    | Cycling media #1  |
| `home-about-stat-image`    | Cycling media #2  |
| `home-about-small-image`   | Cycling media #3  |

### `testimonials/` — testimonial avatars
Square images, shown inside a circle.
| Name                              | Person        |
|-----------------------------------|---------------|
| `home-testimonial-michael-reed`   | Michael Reed  |
| `home-testimonial-emily-carter`   | Emily Carter  |
| `home-testimonial-sofia-bennett`  | Sofia Bennett |

### `extra/` — images used across the page
| Name  | Used for                                                  |
|-------|-----------------------------------------------------------|
| `E_1` | Image tile in the Features row (below the hero)           |
| `E_2` | Full-bleed background of the "Let's Talk To" CTA section  |
| `E_3` | Full-width banner image in the "Get in Touch" section     |

### `products/` — one image per product
One file per product, named exactly after the **slug** (see §5). Shown on the
Shop grid, the Products section, the Product page, and search results.
Current products are **3:2 landscape** photos (e.g. 2048×1368, 4500×3000).

`bpc-157-tb-500-40mg` · `nad-1000mg` · `glow-70mg` · `retatrutide-20mg` ·
`retatrutide-40mg` · `tirzepatide-20mg` · `tirzepatide-40mg` · `tirzepatide-5mg`

### `product-gallery/` — 4 thumbnails per product
On a product page the main image has **4 thumbnails** below it; clicking one
flips the main image. Four files per product, named `<slug>_1` … `<slug>_4`
(32 files for 8 products). Same 3:2 landscape ratio as `products/`.

Example for BPC-157: `bpc-157-tb-500-40mg_1`, `_2`, `_3`, `_4`.

---

## 8. Placing images in a new recreation project

When the `src/images/` folder is copied into a new repo:

1. **Keep the folder structure** (`logo/ hero/ about/ testimonials/ extra/
   products/ product-gallery/`) — the resolver and every `<Img>` slot depend
   on these folder names.
2. **Match file names to slots** using the tables in §7. The name (not the
   extension) is what matters.
3. If the new site has **different products**, rename the `products/` and
   `product-gallery/` files to the new slugs, and update `src/lib/products.ts`
   so its `slug` values match the file names.
4. Any slot with no file just shows a grey placeholder — nothing breaks, so
   images can be filled in gradually.
5. Product images look best as a **consistent aspect ratio** (this build uses
   3:2 landscape; the product gallery is `aspect-[3/2]` with `fit="contain"`).
