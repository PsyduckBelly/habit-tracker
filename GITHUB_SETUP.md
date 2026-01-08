# GitHub Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right, select "New repository"
3. Repository name: `habit-tracker` (or your preferred name)
4. Description: "A beautiful habit tracking app with visual progress tracking and streak monitoring"
5. Choose **Public** (for GitHub Pages) or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Initialize Git and Push

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Habit Tracker app"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

### Option A: Using GitHub Actions (Recommended)

1. The `.github/workflows/deploy.yml` file is already set up
2. Go to your repository on GitHub
3. Click **Settings** → **Pages**
4. Under "Source", select **GitHub Actions**
5. The workflow will automatically deploy on every push to `main` branch

### Option B: Using gh-pages package

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Update `vite.config.ts` to set base path:
```typescript
export default defineConfig({
  base: '/habit-tracker/',  // Replace with your repository name
  plugins: [react()],
})
```

4. Deploy:
```bash
npm run deploy
```

5. Go to **Settings** → **Pages** and select **gh-pages** branch

## Step 4: Add Repository Topics

Go to your repository → Click the gear icon next to "About" → Add topics:
- `react`
- `typescript`
- `habit-tracker`
- `vite`
- `tailwindcss`
- `recharts`
- `web-app`

## Step 5: Add Repository Description

In the "About" section, add:
```
A beautiful habit tracking app with visual progress tracking, streak monitoring, and Notion-inspired design. Built with React, TypeScript, and Tailwind CSS.
```

## Step 6: Create a Good README

The README.md is already in English and includes:
- Project description
- Features list
- Installation instructions
- Usage guide
- Deployment options
- Tech stack

## Step 7: Add Screenshots (Optional but Recommended)

1. Visit `http://localhost:5173/showcase` when running locally
2. Take screenshots of:
   - The main interface
   - The habit grid
   - The charts/analytics
   - The showcase page
3. Create a `screenshots/` folder
4. Add images to README.md:

```markdown
## Screenshots

![Main Interface](./screenshots/main.png)
![Habit Grid](./screenshots/grid.png)
![Analytics](./screenshots/analytics.png)
```

## Step 8: Add License

The README mentions MIT License. You can:
- Create a `LICENSE` file with MIT License text
- Or use GitHub's license template when creating the repository

## Tips for a Great GitHub Project

1. **Clear README** ✅ Already done
2. **Good commit messages** - Use descriptive messages
3. **Consistent code style** - Already using ESLint
4. **Live demo** - Deploy to GitHub Pages or Vercel
5. **Showcase page** ✅ Already created at `/showcase`
6. **Documentation** ✅ README is comprehensive

## Quick Commands Reference

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# View remote repository
git remote -v
```

## Next Steps After Uploading

1. **Add a live demo link** to README (after deploying)
2. **Add badges** (optional):
   ```markdown
   ![License](https://img.shields.io/badge/license-MIT-blue.svg)
   ![React](https://img.shields.io/badge/React-18.2-blue.svg)
   ```
3. **Share on social media** or developer communities
4. **Keep updating** with new features and improvements

