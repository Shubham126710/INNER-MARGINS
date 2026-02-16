# Inner Margins

A minimalist, retro-inspired journaling and blogging platform focused on typography, long-form writing, and a distraction-free reading experience.

Inner Margins explores modern full-stack architecture using Next.js while prioritizing structured content management and thoughtful UI design.

---

## Highlights

- Built with Next.js App Router and Server Actions
- Clean full-stack architecture using Prisma ORM
- Type-safe development with TypeScript
- Typography-first, distraction-free UI
- Tag-based content organization
- Featured post system for curated storytelling
- Modular, component-driven structure
- Scalable database configuration (SQLite → PostgreSQL/MySQL)

---

## Overview

Inner Margins provides a focused environment for capturing personal reflections and publishing long-form content. The interface removes unnecessary UI noise and places emphasis on readability, hierarchy, and structured content.

---

## Key Features

### Personal Journaling
Create and manage long-form written entries.

### Rich Text Editing
Integrated editor supporting formatted content creation.

### Tagging System
Organize posts for structured navigation and discoverability.

### Featured Posts
Highlight selected stories on the homepage.

### Author Profile
Dedicated About page with customizable biography and interests.

### Responsive Design
Optimized reading experience across desktop, tablet, and mobile devices.

---

## Architecture

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Tailwind Typography Plugin

### Backend
- Next.js Server Actions for data mutations
- API Routes where required

### Database
- Prisma ORM
- SQLite (development)
- Easily configurable for PostgreSQL or MySQL in production

---

## Project Structure

```
├── prisma/               # Database schema & migrations  
├── src/  
│   ├── actions/          # Server actions (mutations)  
│   ├── app/              # Routes & layouts (App Router)  
│   ├── components/       # Reusable UI components  
│   ├── lib/              # Utilities & shared logic  
│   └── generated/        # Prisma client  
├── public/               # Static assets  
└── configuration files  
```

---

## Design Philosophy

1. Typography over decoration  
2. Content over interface  
3. Simplicity over feature bloat  

The retro aesthetic reinforces personality without compromising usability.

---

## Running Locally

```bash
git clone https://github.com/yourusername/inner-margins.git
cd inner-margins
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Visit: http://localhost:3000

---

## Future Improvements

- Authentication and user accounts
- Draft and publishing workflow
- Search functionality
- Markdown import/export
- Dark/light theme toggle

---

## License

MIT License
