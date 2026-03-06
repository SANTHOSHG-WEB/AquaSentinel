# 🌊 Aquasentinel: Smart Water Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0-blue?style=flat-square&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**Aquasentinel** is a premium, AI-driven IoT dashboard designed for the future of water conservation. Built for hackathons and professional environmental monitoring, it combines real-time hardware telemetry with expert AI analysis to optimize water usage in homes, gardens, and industrial sites.

---

## ✨ Features

### 🎨 Premium UI/UX (60-30-10 Principle)
- **Scientifically-Backed Palette**: A medical/tech-inspired theme using **60% Sand White** (Readability), **30% Emerald Green** (Environmental Trust), and **10% Coral Orange** (High-Contrast CTAs).
- **Glassmorphism**: Elegant translucent cards with subtle blurs and dynamic shadows.
- **Fully Responsive**: Flawless experience across Mobile, Tablet, and Desktop.

### 🧠 Agentic AI & RAG Consultant
- **Context-Aware Insights**: Leveraging the **Google Gemini 2.0 Flash Lite** model and a **Retrieval-Augmented Generation (RAG)** system to analyze historical sensor data.
- **Predictive Analytics**: Forecasts tomorrow's water usage based on past patterns.
- **Explainable AI**: Not just "what" to do, but "why"—with step-by-step reasoning for every recommendation.

### 💧 Dynamic Mascot Avatar
- **Interactive Feedback**: A cartoon-like water mascot that reacts to your tank levels.
- **Framer Motion Animations**: 
  - **Full (>70%)**: Cool & confident (`😎`) with a slow Emerald aura.
  - **Medium (20-70%)**: Normal hydration (`💧`) with a steady heartbeat.
  - **Critical (<20%)**: High-alert panic (`🥵`) with rapid Red pulsing.

### 🌤️ Live Weather & Geo-Location
- **Auto-Location**: Automatically detects user city and coordinates via `ipapi.co`.
- **Open-Meteo Integration**: Real-time temperature, condition updates, and hourly rain probability.
- **Weather-Aware Irrigation**: Automatically suggests pausing irrigation when rain is detected locally.

### 🛠️ Hardware Hardware Simulator
- **Live CSV Watcher**: A Node.js sidecar script (`simulate_sensors.js`) that watches `local_sensors.csv`.
- **Instant Sync**: Update your water levels or flow directly from Excel, hit Save, and see the Dashboard update in real-time via Firebase.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite (Fast Refresh)
- **State & Data**: Firebase Realtime Database
- **Authentication**: Supabase Auth (Mock-bypass enabled for offline testing)
- **AI Engine**: Google Gemini API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Simulation**: Node.js + Chokidar + PapaParse

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SANTHOSHG-WEB/AquaSentinel.git
   cd AquaSentinel
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root and add your details:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_GEMINI_API_KEY=your_key
   ```

4. **Run the Dashboard**
   ```bash
   npm run dev
   ```

5. **Start Hardware Simulator (Optional)**
   ```bash
   node simulate_sensors.js
   ```
   *Edit `local_sensors.csv` to see live dashboard changes.*

---

## 📱 Mobile Preview
The UI is optimized for mobile-first interactions, featuring:
- Collapsible navigation tabs.
- Resized gauges and interactive charts.
- Floating AI chat widget with dynamic padding.

---

## 🏆 Hackathon Submission
Designed with a focus on **Visual Wow-Factor**, **AI Sophistication**, and **Reliable Real-time Sync**. Aquasentinel is ready to revolutionize how we monitor and save the world's most precious resource. 🌊💧 
