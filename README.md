# Google Authentication (Login)

This project supports Google Sign-In using **Google Identity Services**.

## Backend env

Set these in your backend environment (Render / local `.env`):

- `GOOGLE_CLIENT_ID` = your Google OAuth Client ID
- `JWT_SECRET` = your JWT secret (already required)

Backend endpoint:

- `POST /api/auth/google` with body `{ "credential": "<google_id_token>" }`

## Frontend env

Set this in your frontend environment (Vercel / local `.env`):

- `VITE_GOOGLE_CLIENT_ID` = same Google OAuth Client ID

Notes:

- Make sure your Google OAuth client has your domains added in **Authorized JavaScript origins** (e.g. `http://localhost:5173` and your Vercel domain).
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
