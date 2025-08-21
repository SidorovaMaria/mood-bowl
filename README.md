<p align="center">
  <img src="/public/images/github/Intro.png" alt="Project Name">
</p>

# MoodBowl

MoofBowl is a meal and mood tracking app with journaling features to help you stay mindful about what you eat, how you feel, and where your mind wanders. It’s designed as a gentle daily ritual: log your meals, check in with your mood, jot down gratitudes, and reflect through meditation notes.

# Features

## ✨ Features

- 🍽️ **Meal Tracking & Nutrition**

  - Log meals and food items.
  - Track calories and macros.
  - Visualize nutrition trends.

- 🌤️ **Mood Tracking**

  - Record your daily mood score.
  - See montly reflection on mood
  - See how mood correlates with meals and habits.

- 📓 **Journaling**

  - Daily **gratitude entries**.
  - Free-form journal notes.
  - Track meditation sessions and reflections.

- 🎨 **Modern UI**
  - Built with React + TailwindCSS in a soft, calming theme.
  - Smooth animations with Framer Motion.

## Tech Stack

<!--- # "Verify icons availability here https://github.com/tandpfun/skill-icons" -->

[![My Skills](https://skillicons.dev/icons?i=ts,nextjs,react,tailwind,nextjs)](https://skillicons.dev)

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/your-username/MoofBowl.git
   cd MoofBowl
   ```
2. Install Dependencies

   ```bash
   npm install
   ```

3. Environment Variables
   Before running MoodBowl, you’ll need to provide the following environment variables.

   Create a `.env` file in the project root (or `server/.env` if you keep backend separate):

   ```dotenv
   # --- MongoDB ---
   MONGODB_URI=***               # Your MongoDB connection string (Atlas or local)
   MONGODB_URL_OFFLINE=***       # Local MongoDB URI for offline/dev usage

   # --- Auth.js ---
   AUTH_SECRET=***               # Added automatically by `npx auth`. Keep it secret.
   AUTH_GOOGLE_ID=***            # Google OAuth Client ID
   AUTH_GOOGLE_SECRET=***        # Google OAuth Client Secret

   # --- API ---
   NEXT_PUBLIC_API_BASE_URL=***  # API base URL for the frontend (e.g. http://localhost:5050/api)
   ```

4.Start development server

```bash
   npm run dev
```
