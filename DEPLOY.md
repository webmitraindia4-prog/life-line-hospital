# Free deployment guide

## 1) Push the project to GitHub

- Create a GitHub repository
- Push the code from this folder to that repo

## 2) Deploy the backend API (free)

Use Render:

- Go to https://render.com
- Create a New Web Service
- Connect the GitHub repo
- Set the root directory to `server`
- Build command: `npm install`
- Start command: `npm start`
- Add all environment variables from `server/.env.example`

After deployment, copy the Render URL, for example:

`https://lifeline-hospital-api.onrender.com`

## 3) Deploy the frontend (free)

Use Cloudflare Pages:

- Go to https://pages.cloudflare.com
- Create a project from GitHub
- Use the project root as the repository root
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Add environment variable:

`VITE_API_URL=https://lifeline-hospital-api.onrender.com/api`

## 4) Final test

- Open the Cloudflare Pages URL
- Sign in to the app
- Confirm API requests are going to the Render backend

## Notes

- The project builds successfully with `npm run build`
- The frontend API URL must be set in production; otherwise it falls back to localhost:5002
