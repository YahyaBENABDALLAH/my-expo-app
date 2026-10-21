# Header vector artwork

Original smoke, water and rain SVGs, using `currentColor` for tint. These are
static snapshots at time zero of the production vector geometry in
`src/components/ui/page/page-header-shapes.ts` and `page-header-details.ts`.
The app builds the animated Skia paths and native SVG blur mask from those
shared numeric commands. Smoke adds curls and soft wisps, water adds fluid
swells and highlights, rain adds falling drops and spreading impact ripples.
Choose the live effect in Settings → Appearance → Header motion.
