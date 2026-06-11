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

## Blog media

Set `BLOB_READ_WRITE_TOKEN` from a public Vercel Blob store to enable CMS image imports and uploads. Staff can paste a public Google Drive image link, confirm general access, and use **Import & optimize** to create responsive WebP files owned by the site.

Existing external blog images can be audited and migrated after building the API:

```bash
npm run media:migrate
npm run media:migrate -- --apply
```

The first command is a dry run. The apply command uploads successful conversions before updating MongoDB and reports images that need manual replacement.

## Translations

English, Hindi, and Bengali website copy is maintained in `floydee-website-translations.xlsx`.

```bash
npm run translations:import -- ./floydee-website-translations.xlsx
npm run typecheck
npm run build
```

Translators should edit the Hindi and Bengali columns in Google Sheets, export the result as `.xlsx`, and leave the key and English columns unchanged. The importer validates required translations, duplicate keys, source text, and interpolation placeholders before updating the generated website catalogs.
