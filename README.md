# 📦 Product Expiry & Warranty Tracker

A lightweight, privacy-first **mobile utility app** to track **product expiry dates** (makeup, skincare, medicines, consumables) **and long-term product warranties** (electronics, tools, appliances) — with timely reminders.

The app is designed to be **offline-first, long-lived (3–5+ years)** and behave like a system utility (Calculator / Calendar): install once, forget about it, get notified when needed.

No backend. No accounts. No ads. No tracking.

---

## ✨ Why this app exists

People often forget:

- When makeup or skincare expires after opening
- When an expensive product’s warranty is about to end
- Where the receipt or warranty registration is stored

This app solves that by:

- Tracking **time-bound product lifecycles** locally
- Sending **local notifications** before important dates
- Storing **receipts / registrations** securely on device
- Minimizing permissions and security risk

---

## 🧠 Core Principles

- **Offline-first** – All data stored on device (SQLite + file system)
- **Privacy-first** – No internet access, no backend, no tracking
- **Minimal permissions** – Camera & notifications only when required
- **Longevity** – OS-level scheduling ensures reminders work even if app is not opened for months
- **Separation of concerns** – UI, DB, and file system are decoupled via services
- **Resilience** – App should behave correctly even after device restarts or app termination

---

## 📱 Features

### ✅ Core Tracking (MVP)

- Track **product expiries** (makeup, skincare, medicines, food items)
- Track **product warranties** (electronics, tools, appliances)
- Unified item model for both expiry & warranty
- Categorization (Makeup, Skincare, Electronics, Tools, etc.)
- Add optional notes per item

---

### ⏰ Smart Reminders

- Notifications:
  - 30 days before expiry / warranty end
  - 7 days before (configurable later)
  - On the exact end date

- Uses **OS-level scheduling (Android AlarmManager / iOS equivalent)**

- Works fully offline

- Does NOT rely on background JS execution

---

### 🧾 Records & Attachments (Implemented)

- Attach purchase receipts / warranty registrations
- Store product images (optional)
- Multiple attachments per item

#### 📂 Storage Design

- Images are:
  - Captured / picked using system APIs
  - Moved from temporary cache → **app private storage**
  - Stored in:

    ```
    FileSystem.documentDirectory/attachments/
    ```

- DB stores:
  - Only **file paths (URIs)**
  - Not binary data

---

#### 🧠 Attachment Architecture

```
UI
 ↓
ItemService (business logic)
 ↓
AttachmentService (file handling)
 ↓
FileSystem (persistent storage)
```

##### Responsibilities:

**AttachmentService**

- Save image to persistent storage
- Compress image before saving
- Delete image safely
- (Planned) Cleanup orphaned files

**ItemService**

- Coordinates DB + attachments lifecycle
- Ensures consistency between DB and storage

---

#### 🗜️ Image Optimization

- Images are compressed before saving using:
  - resizing (max width ~1280)
  - compression (~0.6 quality)

- Final size:
  - ~300 KB – 800 KB per image (ideal for receipts)

---

#### 🧹 Storage Safety Rules

- ✅ Delete attachments when item is deleted
- ✅ Delete old attachments when replaced
- 🔜 Periodic cleanup of orphaned files

---

#### 📊 Storage Limits

- Soft cap: **100 MB total**
- User is informed if exceeded
- Prevents silent storage bloat over long-term usage

---

### 🤖 Smart Assist (Planned)

- Capture product photo
- On-device OCR to detect product name / brand
- Auto-suggest category (best-effort)

---

## 🧱 Data Model (Current Product Model)

The app uses a single canonical `Product` domain model, and converts raw database rows into that shape at the repository boundary.

```ts
type Product = {
  id: number;
  name: string;
  category: string;
  type: "expiry" | "warranty";
  startDate: string;
  endDate: string;
  reminderOption: string;
  notes: string;
  attachments: string[];
};
```

For persistence, the project keeps a raw DB row shape and maps it centrally:

```ts
type ProductRecord = {
  id: number;
  name: string;
  category: string;
  type: "expiry" | "warranty";
  start_date: string;
  end_date: string;
  reminder_option: string;
  notes: string;
  attachments: string;
};
```

### 💡 Design Insight

- One domain model handles both expiry & warranty flows
- SQLite and file-system concerns stay outside the UI layer
- `ProductRecord` is converted once, then consumed by screens and hooks

---

## 🏗️ Current Architecture (Feature-First)

The project has moved away from the generic, flat structure and now follows a product-first ownership model.

```text
src/
  components/
    ui/
    pickers/

  features/
    products/
      contexts/
      hooks/
      notifications/
      repository/
      services/
      validation/
      types.ts

    attachments/
      services/

  screens/
  hooks/
  styles/
  theme/
  i18n/
  utils/
```

### Ownership model

#### Product repository

Owns SQLite access and raw row mapping.

Responsible for:

- create/get/update/delete product rows
- attachment serialization and parsing
- database lifecycle setup

#### Product service

Owns product orchestration.

Responsible for:

- creating/updating/deleting products
- staging attachments before persistence
- coordinating reminder scheduling
- safely deleting stale attachments after successful save

#### Product feature hooks

Own screen-level behavior and state orchestration.

Responsible for:

- home screen actions and menu state
- add/edit form state and validation
- navigation transitions

#### Attachment feature

Owns file lifecycle behavior.

Responsible for:

- saving images to persistent storage
- deleting files safely
- cleanup of orphaned or replaced files

#### Notifications feature

Owns reminder config and scheduling.

Responsible for:

- reminder offsets and identifiers
- notification permissions and scheduling
- cancellation and reminder copy

#### UI layer

Stays thin and presentation-focused.

Responsible for:

- rendering screens and reusable components
- showing modals and menus
- composing existing styles and theme tokens

### Rule to remember

- Screens render
- Hooks orchestrate behavior
- Services coordinate domain work
- Repository owns persistence
- Styles and theme own visuals
- Generic utilities stay generic

---

## ⚙️ Key Engineering Decisions

### 1. No Backend

- Eliminates:
  - infra cost
  - auth complexity
  - data breach risk

---

### 2. Local Notifications vs Background Jobs

- Background JS is unreliable
- OS scheduling is stable for long-term reminders

---

### 3. File System over Base64 Storage

- Better performance
- Lower memory usage
- Scalable for large attachments

---

### 4. Service Layer Abstraction

- UI never interacts directly with:
  - SQLite
  - FileSystem

This ensures:

- maintainability
- testability
- future extensibility

---

### 5. No-op Update Optimization

- If user makes no changes → skip:
  - DB writes
  - file operations
  - future notification rescheduling

---

## 🛠️ Tech Stack

- **React Native** (Android + iOS runtime)
- **Expo (Managed Workflow)** — simplifies native integration and builds
- **TypeScript** — type safety and maintainability
- **Expo Router** — file-based navigation system

---

### 📦 Core Libraries

- **expo-sqlite** — local relational database (structured storage)
- **expo-notifications** — scheduling local reminders via OS
- **expo-camera** — capturing product images
- **expo-image-picker** — selecting images from gallery
- **expo-file-system** — persistent file storage (attachments)
- **expo-image-manipulator** — image compression and resizing
- **expo-media-library** — optional integration with device gallery
- **expo-dev-client** — custom dev runtime for native modules

---

### 🔮 Planned / Optional

- **On-device OCR** — extract product details from images
- **Barcode scanning** — quick metadata retrieval

---

## 🔐 Security & Privacy

- No network permission
- No backend APIs
- No authentication
- No third-party trackers
- Data stored only in app sandbox

Attack surface is intentionally minimal.

---

## 🚀 Development Workflow (Step-by-Step)

### Phase 1 – Foundation

- Initialize Expo + TypeScript project
- Setup shared theme & reusable styles
- Build Home screen UI

---

### Phase 2 – Core Functionality

- Define TrackableItem data model
- Local storage using SQLite
- Add / Edit / Delete items

---

### Phase 3 – Notifications

- Calculate reminder dates
- Schedule local notifications
- Handle permission prompts gracefully

---

### Phase 4 – Attachments (Current Stage)

- Camera permission on demand
- Store receipt / registration images
- Implement file system storage
- Add compression + storage limits
- Introduce service layer abstraction

---

### Phase 5 – Smart Assist (Planned)

- OCR for product name detection
- Barcode scan (best-effort metadata)

---

## 🧑‍💻 Local Development Setup

### Prerequisites

- Node.js (LTS)
- VS Code
- Expo Go (initial phases)
- Dev Client (for native modules)

---

### Run locally (Expo Go – limited)

```bash
npm install
npm start
```

---

### Run with Dev Client (recommended)

```bash
npm run dev:tunnel
```

---

## 📱 Dev Client Setup (Required for Phase 4+)

Expo Go does NOT support all native modules used in this app.

### Setup

```bash
npm install -g eas-cli
eas login
eas init
eas build:configure
```

---

### Build Dev Client

```bash
eas build --profile development --platform android
```

Install APK on device.

---

## 📦 Deployment (Planned)

- Standalone Android APK (EAS Build)
- Play Store release
- iOS TestFlight (optional)

---

## 📌 Resume Positioning

**Product Expiry & Warranty Tracker** — Designed and built a cross-platform, offline-first mobile utility using React Native and Expo to track product expiries and long-term warranties with:

- Local persistence (SQLite)
- OS-level notification scheduling
- File system-based document storage
- Service-layer architecture
- Optimized storage via compression and lifecycle management

---

## 📄 License

Personal / Educational Use

---

## 📝 Active TODOs

- Warranty duration shortcuts (2yr / 5yr / 10yr) - done
- Keyboard-safe notes input - done
- Default purchase date-done
- Required field indicators (\*) - done
- View attachments UI
- Expiry filters (7 days / 30 days / year)
- Category-based filtering / collapsable section for all items
- on click of item, show read only mode with attachments (same goes for notification as well)
- On click of List items in home screen, it should show item in read only mode
- Notification system deep dive

---

## 🧭 Architecture at a glance

Remember the ownership split:

- Product is the domain.
- Product repository owns SQLite and raw DB mapping.
- Product service owns create/update/delete orchestration, attachment staging, and notification coordination.
- Attachment service owns file lifecycle safety: save, replace, and delete files.
- Reminder config owns reminder offsets and notification identifiers.
- Feature hooks own screen behavior and state transitions.
- Screens stay thin and presentation-focused.
- Theme + styles own all visual decisions.
- Utilities stay generic and do not hide domain logic.

If you are deciding where a change belongs, ask: is it UI, state orchestration, product domain orchestration, persistence, or file-system safety? That rule keeps the architecture clean.
