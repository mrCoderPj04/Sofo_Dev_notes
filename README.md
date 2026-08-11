# SOFO DevNotes — Frontend Web Application 🚀

**SOFO DevNotes** ("Learn • Code • Store • Build") is a modern, high-performance developer Knowledge Operating System designed for organizing code snippets, technical documentation, language references, and workspace outputs.

![SOFO DevNotes Logo](public/logo.png)

🌐 **Live Deployed Web Application:** [https://sofo-dev-notes.onrender.com](https://sofo-dev-notes.onrender.com)  
⚡ **Production REST API:** [https://sofo-dev-backend.onrender.com](https://sofo-dev-backend.onrender.com)

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS & HSL Glassmorphism Dark Mode
- **Animations**: Framer Motion (Responsive Mobile Drawer Sidebar)
- **Icons**: Lucide React
- **Editor**: Monaco Editor & Markdown Editor
- **Authentication**: PJSOFONIC ERP Auth & Full Stack Department Guard

---

## 🌐 Live Production & Deployment

| Resource | URL |
| :--- | :--- |
| **Live Frontend App** | [https://sofo-dev-notes.onrender.com](https://sofo-dev-notes.onrender.com) |
| **Backend REST API** | [https://sofo-dev-backend.onrender.com](https://sofo-dev-backend.onrender.com) |
| **GitHub Repository** | [https://github.com/mrCoderPj04/Sofo_Dev_notes.git](https://github.com/mrCoderPj04/Sofo_Dev_notes.git) |

---

## 🚀 Deploy to Render.com (Step-by-Step)

### Option A: Using Render Blueprints (`render.yaml`)
1. Push this repository to GitHub: `https://github.com/mrCoderPj04/Sofo_Dev_notes.git`
2. Open [Render Dashboard](https://dashboard.render.com/) -> Click **New +** -> Select **Blueprint**.
3. Connect your repository `Sofo_Dev_notes`. Render will automatically detect `render.yaml` and configure the build & start commands!

### Option B: Manual Web Service Setup
- **Service Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `NEXT_PUBLIC_API_URL`: `https://sofo-dev-backend.onrender.com/api`

---

## 🚀 Local Development Setup

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
