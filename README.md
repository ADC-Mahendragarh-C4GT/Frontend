### Suvidha Manch – Frontend

Suvidha Manch is a municipal infrastructure tracking web application focused on road taxonomy and works monitoring. This repository contains the React + TypeScript + Vite frontend, including authentication flows, role-based screens, data entry for roads/works/contractors, and PWA support for offline usage.

This document serves as the final handover guide with setup, configuration, scripts, deployment, and troubleshooting.

---

## Tech stack
- React 19 + TypeScript
- Vite 7
- React Router 7
- Axios for HTTP
- Material UI (MUI) and Headless UI components
- date-fns, react-datepicker
- XLSX/ExcelJS for CSV/Excel usage
- Vite PWA plugin for service worker/manifest

## Key features
- Authentication with access/refresh tokens, auto-refresh on 401
- Role-oriented screens (e.g., Junior Engineer, Executive Engineer)
- Manage Roads, Contractors, Infra Works, Updates, Comments
- Other Department Request workflow with status updates and email notifications
- CSV upload for bulk data
- PWA: installable, offline-ready, auto-updating service worker

## Repository structure (high level)
```
src/
  api/
    api.ts           # Axios instance, interceptors, API helpers
    config.ts        # Backend base URL
  components/
    Executive Engineer/
      pendingRequest.jsx
    JuniorEngineer/
      NewRoad.jsx, NewWork.jsx, NewUpdate.jsx,
      NewUser.jsx, UpdateRoad.jsx, UpdateUser.jsx, ...
    Login.jsx, home.jsx, RoadDetail.jsx, ViewAllRoads.jsx,
    ForgetPassword.jsx, ResetPassword.jsx, ...
  App.tsx            # Routing
  main.tsx           # App bootstrap + PWA registration
vite.config.ts       # Vite + PWA config
public/              # Static assets
dist/                # Production build output
```

## Routing overview
The app uses `BrowserRouter` with these main routes:
- `/` → redirects to `/login`
- `/login` → login page
- `/home` → dashboard/home
- `/road/:id` → road detail view
- `/view-all-roads` → roads listing
- `/OtherDepartmentForm` → submit request to other department
- `/pendingRequests` → requests list (Executive Engineer)
- `/NewRoad`, `/NewWork`, `/NewUpdate`, `/NewUser`, `/NewContractor` → JE operations
- `/UpdateRoad`, `/UpdateUser`, `/UpdateContractor` → update screens
- `/reset-password/:uid/:token`, `/ForgetPassword` → password flows

## Authentication and tokens
- Access token is stored in `localStorage` as `access_token` and attached as `Authorization: Bearer <token>`.
- On 401, a refresh flow is attempted using `refresh_token` via `/token/refresh/`. If refresh fails, tokens are cleared and the app redirects to `/login`.
- To make an authenticated API call, set `requiresAuth: true` in the Axios request config (already handled inside helpers in `src/api/api.ts`).

## Backend API base URL
Update the backend base URL in:
```
src/api/config.ts
```
Set `BASE_URL` to your backend origin, for example:
```ts
const BASE_URL = "https://api.example.gov.in";
export default BASE_URL;
```

Note: environment variables are not currently wired for this; the base URL is set in this file.

## Prerequisites
- Node.js 20+ recommended
- npm 10+

## Installation
```bash
npm install
```

## Development
- Start dev server (exposes on your LAN via `--host`):
```bash
npm run dev
```

- Lint:
```bash
npm run lint
```

## Build and preview
- Build production assets to `dist/`:
```bash
npm run build
```

- Preview the production build locally:
```bash
npm run preview
```

## Progressive Web App (PWA)
The app uses `vite-plugin-pwa` with `registerType: autoUpdate`.
- Service worker is registered in `src/main.tsx` via `registerSW`.
- Manifest is defined in `vite.config.ts` including icons and app metadata.
- On deploy, the service worker caches static assets for offline usage. New versions are automatically detected and activated.

Typical PWA tips:
- After deploying a new version, users may need to refresh once when the console logs "New content available".
- For hard resets during development/testing, clear site data and unregister service workers via browser DevTools.

## CSV/Excel usage
- Bulk upload endpoint: `uploadExcel(file, data)` posts to `/upload-csv/` as `multipart/form-data`.
- The app uses `xlsx`/`exceljs` for handling CSV/Excel where needed.

## Email and request workflows (high level)
- Other Department Request submission posts to `/api/other-department-requests/`.
- Status updates via `updateRequestStatus` and `sendStatusEmail`.
- `emailToXEN` supports sending compiled form data to XEN emails.

## Environment and CORS notes
- Ensure your backend enables CORS for the frontend origin and allows credentials if cookies are used. Axios is configured with `withCredentials`.
- If hosting frontend on HTTPS and backend on HTTP, modern browsers will block mixed content. Prefer HTTPS for both.

## Deployment
Any static hosting that can serve the `dist/` directory works (e.g., Nginx, Apache, static hosting providers).

Generic Nginx example:
```
location / {
  root   /var/www/suvidha-frontend/dist;
  try_files $uri /index.html;
}
```

Ensure:
- `src/api/config.ts` points to your production backend
- Correct caching headers for `index.html` (no-cache) and long cache for hashed assets
- Service worker and `manifest.webmanifest` are served with appropriate MIME types

## Available npm scripts
```json
{
  "dev": "vite --host",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Troubleshooting
- 401 loops → verify tokens exist in `localStorage`, backend `/token/refresh/` works, and time skew is minimal.
- CORS errors → add frontend origin to backend CORS allowlist; enable credentials.
- Assets/Icons missing in PWA → confirm files exist in `public/images/` and paths in `vite.config.ts` manifest.
- Stale UI after deploy → Hard refresh or clear service worker cache. In DevTools: Application → Service Workers → Unregister, then refresh.
- "Root element not found" → ensure `index.html` contains `<div id="root"></div>` and the server serves `index.html` for client routes.

## Contributing / Handover
This is the final handover of the frontend. For future changes:
- Follow TypeScript best practices and keep functions/variables well-named.
- Match existing formatting and lint rules.
- Prefer enhancing `src/api/api.ts` for new endpoints to preserve interceptors and auth behavior.

## License
Copyright © 2025. Ownership and licensing to be determined by the organization.

