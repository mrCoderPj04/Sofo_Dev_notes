# SOFO DevNotes — Frontend Web Application 🚀

**SOFO DevNotes** ("Learn • Code • Store • Build") is a modern, high-performance developer Knowledge Operating System designed for organizing code snippets, technical documentation, language references, and workspace outputs.

![SOFO DevNotes Logo](public/logo.png)

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS & HSL Glassmorphism Dark Mode
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Editor**: Monaco Editor & Markdown Editor
- **Authentication**: PJSOFONIC ERP Auth & Department Access Control

---

## 📱 Features

- 📱 **Auto Viewport & Mobile Sidebar**: Responsive full-screen mobile slide-over drawer sidebar for smooth navigation on all mobile browsers.
- 🔒 **ERP Auth Guard**: Integrated login with PJSOFONIC ERP, granting access to Full Stack department members.
- 💻 **Monaco Code Editor**: Live code editor with automatic file attachment synchronization.
- 🖥️ **Inline Terminal Console**: View, copy, and save execution outputs directly inline.
- ⚡ **Knowledge Base**: Structured organization by Languages, Categories, Folders, Topics, Notes, Code Snippets, File Storage, Outputs, and Favorites.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://sofo-dev-backend.onrender.com/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 👨‍💻 Author & Credits

Developed with ❤️ by **mrcoder** ([Rajkamal Singh](https://Rajkamal-singh.netlify.app))
