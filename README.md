# LifeLoop

LifeLoop is a local shops and services directory with separate customer and business accounts, persistent business listings and messages, provider listing tools, reviews, favourites, and administrator controls. The current directory seed is for Warangal, Telangana, India: 15 shops and 15 service providers. Directory listings are public-source entries that have not been claimed or independently verified by LifeLoop.

## Run locally

Requirements: Node.js 20+ and MongoDB running locally or hosted.

1. Install dependencies from the repository root with `npm install`.
2. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` and a strong, random `JWT_SECRET` (32+ characters). Set `CLIENT_ORIGIN=http://localhost:5173`.
3. Copy `client/.env.example` to `client/.env`.
4. Run `npm run dev` from the repository root.
5. Open `http://localhost:5173`; check the API at `http://localhost:8081/api/health`.

The API uses port 8081 to avoid the common local port 8080 conflict. If you change it, update `PORT` in the server environment and both Vite URLs in `client/.env` to match. Stop an older server and Vite terminal with Ctrl+C before starting another copy of the app.

At startup, the API creates the India categories and upserts the 30 Warangal directory entries and their offering cards. Provider sign-up creates an approved, immediately visible business listing. A provider can edit the listing name, phone, address, category, city, state, announcement, description and hours, and can manage offerings and availability.

## Authentication, chat and data accuracy

- Customers and providers sign up through `/api/auth/signup`; public registration cannot assign the admin role.
- Provider listings are visible immediately. Directory entries are marked unclaimed and unverified. Only administrator approval can assign a Verified badge.
- Chat conversations and messages persist in MongoDB and are restricted to participants. Socket.IO broadcasts new messages. If `OPENAI_API_KEY` is not configured, LifeLoop uses a grounded assistant fallback for price, hours, availability and general questions. It avoids claiming unconfirmed stock, hours or prices. Set an OpenAI key and `OPENAI_MODEL` to enable generated answers; the key belongs only in the server environment.
- Source-directory prices and general market estimates are labeled as estimates and should be confirmed with the business. Stock is unknown unless a provider has recently updated it. Listing phone numbers and addresses come from public directories and can be stale; call to confirm.
- The Warangal seed includes 15 shops and 15 service listings, sample INR offers and clearly marked reference schedules. Twenty-nine directory records only have an approximate Warangal-area coordinate; only Anil Electronics has a published coordinate in this seed. The business detail page sends the business name and street address to a cross-platform Google Maps search/directions URL, and phone links use `tel:` so supported phones can open the dialler. Google Maps URLs need no API key, but they search a name/address and do not guarantee a verified Place match.
- Business photos are illustrative Unsplash stock photos, visibly labelled as reference photos. They are not photographs of the named storefronts. Google Places photos require a Places API key, photo metadata and attribution; no key was provided. Directory phone numbers and hours are shown as public-source or reference data and are not independently verified live.
- Forgot password returns a privacy-preserving response, but outbound password-reset email is not configured. Cloud image hosting configuration is documented in `server/.env.example`; signed uploads are not implemented. These integrations need credentials and endpoints before production use.

## Admin account

Create an administrator securely from the server terminal after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` (14+ characters) in the server environment:

```sh
npm run create-admin -w server
```

The script refuses to change an existing account. Admin registration is not shown in the public customer/provider flow.

## Deploy

The Render Blueprint builds from the repository root because the server imports the shared Warangal directory. Vercel builds the client from the same monorepo.

1. Push this folder to a GitHub repository. `.gitignore` excludes local `.env` files and `node_modules`; never upload secrets.
2. In MongoDB Atlas, create a cluster and a database user with access only to the LifeLoop database. Add the backend host's outbound IPs to the Atlas IP access list where possible; avoid `0.0.0.0/0` for production. Copy the Atlas application connection string and replace its database name with `lifeloop`.
3. In Vercel, import the repository as a project. Keep the root directory at the repository root; `vercel.json` sets the workspace build command and `client/dist` output directory. Set `VITE_API_URL` to `https://<render-service>.onrender.com/api` and `VITE_SOCKET_URL` to `https://<render-service>.onrender.com`, then deploy. If the Render URL is not known yet, deploy Render first and add these variables before redeploying the frontend.
4. In Render, create a Blueprint from the repository and apply `render.yaml`. Set `MONGODB_URI` to the Atlas URI and `CLIENT_ORIGIN` to the exact Vercel production origin (scheme and hostname, no trailing slash). Render generates `JWT_SECRET` and supplies `PORT`.
5. If the Vercel hostname changes, update `CLIENT_ORIGIN` in Render. If the Render hostname changes, update both Vercel `VITE_API_URL` and `VITE_SOCKET_URL` and redeploy. The backend allows the comma-separated production origins listed in `CLIENT_ORIGIN`.
6. Verify `https://<render-service>.onrender.com/api/health` reports `{"status":"ok","database":"connected"}`. Then test customer/provider login, provider listing visibility, offers, chat, and mobile layouts on the deployed site.

Optional server environment variables are `OPENAI_API_KEY`/`OPENAI_MODEL` for generated assistant responses and Cloudinary credentials for persistent image uploads. The chat has a grounded fallback without an AI key; image upload hosting is not fully implemented yet.

No GitHub remote, Atlas credentials, or hosting account access is configured in this workspace, so the app has not yet been deployed to a public URL.

## Verification

Run `npm run build` for a production client build. The local smoke verification also exercises MongoDB connection, 15/15 Warangal shop and service records, immediate provider visibility, provider profile edits, persistent chat messages and an assistant reply.
