# HabitFlow — Editorial Habit Tracker

A modern, minimal, and aesthetic habit tracking web app designed to turn daily routines into a **creative ritual**.

**Live App:** https://habitflow.indevs.in/

---

## Overview

HabitFlow is a design-driven habit tracker focused on clarity, consistency, and visual feedback. Built with Next.js, Tailwind CSS, and Framer Motion, it helps users track habits, analyze progress, and stay consistent.

---

## Features

### Authentication
- Secure login & signup (cookie-based JWT)
- Protected routes with auth guards

### Habit Management
- Create, update, delete, pause, resume, archive habits
- Boolean and streak habit types
- Category & color-based organization

### Analytics & Insights
- Weekly completion chart
- Monthly heatmap
- Streak tracking & leaderboard
- Time-of-day insights (morning/afternoon/evening)
- Rhythm journal with reflections

### Blog
- Public blog with markdown rendering
- Admin CRUD for blog posts
- SEO metadata & JSON-LD structured data

### UI / UX
- Editorial design system (Tailwind v4)
- Fully responsive (mobile-first with bottom nav)
- Framer Motion animations & GSAP scroll effects
- Swipe navigation between main routes
- Toast notification system

### Settings
- Edit profile (username/email)
- Change password
- Account deletion

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Redux Toolkit**
- **Framer Motion / GSAP**
- **React Hook Form**
- **Axios** (withCredentials)
- **Lucide Icons**

### Backend
- Node.js / Express.js
- MongoDB (Mongoose)
- JWT Authentication (HTTP-only cookies)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```
app/                    # Next.js App Router pages
  (protected)/          # Authenticated routes (dashboard, rituals, statistics, settings, blog-admin)
  (public)/             # Public routes (landing, signin, signup, blog)
  api/                  # API routes (sitemap, ping-google)
  layout.js             # Root layout with fonts & metadata

src/
  api/                  # Axios instance & API modules
  components/           # Reusable UI components
  hooks/                # Custom hooks (useTheme, usePageSeo, useGsapAnimation)
  lib/                  # Utilities (SEO config, habit utils, confetti, admin check)
  store/                # Redux slices (auth, habit)
  views/                # Page-level components
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/Prashantkhuva/HABIT-TRACKER-FRONTEND.git
cd habit-tracker-frontend
npm install
```

### Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_SITE_URL=https://habitflow.indevs.in
```

### Run

```bash
npm run dev
```

---

## Author

**Prashant Khuva**

- LinkedIn: https://www.linkedin.com/in/prashantkhuva
- X (Twitter): https://x.com/prashantkhuva_

---
