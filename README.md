# ApexStudio — Mobile App Showcase & Admin Engineering Platform Prototype

A high-fidelity frontend prototype built with **React 19**, **Vite 8**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Live Prototype Server

The prototype is currently running at:
**[http://localhost:5173/](http://localhost:5173/)**

Or launch with the batch file in the repository root:
```bash
.\run-showcase.bat
```

Or from this folder:
```bash
npm run dev
```

---

## 📱 Public App Showcase

### 1. Home Page (`/`)
* **Interactive Hero**: Features an interactive 3D smartphone mockup with instant app toggling between **ShoeCheck AI**, **FoodAI**, and **PulseFit Pro**.
* **Metrics Ticker**: Displays studio numbers (5.8M+ downloads, 4.86★ rating, 7+ shipped apps).
* **Featured Flagship Apps**: Highlighted top productions with live category tags and platform badges.
* **Latest Projects Showcase**: Filterable portfolio grid.
* **Technology & Architecture**: Comprehensive breakdown of mobile tech (Flutter, Swift/Metal, Kotlin Multiplatform, TensorFlow Lite, CoreML, and FastAPI).
* **Call-to-Action & Footer**: Store download triggers and quick links to the Admin Studio Portal.

### 2. Projects Marketplace (`/projects`)
* **Real-Time Live Search**: Filters across app name, tagline, description, and technologies.
* **Platform Filters**: `All`, `Android`, `iOS`, `Android + iOS`.
* **Category Filters**: `AI & Computer Vision`, `Health & Fitness`, `Finance & Crypto`, `Productivity & Tools`, `Travel & Navigation`.
* **Sort Controls**: *Featured First*, *Highest Rating*, *Most Downloaded*, *Alphabetical (A-Z)*.
* **Rich App Cards**: Logo, category, description, platform badges, technologies chips, star rating, downloads count, and *"View Project"* button.

### 3. Project Details (`/projects/:id`)
* **Specifications**: App icon, rating, version, package size, target OS, and download counts.
* **Interactive Demo Video Player**: Simulated player with Play/Pause, Mute/Unmute, timeline scrubber, and dynamic neural scanning HUD.
* **High-Resolution Gallery**: Screenshots with click-to-zoom Lightbox modal.
* **Action Buttons**: Apple App Store, Google Play, Product Website, and GitHub repository (triggers prototype feedback modals).
* **Key Features & Technologies**: Bullet points and framework tags.
* **Related Applications**: Contextual recommendations from the catalog.

### 4. Studio Pages
* **About (`/about`)**: Studio philosophy, on-device AI focus, and 2023–2026 timeline milestones.
* **Contact (`/contact`)**: Interactive inquiry form with feedback, direct contacts, and FAQ accordion.

---

## 🛡️ Admin Dashboard & Developer Permissions

### 1. Admin Authentication (`/admin/login`)
* UI-only mock authentication with instant **1-Click Test Persona Selectors**:
  * **Alex Rivera** *(Owner)*: Full Code Editor, Merge & Deploy access.
  * **Marcus Vance** *(Developer)*: Code Editor enabled, Deploy/Merge locked.
  * **David Kim** *(Content Manager)*: Code Editor locked.

### 2. Dashboard Overview (`/admin`)
* Key Metrics: *Total Projects*, *Published Projects*, *Android Apps*, *iOS Apps*, *Total Developers*.
* Interactive SVG **Monthly Downloads Growth** chart and **Platform Distribution** gauge.
* Recent Projects and live real-time **Activity Feed**.

### 3. Project Management (`/admin/projects`)
* Table View and Grid View switcher.
* Live toggles for **Published / Draft** status and **Featured** star.
* Delete confirmation modal.
* `+ Add Project` button.

### 4. Add/Edit Project Form (`/admin/projects/new` & `/admin/projects/:id/edit`)
* Complete form for app name, tagline, short description, full description, logo URL, cover URL, screenshot manager, demo video URL, features, technologies, platform, category, store URLs, and status toggles.
* **Side-by-Side Live Card Preview**: Updates dynamically as you type.
* Saves changes to reactive state and persists to `localStorage`.

### 5. Developer Permission Matrix (`/admin/users`)
* Team members list with Role, Status, and Code Access state.
* **Granular Permission Modal**:
  * Role dropdown: `Owner`, `Developer`, `Editor`, `Content Manager`.
  * Permissions checkboxes:
    * ☑ *View Projects*
    * ☑ *Add Projects*
    * ☑ *Edit Projects*
    * ☑ *Code Editor*
    * ☑ *Create Branch*
    * ☑ *Preview Changes*
    * ☐ *Merge to Production*
    * ☐ *Deploy Production*
* **1-Click "Simulate User"**: Test permission enforcement from any user's perspective.

### 6. Cloud Code Editor Sandbox (`/admin/code`)
* Monaco/VS Code dark aesthetic.
* **File Explorer**: Browse `app/page.tsx`, `components/Navbar.tsx`, `components/ProjectCard.tsx`, etc.
* **Editable Code Buffer**: TypeScript/React code with line numbers.
* **Toolbar Actions**:
  * **Branch Selector & "Create Branch"**: Prompts for branch name (e.g. `feature/homepage-update`).
  * **"Save Changes"**: Saves to local buffer with notification.
  * **"Preview"**: Sandbox modal displaying simulated component output.
  * **"Deploy"**: Production release pipeline with simulated build steps and confetti celebration.
* **Permission Enforcement**:
  * If `Code Editor = OFF`: Sidebar item shows locked badge; navigating to `/admin/code` renders an **Access Denied / Permission Restricted** screen.
  * If `Deploy Production = OFF`: The Deploy button is disabled with a lock icon.
  * If `Merge to Production = OFF`: The Merge button is disabled with a lock icon.

---

## 🎨 Design Aesthetic
* **Styling**: Modern premium technology-company look with dark/light theme toggle.
* **Typography**: Plus Jakarta Sans & JetBrains Mono.
* **State Management**: Reactive React Context with `localStorage` persistence.
* **Build System**: Vite 8 + React 19 + Tailwind CSS + Lucide Icons + Canvas Confetti.
