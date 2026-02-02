# Inner Margins

Inner Margins is a minimalist, retro-themed personal journal and blogging platform designed for capturing thoughts and sharing stories. With a focus on typography and reading experience, it offers a distraction-free environment for both writers and readers.

## 🚀 Features

- **Personal Journaling:** A dedicated space for thoughts, ideas, and stories.
- **Rich Text Editing:** Integrated editor for creating formatted content with ease.
- **Tagging System:** Organize posts with tags for easy navigation.
- **Featured Posts:** Highlight specific stories on the homepage.
- **About Page:** Customizable profile section with hobbies and biographical info.
- **Retro Aesthetic:** Unique visual style with custom typography and color palette.
- **Responsive Design:** Optimized for reading on all devices.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography:** Tailwind Typography Plugin
- **Language:** TypeScript

### Backend
- **Server Actions:** Leveraged for mutations and data handling directly within Next.js.
- **API:** Next.js API Routes (if applicable, primary logic uses Server Actions).

### Database
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** SQLite (dev), easily switchable to PostgreSQL/MySQL.

## 📦 Project Structure

```bash
├── prisma/               # Database schema and migrations
├── src/
│   ├── actions/          # Server actions for data mutations
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and types
│   └── generated/        # Generated Prisma client
├── public/               # Static assets
└── ...config files
```

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/inner-margins.git
   cd inner-margins
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 License

This project is licensed under the MIT License.
