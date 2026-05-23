# LMF Technical Blog

This repository contains a personal technical blog built with VitePress, npm, GitHub, and Vercel.

## Project Structure

```text
.
├─ docs/
│  ├─ .vitepress/
│  │  └─ config.ts
│  ├─ algorithm/
│  │  └─ index.md
│  ├─ cpp/
│  │  └─ index.md
│  ├─ posts/
│  │  └─ index.md
│  ├─ projects/
│  │  └─ index.md
│  ├─ about.md
│  └─ index.md
├─ package.json
└─ README.md
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run docs:dev
```

Build the site:

```bash
npm run docs:build
```

Preview the production build:

```bash
npm run docs:preview
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Use these project settings:
   - Framework Preset: Other
   - Build Command: `npm run docs:build`
   - Output Directory: `docs/.vitepress/dist`
   - Install Command: `npm install`
   - Node.js Version: 20 or newer
4. Deploy the project.

## Content Areas

- Algorithm notes: `docs/algorithm/`
- C++ study notes: `docs/cpp/`
- Project records: `docs/projects/`
- General posts: `docs/posts/`
