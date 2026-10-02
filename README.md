# Keerthi Portfolio Frontend

A responsive personal portfolio for Keerthi N. Profile information, skills, work experience, education, projects, and achievements are stored in `src/data/portfolioData.json` and loaded locally without API calls. The site includes light and dark themes, responsive navigation, and contact and resume links.

## Technology

- React 18 and TypeScript
- Vite 6 for development and production builds
- Lucide React for icons
- GitHub Actions for GitHub Pages deployment

## Requirements

- Node.js 20 or later
- npm

## Setup

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Build and Preview

Create a production build (TypeScript check followed by the Vite build):

```bash
npm run build
```

Preview the generated `dist` build locally:

```bash
npm run preview
```

## GitHub Pages Deployment

The workflow in `.github/workflows/deploy.yml` builds the site and deploys it whenever a commit is pushed to `main`.

1. Create a public repository on GitHub.
2. Point this local repository's `origin` remote to the new repository and push the `main` branch.
3. In the repository settings, open **Pages** and set the build and deployment source to **GitHub Actions**.

After the workflow completes, the site will be available at `https://<OWNER>.github.io/<REPOSITORY>/`. The relative Vite base keeps assets working under any repository name.
