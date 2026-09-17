<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
## Pocket Ledger

Private, offline-first personal budget tracking. Every installation is independent: reads and writes go to IndexedDB first and no account is required.

## Structure

```text
src/
	app/                  App Router routes and global styles
	components/           Responsive shell, views, forms, and UI primitives
	lib/
		db.ts               Dexie schema and database singleton
		store.ts            Zustand state and optimistic local mutations
		sync.ts             Future Supabase sync adapter boundary
		types.ts            Local domain contracts and export format
		utils.ts            Formatting and shared helpers
public/
	manifest.webmanifest Install metadata
	icon.svg             Maskable app icon
```

## Local-first architecture

- Dexie is the source of truth for transactions, categories, budgets, and settings.
- Zustand hydrates once from Dexie and updates the UI immediately after local writes.
- Export/import uses a versioned JSON payload so future migrations can be explicit.
- `src/lib/sync.ts` is the seam for a future Supabase adapter and client-side encryption layer.
- `next-pwa` generates and registers the service worker during production builds.

## Cross-device sync

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel and local `.env.local`.
3. Open the cloud icon in Pocket Ledger on each device, enter the same private sync key, and choose `Save & push` on the source device.
4. Use `Refresh` on the other device to pull the shared vault into its local IndexedDB.

Sync is opt-in. The app remains usable offline when Supabase is unavailable; the sync key is the vault identifier, so keep it private.

## Next steps

The current interface is a complete local V1. Supabase credentials should only be introduced when the sync-key and encryption protocol is defined; local functionality does not depend on them.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# budget-ledger
>>>>>>> origin/main
