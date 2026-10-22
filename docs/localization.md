# Localization

App translations live in `src/shared/locales/fr.json`, `en.json`, and `ar.json`. They preserve the keys and translations from `reference/shared/locales`, with additional namespaces for this app's screens and controls. Use `useTranslation().t()` in rendered components. Keep route names, form field names, enum values, brands, and test selectors independent of the language.

French is the default. Login's top-left language icon opens a native sheet with Français, English, and العربية. The language picker is also available in More's profile preferences. Both use the existing language provider and save the choice under the reference-compatible `appLanguage` storage key. Startup waits for that preference before dismissing the launch overlay. Failed storage reads use French; failed writes leave the selected language usable for the current session.

Arabic selects RTL through the existing layout direction provider. Changes preserve navigation, query caches, and drafts. French and English select LTR. The separate direction switch is available in native Storybook for layout previews. Arabic authentication headings use the system font for script support. No app reload or new dependency is required.

Custom validation messages store translation keys and translate when displayed. Zod's built-in messages use its current locale. API requests send the selected `Accept-Language`; app-owned failures use the dictionaries. Server responses and user-authored recipe content remain the server's responsibility.

Run `npm run check` for TypeScript, lint and formatting. Automated suites have been removed; existing test IDs remain for future tests. Check language switching, persistence, RTL, draft preservation and request language manually. Verify French, English and Arabic on iOS and Android, then restore the desired language.
