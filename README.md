# Floydee Foundation Website

TypeScript MERN platform scaffold for Floydee Future Foundation.

## Workspaces

- `apps/web` - React + Vite website
- `apps/api` - Express API with MongoDB connection scaffold
- `packages/shared` - shared TypeScript types

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Copy `.env.example` to local `.env` files as needed before enabling Mongo-backed features.

## Translations

English, Hindi, and Bengali website copy is maintained in `floydee-website-translations.xlsx`.

```bash
npm run translations:import -- ./floydee-website-translations.xlsx
npm run typecheck
npm run build
```

Translators should edit the Hindi and Bengali columns in Google Sheets, export the result as `.xlsx`, and leave the key and English columns unchanged. The importer validates required translations, duplicate keys, source text, and interpolation placeholders before updating the generated website catalogs.
