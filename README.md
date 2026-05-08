<div align="center">
  
# 🛡️ Vanguard Security Suite

**Next-Generation Password Intelligence & Cryptography Dashboard**

[![React](https://img.shields.io/badge/React-19.2-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

🚀 **Live Demo:** [https://password-checker-rose.vercel.app/](https://password-checker-rose.vercel.app/)

</div>

---

## 📖 Overview

Vanguard Security Suite is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to evaluate password strength, generate highly secure cryptographic keys, and safely store your credentials in an encrypted, cloud-synced vault. 

Built with a **Zero-Knowledge Philosophy**, the live intelligence analyzer processes all password entropy and offline crack-time estimates completely client-side. Passwords typed into the analyzer are *never* transmitted over the network.

## ✨ Core Features

- 🧠 **Live Intelligence Analyzer**: Real-time evaluation of password strength, detecting exact bit entropy and calculating human-readable crack times (ranging from seconds to "Lifespans of the Universe").
- 🔒 **Secure Password Vault**: A personal, JWT-authenticated database to securely store and manage your credentials across different websites.
- ⚙️ **Cryptographic Generator**: Build highly secure, customized passwords (up to 64 characters) based on strict alphanumeric and symbolic constraints.
- 🚨 **Breach Checker**: Live integration checking to see if your payloads exist in known public data breaches.
- 🎨 **Neon Cyberpunk UI**: A beautiful, fully responsive glassmorphism UI powered by Tailwind CSS v4 and Framer Motion.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (Custom Dark Neon Theme)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Analysis:** Zxcvbn

### Backend (Server)
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB via Mongoose
- **Authentication:** bcryptjs (Hashing) + jsonwebtoken (JWT)
- **Architecture:** Configured as Vercel Serverless Functions

---

## 🚀 Local Development Setup

To run the Vanguard Security Suite locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/PasswordChecker.git
cd PasswordChecker/security-suite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file inside the `security-suite/backend` folder and add your MongoDB Atlas connection string:
```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/vanguard-security?retryWrites=true&w=majority"
JWT_SECRET="your_super_secret_jwt_key"
```

### 4. Start the Application
Because this is a full-stack application, you will need two terminal windows.

**Terminal 1 (React Frontend):**
```bash
# Inside the security-suite directory
npm run dev
```

**Terminal 2 (Express Backend):**
```bash
# Inside the security-suite/backend directory
node server.js
```

---

## ☁️ Deploying to Vercel

This repository is pre-configured as a Monorepo for seamless, 1-click deployments to Vercel. Both the React SPA and the Express backend (via Serverless Functions) will deploy simultaneously.

1. Import this GitHub repository into your Vercel Dashboard.
2. Under **Project Settings**, configure the following:
   - **Root Directory:** `security-suite`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Under **Environment Variables**, add:
   - **Key:** `MONGO_URI`
   - **Value:** `mongodb+srv://<username>:<password>@cluster...`
4. Click **Deploy**. Vercel will automatically read the `vercel.json` routing configuration and deploy the suite!

---

## 🛡️ Security Disclaimer

While Vanguard Security Suite uses standard cryptographic practices (bcrypt hashing, JWT, Mongoose schemas), it is built as an educational/portfolio project. Do not use this application to store highly sensitive banking or government credentials unless deployed on a privately secured and audited infrastructure.