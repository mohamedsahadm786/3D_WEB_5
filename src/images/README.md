# Images — drop your photos here

This is the **only** place you need to touch to add real photos.
Each file name describes exactly which slot it fills, so you always know
what you're replacing.

## How to replace a dummy with your real photo

Right now every slot holds a **dummy image** (a copy of one product photo).
To put your real photo in:

1. Open the folder, e.g. `src/images/hero/`.
2. Note the file name there, e.g. `home-hero-product-image.webp`.
3. **Delete that dummy file.**
4. Add your real photo and rename it to the **same name** (extension can
   differ — `.jpg`, `.png`, `.webp` all work, e.g. `home-hero-product-image.jpg`).
5. Save. Done — no code changes, ever.

No file at all? A grey placeholder shows instead, so nothing breaks.

## Every slot

### `logo/`
| File name    | Where it shows                              |
|--------------|---------------------------------------------|
| `site-logo`  | Header / footer / search bar logo. *(No dummy — the "LUMA" wordmark shows until you add this.)* |

### `hero/` — home page, top section
| File name                     | Where it shows                          |
|--------------------------------|-----------------------------------------|
| `home-hero-product-image`      | The floating product image on the right |
| `home-hero-background-image`   | The full background behind the hero     |

### `about/` — home page, About Us section
The three media below cycle clockwise through the three About tiles.
A file can be an image **or** a video (`.mp4`, `.webm`, `.mov`) — videos
autoplay, muted and looping.

| File name                  | Where it shows                              |
|----------------------------|---------------------------------------------|
| `video`                    | Cycling media #1 (currently a video)        |
| `home-about-stat-image`    | Cycling media #2                            |
| `home-about-small-image`   | Cycling media #3                            |

### `testimonials/` — home page, Testimonials section
| File name                          | Where it shows           |
|-------------------------------------|--------------------------|
| `home-testimonial-michael-reed`     | Michael Reed's photo     |
| `home-testimonial-emily-carter`     | Emily Carter's photo     |
| `home-testimonial-sofia-bennett`    | Sofia Bennett's photo    |

### `extra/` — extra images used across the page
| File name | Where it shows                                            |
|-----------|-----------------------------------------------------------|
| `E_1`     | The image tile in the Features row (below the hero)       |
| `E_2`     | Full-bleed background of the "Let's Talk To" CTA section  |
| `E_3`     | The full-width banner image in the "Get in Touch" section |

### `products/` — one image per product (shop, home, product & search pages)
Named after each product. Square images (~1000×1000) look best.

| File name                  | Product                |
|----------------------------|------------------------|
| `bpc-157-tb-500-40mg`      | BPC-157 & TB-500 40mg  |
| `glow-5mg`                 | Glow 5mg               |
| `glow-70mg`                | Glow 70mg              |
| `retatrutide-20mg`         | Retatrutide 20mg       |
| `retatrutide-40mg`         | Retatrutide 40mg       |
| `tirzepatide-20mg`         | Tirzepatide 20mg       |
| `tirzepatide-40mg`         | Tirzepatide 40mg       |
| `tirzepatide-5mg`          | Tirzepatide 5mg        |

> Note: the raw uploads `bpcfrontnew.png`, `nadfront.png`, `retafrontnew.png`,
> `retatrutide40mgfront.webp`, `Retatrutide-5MG-With-Pen-1-p-3200.jpg`,
> `richbrownglownew.png` are still in `products/` but their names don't match
> any slot, so they are unused. To use one, rename it to the matching product
> name above (and delete that product's dummy `.webp`).

### `product-gallery/` — the 4 thumbnail images per product
On a product page, the main image has **4 thumbnails** below it; clicking a
thumbnail swaps the main image. Each product has 4 gallery files named
`<product>_1` … `<product>_4` (32 files in total).

Example for Glow 5mg: `glow-5mg_1`, `glow-5mg_2`, `glow-5mg_3`, `glow-5mg_4`.
Do the same for every product name listed in `products/` above.

## Tips

- Use simple lowercase names, no spaces.
- Keep the exact name from the tables above — only the extension may change.
- Delete the old dummy file when you add your real one (same name = conflict).
