# Website #2 — CarePoint Clinic (DHA Lahore)

Part of Abdullah's **100 Websites** series. Category: Health & Medical → General physician clinic.
Features per plan: Services, Timings, Online appointment.

Multi-page static website — every page is its own file, with real images.

## Structure

```
02-general-physician/
├── index.html        → Home (hero, services, about teaser, stats, doctors, reviews)
├── about.html        → Our story, values, clinic gallery, stats
├── services.html     → All 6 services with photos & PKR prices + "also treated" list
├── doctors.html      → 3 physician profiles with OPD timings
├── appointment.html  → Booking form → confirms on WhatsApp (prefill via ?s= / ?d=)
├── contact.html      → Contact cards, map, OPD hours, FAQ
├── css/
│   └── style.css     → Shared design for all pages (responsive, animations)
├── js/
│   └── script.js     → Shared JS (nav, reveal, counters, FAQ, testimonials, booking form)
├── images/           → All photos used by the pages (12 images)
├── gen_part1.py      → Page generator (shared templates, index + about)
└── gen_part2.py      → Page generator (services, doctors, appointment, contact)
```

Regenerate pages after editing the generators: `python3 gen_part2.py`

No build step, no backend. Upload the folder to any hosting (or push to GitHub)
and open `index.html`. Fonts load from Google Fonts CDN; everything else is local.

## Nice touches
- "Book" on any service opens `appointment.html` with that service pre-selected
  (`?s=`), and doctor cards pre-select the doctor (`?d=`).
- Booking form validates name/phone/date/time, then opens WhatsApp with a
  pre-filled booking message to the clinic number.
- OPD timings shown in topbar, appointment sidebar, contact page and footer.
- Fully responsive; scroll-reveal animations; auto-rotating patient reviews.

## Before going live — replace the placeholders
- WhatsApp / phone number `+92 300 1234567` (links in all pages +
  `WA_NUMBER` in `js/script.js`)
- Clinic name, address, doctor names, prices — in the generator scripts
- Photos in `images/` are stock sample photos — swap with real clinic photos

Design: deep navy + medical blue + warm amber palette, Plus Jakarta Sans/Inter
typography — unique to this site (each of the 100 websites gets its own design).
Photos: free-to-use stock (see image-search provenance in build notes).
