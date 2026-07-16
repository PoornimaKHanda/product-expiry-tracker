# 📦 Product Expiry & Warranty Tracker

A lightweight, privacy‑first **mobile utility app** to track **product expiry dates** (makeup, skincare, medicines, consumables) **and long‑term product warranties** (electronics, tools, appliances) — with timely reminders.

The app is designed to be **offline‑first, long‑lived (3–5+ years)** and behave like a system utility (Calculator / Calendar): install once, forget about it, get notified when needed.

No backend. No accounts. No ads. No tracking.

---

## ✨ Why this app exists

People often forget:

- When makeup or skincare expires after opening
- When an expensive product’s warranty is about to end
- Where the receipt or warranty registration is stored

This app solves that by:

- Tracking **time‑bound product lifecycles** locally
- Sending **local notifications** before important dates
- Storing **receipts / registrations** securely on device
- Minimizing permissions and security risk

---

## 🧠 Core Principles

- **Offline‑first** – All data stored on device
- **Privacy‑first** – No internet access, no backend
- **Minimal permissions** – Camera & notifications only when required
- **Longevity** – Stable local storage, OS‑level scheduling
- **Reusable design** – One model for expiry & warranty tracking

---

## 📱 Features

### ✅ Core Tracking (MVP)

- Track **product expiries** (makeup, skincare, medicines, food items)
- Track **product warranties** (electronics, tools, appliances)
- Unified item model for both expiry & warranty
- Categorization (Makeup, Skincare, Electronics, Tools, etc.)

### ⏰ Smart Reminders

- Notifications:
  - 30 days before expiry / warranty end
  - 7 days before (configurable later)
  - On the exact end date

- Works fully offline using OS scheduler

### 🧾 Records & Attachments

- Attach purchase receipts / warranty registrations
- Store product photos (optional)
- Optional notes per item

### 🤖 Smart Assist (Incremental)

- Capture product photo
- On‑device OCR to detect product name / brand
- Auto‑suggest category (best‑effort)

---

## 🧱 Data Model (Core Design)

All functionality is built around a single abstraction:

```
TrackableItem
```

```
TrackableItem {
  id: string
  name: string
  category: string
  type: 'EXPIRY' | 'WARRANTY'

  startDate: Date      // opened date or purchase date
  endDate: Date        // expiry date or warranty end date

  reminderOffsets: number[]  // days before end date
  attachments?: string[]     // receipt / registration images
  notes?: string
}
```

This avoids duplication and allows the app to scale cleanly.

---

## 🏗️ Architecture Overview

```
Mobile App (React Native + Expo)
 ├── UI (Screens & Reusable Components)
 ├── Theme & Shared Styles
 ├── Storage (SQLite)
 ├── Notifications (OS Scheduler)
 ├── Camera & Attachments (On‑device)
 └── No Backend / No Network
```

This architecture intentionally avoids servers to reduce complexity, cost, and security risk.

---

## 🛠️ Tech Stack

- **React Native** (Android + iOS)
- **Expo (Managed Workflow)**
- **TypeScript**
- **Expo Router** (navigation)
- **expo‑sqlite** (local persistence)
- **expo‑notifications** (local reminders)
- **expo‑camera** (photo capture)
- **On‑device OCR** (planned)

---

## 🔐 Security & Privacy

- No network permission
- No backend APIs
- No authentication
- No third‑party trackers
- Data stored only in app sandbox

Attack surface is intentionally minimal.

---

## 🚀 Development Workflow (Step‑by‑Step)

This project is built **incrementally**, suitable for weekend / holiday development.

### Phase 1 – Foundation

- Initialize Expo + TypeScript project
- Setup shared theme & reusable styles
- Build Home screen UI

### Phase 2 – Core Functionality

- Define TrackableItem data model
- Local storage using SQLite
- Add / Edit / Delete items

### Phase 3 – Notifications

- Calculate reminder dates
- Schedule local notifications
- Handle permission prompts gracefully

### Phase 4 – Attachments

- Camera permission on demand
- Store receipt / registration images

### Phase 5 – Smart Assist (Optional)

- OCR for product name detection
- Barcode scan (best‑effort metadata)

---

## 🧑‍💻 Local Development Setup

### Prerequisites

- Node.js (LTS)
- VS Code
- Expo Go app (Android / iOS)

### Run locally

```bash
npm install
npm start
```

Scan the QR code using **Expo Go**.

> Expo Go is used **only for development**. The final app will be built as a standalone APK / iOS app.

---

## 📦 Deployment (Planned)

- Standalone Android APK (sideloaded or Play Store)
- iOS build via TestFlight (optional)

Once installed, the app behaves like a system utility and does **not expire**.

---

## 📌 Resume Positioning

**Product Expiry & Warranty Tracker** — Designed and built a cross‑platform, offline‑first mobile utility using React Native and Expo to track product expiries and long‑term warranties with local persistence, notifications, and document storage, while minimizing security and privacy risks.

---

## 📄 License

Personal / Educational Use

## Phase 4 — Permission handling & Expo Dev Client

This project will introduce additional native modules (for example, enhanced notifications, camera attachments, and potential native OCR). Expo Go does not support arbitrary native modules — use the Expo Development Client when you need modules beyond Expo Go.

Quick developer steps:

1. Install the dev client helper package:

```bash
npx expo install expo-dev-client
```

2a. (Local prebuild run) Prebuild and run on device/emulator:

```bash
npx expo prebuild
npx expo run:android # or npx expo run:ios
```

2b. (Repeatable) Build a dev client via EAS and install on device:

```bash
# Requires EAS configured
eas build --profile development --platform android
eas build --profile development --platform ios
```

3. Permission handling guidance:

- Request permissions on demand with a short rationale UI before the system prompt.
- Use a centralized helper (`hooks/usePermission.ts`) for `checkPermission`, `requestPermission`, and `ensurePermission` to avoid importing native modules in environments (like Expo Go) until needed.
- If permissions are denied permanently, direct users to app settings (the helper opens settings when appropriate).
- Add manual device tests for iOS/Android when adding native modules.

### Device Test Checklist

Use this checklist when validating permission-sensitive features on real devices (recommended) or emulators running a dev client.

- Dev client ready:

```bash
# Install dev client helper (if not already)
npx expo install expo-dev-client

# Quick local prebuild + run
npx expo prebuild
npx expo run:android   # or npx expo run:ios
```

- Notifications
  - Verify `ensurePermission("notifications")` opens the system prompt with pre-rationale shown.
  - Schedule a test notification and confirm it fires at the expected time.
  - Deny permission and confirm the app shows a friendly explanation and an option to open settings.

- Camera / Attachments
  - On add-item flow, trigger camera permission request and confirm pre-rationale is shown.
  - Capture photo and confirm the image is saved and accessible in the app.
  - Deny and confirm graceful degradation (ability to skip attachments).

- Media Library / Photos
  - Request media-library permission when saving attachments; confirm pick/save workflows work.

- Settings & Permanently Denied
  - When permission is permanently denied, confirm `ensurePermission` directs users to app settings and the app explains required steps.

- Platform checks
  - iOS: confirm `Info.plist` permission strings are present for Camera/Photos/Location/Contacts as needed.
  - Android: confirm `AndroidManifest.xml` (via prebuild) contains required `uses-permission` entries.

- Build verification
  - Using EAS, build a development client and install on a physical device to repeat the above flows.

## To do

Warrenty expiry date should have options like 5yrs,10yrs,2yrs etc from purchase date and date picker as well.
make ui more appealing. (since it's for old people, keep standard texts and texts cannot be too small) - done
instead of hamburger i think edit and delete icon would be good. (debatable)
1 more tab for all items in this products and expiry -done
Warrenty ending soon should soemhow tell that it only shows next due 30days items.

remainder and local notifiction working

- Handle permission prompts gracefully
