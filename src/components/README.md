# Components

[ui/](ui/README.md) owns shared iOS and Android presentation. Open its guide to
find a component; each component family has its own folder and README.

Screens import the public API:

```tsx
import { PageScreen, UniversalButtonContent } from '@components/ui';
```

Keep a component's platform files, props and private helpers beside it.
Use one folder for a closely related family such as page layout or form fields.
Avoid extra folder levels and barrels.

UI implementations import concrete component files directly. Feature screens,
workflow state, queries and mutations belong in `src/features/`; routes belong
in `src/app/`. A fragment used by only one feature stays with that feature.

The [UI guide](ui/README.md) documents imports, native composition, stories and
checks. The [architecture guide](../../docs/architecture.md) describes the rest
of the app.
