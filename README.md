# 💼 Hamgam – Financial Data Platform

**Hamgam** is a full-stack financial management application that helps users view, analyze, and manage their financial data in real-time. It combines a modern frontend built with **Next.js** and a powerful backend built with **Python (FastAPI)** to deliver a responsive, fast, and scalable experience.

---

## 🌐 Live Demo

Coming soon...

---

## 🚀 Features

- 🔐 Secure user authentication (register/login)
- 📊 Dynamic financial dashboards with income, expenses, and balance tracking
- 💾 Add, edit, delete, hide or filter financial records
- 📆 Filter data by date range, category, or tags
- 📈 Visual reports using charts and graphs
- 📁 Downloadable reports (CSV, Excel, PDF)
- 📦 Backend API with robust data validation and JWT security
- 📱 Fully responsive UI (mobile & desktop)

---

## 🧰 Tech Stack

### 🖥️ Frontend (Next.js)
- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/) or [ShadCN/UI](https://ui.shadcn.dev/)
- [React Query](https://tanstack.com/query/) or SWR for data fetching

### 🐍 Backend (Python)
- [FastAPI](https://fastapi.tiangolo.com/) (or Flask)
- [Pydantic](https://pydantic.dev/) for data validation
- [MongoDB](https://www.mongodb.com/) or [PostgreSQL](https://www.postgresql.org/)
- [JWT Authentication](https://jwt.io/)
- [Uvicorn](https://www.uvicorn.org/) ASGI server

---

## 📂 Project Structure

hamgam/
├── frontend/ # Next.js frontend
│ ├── pages/
│ ├── components/
│ ├── redux/
│ └── ...
├── backend/ # Python FastAPI backend
│ ├── app/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── db/
│ │ ├── auth/
│ │ └── main.py
│ └── requirements.txt
└── README.md

