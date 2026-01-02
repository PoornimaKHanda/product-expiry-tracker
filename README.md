# 📦 Product Expiry Tracker

A lightweight, privacy-first mobile utility app to track product expiry dates (makeup, skincare, personal care, etc.) and receive timely reminders — **fully offline, no backend, no accounts**.

This project is built as a **hobby + learning project** and is designed to be long‑lived (3–5+ years), similar to system utilities like Calculator or Calendar.

---

## ✨ Why this app exists

Keeping track of expiry dates on makeup and personal care products is tedious and error‑prone. This app solves that by:

- Tracking product expiry locally on-device
- Sending reminder notifications before and on expiry
- Minimizing permissions and attack surface
- Working fully offline

No cloud. No ads. No trackers.

---

## 🧠 Core Principles

- **Offline‑first**: All data stored on device
- **Privacy‑first**: No internet access, no backend
- **Minimal permissions**: Camera & notifications only (when needed)
- **Longevity**: Stable storage (SQLite), OS‑level scheduling

---

## 📱 Features (Planned & In Progress)

### MVP

- Add products with name, category, opened date
- Automatic expiry calculation (based on shelf life)
- Local notifications:
  - 30 days before expiry
  - On expiry day
- View products expiring soon

### Smart Assist (Incremental)

- Capture product photo
- OCR to detect product name / brand
- Auto‑suggest product category

### Optional Enhancements

- Barcode scan (best‑effort metadata)
- Product photos
- Repurchase reminder during sales

---

## 🏗️ Architecture Overview

```
Mobile App (React Native + Expo)
 ├── UI (Screens & Components)
 ├── Storage (SQLite)
 ├── Notifications (OS Scheduler)
 ├── Camera + OCR (On-device)
 └── No Backend / No Network
```

This architecture intentionally avoids servers to reduce complexity, cost, and security risk.

---

## 🛠️ Tech Stack

- **React Native** (cross‑platform: Android + iOS)
- **Expo (Managed Workflow)**
- **TypeScript**
- **Expo Router** (navigation)
- **expo-sqlite** (local persistence)
- **expo-notifications** (local reminders)
- **expo-camera** (photo capture)
- **On-device OCR** (planned)

---

## 🔐 Security & Privacy

- No network permission
- No backend APIs
- No authentication
- No third‑party trackers
- Data stored in app sandbox only

Attack surface is intentionally minimal.

---

## 🚀 Development Setup

### Prerequisites

- Node.js (LTS)
- VS Code
- Expo Go app (Android / iOS)

### Run locally

```bash
npm install
npm start
npm start -- --tunnel
```

or

```bash
npm start -- --tunnel
```

Scan the QR code using **Expo Go**.

> ⚠️ Expo Go is used only for development. The final app will be built as a standalone APK / iOS app.

---

## 📦 Deployment (Planned)

- Standalone Android APK (sideloaded or Play Store)
- iOS build via TestFlight (optional)

Once installed, the app behaves like a system utility and does not expire.

---

## 📌 Resume Positioning

**Product Expiry Tracker** — Offline‑first mobile utility built with React Native and Expo, leveraging on‑device storage, local notifications, and camera‑based OCR to track product shelf life while minimizing security and privacy risks.

---

## 📄 License

Personal / Educational Use
