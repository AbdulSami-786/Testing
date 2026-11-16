# EWD Dashboard

Billing, party ledgers, stock, cheques, suppliers, employees and reports for a
trading shop. Data is stored in a **Google Sheet** through a Google Apps Script
Web App, so the website and the Windows program share the same data and users.

- `src/` – React + Vite front end
- `apps-script/` – the backend (`Code.gs`) that runs inside the Google Sheet. Setup: [apps-script/SETUP.md](apps-script/SETUP.md)
- `electron/` – Windows desktop wrapper
- `scripts/pack-win.mjs` – builds the desktop program into `release/` and zips it

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## Point the app at a Google Sheet

Deploy `apps-script/Code.gs` from the sheet (Extensions → Apps Script → Deploy →
Web app, *Execute as: Me*, *Access: Anyone*), then paste the `/exec` URL into
`SCRIPT_URL` in [src/lib/config.js](src/lib/config.js).

Opening the URL in a browser should show `"version":"1.4.0"`.

First login is `admin` / `admin123`. **Change this password immediately from
Settings** – the default is public knowledge.

## Deploy the website (Vercel)

1. Vercel → *Add New… → Project* → import this GitHub repository.
2. Framework is detected as **Vite**; `vercel.json` already sets the build
   command (`npm run build`) and output folder (`dist`).
3. Deploy. Every push to `main` redeploys.

## Windows desktop program

```bash
npm run pack:win
```

Produces, in `release/`:

- `EWD Dashboard-win32-x64/` – run `EWD Dashboard.exe`
- `EWD-Dashboard-win32-x64.zip` – the same folder, ready to send

No install needed: unzip and run. `release/` is git-ignored (the zip is over
GitHub's 100 MB file limit); rebuild it with the command above.

To try the desktop shell without packaging: `npm run electron`.

> If `npm run electron` opens nothing or prints a Node error, the environment
> variable `ELECTRON_RUN_AS_NODE` is set (some editors set it). Unset it first.
