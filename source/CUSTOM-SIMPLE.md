# Customized Gridea Pro + Simple

This build adds an independent `collection` article field, a Collections management page, `/collections/` and paginated `/collection/<id>/` routes. Blank membership creates no collection. Existing categories and tags remain independent. Simple's `tagsInArchives` setting suppresses `/tags/` output and its sitemap entry.

Simple includes friend links, complete keyword search, visible-text word counts, ranked related titles, five-line scrolling code previews, English comment controls, automatic Cusdis height, and theme settings for the new features. The existing Memos password is now a local theme setting.

Netlify deployments package an embedded Node function and upload it through the function digest API. The function uses Netlify Blobs with strongly consistent reads and conditional writes; count and IP eligibility commit together. IPs are HMAC-hashed, eligibility resets at midnight in the configured timezone, and counts persist across deployments. No Netlify credential is embedded in the public site or function bundle. Live deployment requires the user's existing Netlify credentials in Settings; it was not performed during implementation.

## Build

Use Go 1.25.5+, Node.js and Wails 2.12.0.

```sh
cd backend/internal/deploy/likes
npm ci
node build.cjs
node --test core.test.cjs
cd ../../../../
cd frontend
npm install --force
cd ..
wails build -m -nosyncgomod -o "Gridea Pro Simple.exe"
```

## Verification

```sh
go test ./backend/internal/engine ./backend/internal/repository ./backend/internal/deploy ./backend/internal/service ./backend/internal/facade
```

The renderer can also run without launching the GUI or migrating source files:

```sh
go run ./backend/cmd/render-site /path/to/blog
```

Verified: collection save/clear round trips; taxonomy preservation; collection pagination (5/5/2); shared-tag ranking and deduplicated fallback; visible word counts; Netlify function packaging/upload via mock API; concurrent duplicate IPs, multiple IPs and timezone rollover; browser search, code expansion and English Cusdis controls. Twelve unrelated source articles and the existing taxonomy, menu, comment and Memos data were byte-identical after regeneration.
