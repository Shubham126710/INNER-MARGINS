# Inner Margins

<div align="center">
  <img src="src/app/icon.png" alt="Inner Margins Logo" width="128" />
  <h1 align="center">Inner Margins</h1>
  <p align="center">
    <strong>A minimalist, retro-styled personal journal system built for focus and reflection.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## 📖 Overview

**Inner Margins** is a personal journaling platform designed with a distinct "retro-computer" aesthetic, prioritizing distraction-free writing and reading. It serves as a digital sanctuary for thoughts, combining modern web technologies with nostalgia-inducing design elements like pixel fonts, scanlines, and terminal-inspired layouts.

The application features a robust writing interface, data visualization for writing habits, and a chronological archive of entries, all wrapped in a cohesive visual identity.

## ✨ Features

- **Retro Aesthetic**: Custom Tailwind configuration for a pixel-perfect, 8-bit inspired UI.
- **Distraction-Free Writing**: A clean, focused editor interface for new entries.
- **Journal Archive**: Filterable and searchable list of past entries.
- **Data Analysis**: Visual analytics for writing habits, including:
  - Current & Longest Streaks
  - "Year in Pixels" Contribution Graph
  - Daily & Weekly Activity breakdowns
- **Tagging System**: Organize thoughts with a custom tagging implementation.
- **Rich Text Support**: Markdown-style formatting for expressive writing.
- **Responsive Design**: Fully optimized for desktop and mobile reading experiences.

## 📸 Functionality & Usage

### The Landing Page
A welcoming terminal-style interface that provides a quick status report of your writing activity.

![Home Page](public/screenshots/Inner-margins-hero.png)

### Writing Interface
A dedicated space for composing new entries. Features include cover image uploads, title management, and a rich text editor.

![Writing Interface](public/screenshots/Inner-margins-write.png)

### Journal Archive
Browse through your history. Filter by tags or search for specific memories.

![Journals](public/screenshots/Inner-margins-journals.png)

### Analysis Dashboard
Gain insights into your writing patterns with detailed statistics and visualizations.

![Analysis Dashboard](public/screenshots/Inner-margins-analysis.png)

### About Page
A personal introduction section styled to match the system's retro theme.

![About Page](public/screenshots/Inner-margins-about.png)

---

## 🛠 Tech Stack

This project is built using the latest features of the React ecosystem, focusing on performance and type safety.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom configuration
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Data Fetching**: React Server Components & Server Actions
- **Charts**: Custom SVG implementation & Recharts
- **Deployment**: [Vercel](https://vercel.com/)

### Project Structure

```bash
├── prisma/               # Database schema and migrations
├── public/               # Static assets & screenshots
├── src/
│   ├── actions/          # Server Actions for data mutation
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions & types
│   └── styles/           # Global styles
└── tailwind.config.mjs   # Custom design token configuration
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- A PostgreSQL database URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inner-margins.git
   cd inner-margins
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/innermargins?schema=public"
   ```

4. **Initialize Database**
   Run the Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your `DATABASE_URL` to the Environment Variables settings in Vercel.
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Shubham Upadhyay</sub>
</div>
