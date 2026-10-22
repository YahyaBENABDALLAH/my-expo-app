# Bundled assets

## Header vector artwork

Original smoke, water and rain SVGs, using `currentColor` for tint. These are
static snapshots at time zero of the production vector geometry in
`src/components/ui/page/page-header-shapes.ts` and `page-header-details.ts`.
The app builds the animated Skia paths and native SVG blur mask from those
shared numeric commands. Smoke adds curls and soft wisps, water adds fluid
swells and highlights, rain adds falling drops and spreading impact ripples.
Choose the live effect in Settings → Appearance → Header motion.

## Recipe example images

These three 800-pixel JPEGs are bundled with the sample Home cards, so the previews do not fetch images while scrolling. Combined download size is approximately 294 KB. The example titles describe the pictured dishes; the cards are sample data, not API recipe records.

Photo sources:

- [Avocado and egg toast](https://images.unsplash.com/photo-1525351484163-7529414344d8?fm=jpg&fit=crop&w=800&q=72)
- [Chickpea and vegetable salad](https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fm=jpg&fit=crop&w=800&q=72)
- [Pesto pasta](https://images.unsplash.com/photo-1473093295043-cdd812d0e601?fm=jpg&fit=crop&w=800&q=72)
