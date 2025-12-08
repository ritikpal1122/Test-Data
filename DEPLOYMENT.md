# Deployment Guide - Vercel

This project is set up for automatic deployment to Vercel using GitHub Actions.

## Setup Instructions

### Option 1: Using Vercel GitHub Integration (Recommended - Easiest)

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite + React project
   - Click "Deploy"

2. **Automatic Deployments:**
   - Every push to `main` or `master` branch will automatically deploy
   - Pull requests will create preview deployments
   - No additional configuration needed!

### Option 2: Using GitHub Actions (Manual Setup)

If you prefer to use GitHub Actions instead of Vercel's built-in integration:

1. **Get Vercel credentials:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel login`
   - Run `vercel link` in your project directory
   - This will create `.vercel` folder with `project.json` containing:
     - `orgId` (your Vercel organization ID)
     - `projectId` (your Vercel project ID)

2. **Get Vercel Token:**
   - Go to [Vercel Dashboard](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token

3. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to: Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN` - Your Vercel token from step 2
     - `VERCEL_ORG_ID` - From `.vercel/project.json`
     - `VERCEL_PROJECT_ID` - From `.vercel/project.json`

4. **Push to trigger deployment:**
   ```bash
   git add .
   git commit -m "Setup CI/CD"
   git push origin main
   ```

## Workflow Files

- `.github/workflows/deploy.yml` - Full deployment workflow with build steps
- `.github/workflows/deploy-simple.yml` - Simplified deployment using Vercel Action

You can use either workflow. The simple one is easier to set up.

## Environment Variables

If you need environment variables in production:

1. **Via Vercel Dashboard:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add your variables

2. **Via GitHub Secrets (for CI/CD):**
   - Add secrets in GitHub repository settings
   - Reference them in the workflow file if needed

## Manual Deployment

You can also deploy manually:

```bash
npm install -g vercel
vercel --prod
```

## Troubleshooting

- **Build fails:** Check that all dependencies are in `package.json`
- **Deployment fails:** Verify Vercel secrets are correctly set in GitHub
- **404 errors on direct route access:**
  - The `vercel.json` file includes rewrite rules to handle React Router
  - After adding/updating `vercel.json`, you need to **redeploy** the project
  - Go to Vercel Dashboard → Your Project → Deployments → Click "Redeploy"
  - Or push a new commit to trigger automatic redeployment
  - Direct URLs like `/test/file-upload` should work after redeployment

