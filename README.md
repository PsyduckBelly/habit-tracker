# Habit Tracker

A beautiful and feature-rich habit tracking application to help you build better daily routines.

🌐 **Live Demo**: [https://psyduckbelly.github.io/habit-tracker/](https://psyduckbelly.github.io/habit-tracker/)

## 🎨 Showcase

Visit `/showcase` to see a beautiful showcase page perfect for:
- GitHub README screenshots
- Project promotion
- Feature demonstrations

## ✨ Features

- 📅 **Calendar View** - Track habits with an intuitive weekly grid layout
- 📊 **Statistics Dashboard** - Real-time display of habit count, completions, and progress percentage
- 📈 **Progress Charts** - Visualize daily habit completion trends
- 🔥 **Streak Tracking** - Weekly streak calculation to motivate consistency
- 🎯 **Goal Achievements** - Horizontal bar charts showing completion rates for each habit
- 💾 **Data Export/Import** - Backup and restore data in JSON format
- 📱 **Responsive Design** - Perfect support for desktop and mobile devices
- 🎨 **Notion-style UI** - Clean, elegant design aesthetic
- ⚡ **Dynamic Progress Calculation** - Progress based on actual start date, more accurate
- 🎨 **Preset Habits** - Quick-start with fun and interesting preset habits

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:5173`

Visit `http://localhost:5173/showcase` to see the showcase page

### Build for Production

```bash
npm run build
```

Build files will be output to the `dist` directory

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **Recharts** - Chart library
- **date-fns** - Date utilities
- **React Router** - Routing
- **LocalStorage** - Data persistence

## 📦 Project Structure

```
habit_tracker/
├── src/
│   ├── components/      # React components
│   │   ├── HabitForm.tsx
│   │   ├── HabitGrid.tsx
│   │   ├── HabitDetail.tsx
│   │   ├── SummaryStats.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── MoodChart.tsx
│   │   └── AnalysisPanel.tsx
│   ├── pages/          # Page components
│   │   └── Showcase.tsx
│   ├── utils/          # Utility functions
│   │   ├── storage.ts
│   │   ├── dateUtils.ts
│   │   └── calculations.ts
│   ├── types.ts        # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   ├── AppRouter.tsx   # Router configuration
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Usage

1. **Add Habits** - Click the "+ Add Habit" button, enter a habit name, set weekly goal, and choose a color
2. **Mark Completion** - Click the checkbox for the corresponding date in the calendar grid
3. **View Statistics** - Top section shows habit count, completions, and overall progress
4. **Analyze Data** - Right panel displays completion comparison for each habit
5. **Switch Months** - Use navigation buttons to view different months
6. **View Details** - Click on a habit name to see detailed statistics and charts
7. **Export/Import** - Backup your data or restore from a previous backup

## 🌐 Deployment

### GitHub Pages

1. Install `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Add deploy script to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Update `vite.config.ts` to set base path:
```typescript
export default defineConfig({
  base: '/habit_tracker/',
  plugins: [react()],
})
```

4. Run deployment:
```bash
npm run deploy
```

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run in project root:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

## 📝 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎨 Design

This project follows a Notion-inspired design philosophy:
- Clean, minimalist interface
- Soft, low-saturation colors
- Focus on content and usability
- Elegant typography and spacing
