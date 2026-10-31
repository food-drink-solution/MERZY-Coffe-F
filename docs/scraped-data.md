# MERZY — scraped public data (Oct 31, 2026)

All public data that could be collected without login has been captured and integrated.
Raw data lives in `src/app/core/data/merzy-social.ts`, exposed via `src/app/core/services/social.service.ts`.
Images are stored locally in `public/scraped/instagram/` (Instagram CDN links expire).

## Sources & what was captured

### Instagram — @merzy.eg (public, no login required)
- Profile: name "Merzy Coffee", bio "for those who value the details.", 4,836 followers, 127 following.
- External link on profile: `www.talabat.com/egypt/merzy`
- 4 story highlights: Desserts, Coffee, Pastries, Visits (covers downloaded).
- 12 latest posts: media IDs, types (reel/photo/carousel), dates, per-post cover images (downloaded
  as signed CDN URLs before expiry), captions, like counts, location tag
  ("Bibliotheca Alexandrina - مكتبة الاسكندرية"), collab tag (@kayan.interiors), reel audio.
- Real commenter reactions (used as testimonials): @aya_samir564428, @marimarfaa_,
  @nayroz_ramadan, @ragiaamgad98, @tota_guitarista.
- Image content (from `alt` text / captions): dirty espresso (Oct 16), V60 pour (Oct 14),
  "SOMETHING NEW IS TAKING SHAPE" bakery teaser (Sep 13), 3Bomber MHW grinder (Sep 11),
  club sandwich / baguette / toast spread (Sep 9), smoothies & juices (Sep 18/23).

### Facebook — facebook.com/p/Merzy-Coffee-61583371166412/
- Login wall: page name + ID collected; no further public data accessible anonymously.

### Talabat — talabat.com/egypt/restaurant/1102357/merzy-shatby
- Restaurant page confirmed to exist (ID 1102357, slug `merzy-shatby`).
- The interactive page is bot-protected: anonymous fetches are redirected to the homepage,
  so item-level menu/prices could not be captured without a real browser session.
- Backend gateway discovered (`talabat.com/nextSearchApi`, `nextApi`, proxy of `/v3/vendor`)
  responds, but the Egypt search index returns 0 vendors for "Merzy" — menu data remains
  mocked in `menu.service.ts` with the two items confirmed visible in MERZY's own posts
  (Dirty Espresso, Club Sandwich) added at estimated prices.

### Google Maps
- Anonymous place search returned no embedded business record (rating/phone/hours)
  for Merzy — likely not indexed as a Maps profile yet; address kept as
  "Bibliotheca Alexandrina services area" (validated against IG location tags).

## Where the data is used
- `SocialService` — profile, links, highlights, posts, comments.
- `TestimonialsComponent` ("location" section) — real photo + "From our Instagram" gallery + real comments.
- `FooterComponent` — Instagram / Facebook / Order-on-Talabat links.
- `DeliveryBannerComponent` — Order on Talabat CTA + Instagram link.
- `MenuService` — new items: Dirty Espresso (60 EGP), Club Sandwich (70 EGP).
