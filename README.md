# Creative Concepts

Marketing site for **Creative Concepts** — an interior &amp; exterior design studio based in Andheri West, Mumbai.

A static, mobile-first site built with Tailwind (CDN) + GSAP. Editorial "elevated minimalism" theme: Libre Caslon Text headlines, Hanken Grotesk body, midnight/steel-blue palette drawn from the studio logo.

## Pages
- `index.html` — Home (hero, practice, selected works, disciplines, journal, testimonials)
- `about.html` — Studio, services, stats, testimonials
- `portfolio.html` — Filterable project gallery (Interior / Exterior / Commercial)
- `contact.html` — Contact details, map, working enquiry form, FAQ

## Assets
- `assets/site.css`, `assets/site.js` — shared theme + behaviour (loader, mobile menu, scroll reveals, marquee, portfolio filter, hero WebGL)
- `assets/logo.png`, `assets/projects/*` — brand mark and real project photography

## Run locally
```
python -m http.server 5500
```
Then open http://localhost:5500

## Notes
- The contact form posts to FormSubmit; the recipient must confirm the address once on first submission.
- Built from the studio's existing content and project photography.
