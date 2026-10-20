# Taskflow: React To-Do List Application

> A clean, high-performance task management application built with **React 18**, **Vite 5**, **Vitest**, and a custom **Vanilla CSS Design Token System**, integrated with a REST API backend.

---

## Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [What Was Given & How It Was Solved](#what-was-given--how-it-was-solved)
- [Developer Quickstart & Local Setup](#developer-quickstart--local-setup)
- [Project Architecture](#project-architecture)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [License](#license)

---

## About the Project

**Taskflow** is a lightweight, zero-dependency task workstation designed for instant responsiveness and strict visual cohesion.

### Core Highlights
* **Full-Screen Workspace**: Designed to fit the viewport (`100vw` × `100vh`) with zero page-level window scrolling. The outer layout remains locked while only the task list scrolls internally.
* **Optimistic UI Engine**: Task toggles, edits, and deletions update the UI immediately with automated snapshot rollback on network failure.
* **Hybrid Data Persistence**: Hydrates initial tasks from a remote REST API and synchronizes all ongoing user updates into browser `localStorage`.
* **Zero UI Libraries**: Pure vanilla CSS with a strict 3-color design token system and zero bloated third-party component libraries.

---

## Key Features

* **Dynamic Progress Gauge**: SVG circular progress ring reflecting real-time task completion percentage and ratio.
* **Inline Task Editing**: Double-click any task title or click the edit icon to rename inline (`Enter` to save, `Escape` to cancel).
* **Multi-Dimensional Filters**: Filter by status (`All`, `To do`, `Done`), assigned `User ID`, or real-time debounced title search.
* **Light & Dark Themes**: Follows OS preferences (`prefers-color-scheme`) and persists user toggle state in `localStorage`.
* **Client-Side Pagination**: Smooth 10-item pagination with automated page reset when filters or search criteria change.
* **Resilient Feedback States**: Custom skeleton shimmer loader, empty search fallbacks, and non-blocking error notices.
* **Accessibility**: Keyboard focusable (`:focus-visible`), live screen reader updates (`aria-live="polite"`), and semantic HTML.

---

## Technology Stack

| Technology | Badge | Standard | Core Purpose |
| :--- | :--- | :--- | :--- |
| **React** | ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black) | `^18.3.1` | Declarative UI, `useReducer` state machine, memoized derived lists |
| **Vite** | ![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=flat-square&logo=vite&logoColor=white) | `^5.4.11` | Rapid ESM bundler configured on custom port `5189` |
| **Vitest** | ![Vitest](https://img.shields.io/badge/Vitest-2.1.8-729B1B?style=flat-square&logo=vitest&logoColor=white) | `^2.1.8` | High-speed unit test runner for reducer validation |
| **JavaScript** | ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ES2022+ | Native `fetch`, `AbortController`, and `crypto.randomUUID()` |
| **Vanilla CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-Design_Tokens-1572B6?style=flat-square&logo=css3&logoColor=white) | Custom Tokens | Strict 3-color palette (Slate Neutral, Electric Indigo, Emerald) |
| **Web Storage** | ![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-10B981?style=flat-square) | LocalStorage API | Local persistence layer for immediate offline access |
| **REST API** | ![REST API](https://img.shields.io/badge/API-JSONPlaceholder-0284C7?style=flat-square) | JSONPlaceholder | Remote mock REST endpoint for initial task ingestion |

---

## What Was Given & How It Was Solved

### 1. Requirements & Constraints
* **Mock REST Endpoint**: Provided with [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) (200 initial tasks).
* **Read-Only Server**: The API does not actually persist writes. `POST` requests return a mock `id: 201`, and modifying non-existent remote IDs results in HTTP errors.
* **No External UI Framework**: All layouts, themes, and interactions had to be built with native CSS.
* **Viewport Lock**: Must fit the screen as a desktop application without full-page scrolling.

### 2. Solutions Implemented
* **Dual-Tier State Authority**: Local `useReducer` + `localStorage` serve as the single source of truth. Remote calls run in the background.
* **ID Isolation Boundary (`isRemoteId`)**: Locally created items use RFC4122 UUID strings. Only initial remote IDs (`<= 200`) trigger network `PATCH` / `DELETE` requests, avoiding API 404/500 errors.
* **Optimistic Updates & Rollback**: State updates instantly in 0ms. If network calls fail, state reverts to the captured snapshot and alerts the user.
* **Fixed Viewport Architecture**: `html, body { overflow: hidden; }` prevents page scrolling; only the internal task list container (`.list-wrap`) scrolls.

---

## Developer Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

---

### Installation & Running

```bash
# 1. Clone repository
git clone https://github.com/MuhammadShoaibKalim/To-Do-List-Application.git

# 2. Enter directory
cd To-Do-List-Application

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

> **Local Application URL**: [http://localhost:5189](http://localhost:5189)

---

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server on port `5189` with HMR |
| `npm run build` | Builds optimized production bundle in `/dist` |
| `npm run preview` | Previews production build locally on port `5189` |
| `npm test` | Runs Vitest unit tests |

---

## Project Architecture

```plaintext
To-Do-List-Application/
├── public/                       # Static public assets
├── src/
│   ├── api/
│   │   └── todosApi.js           # REST API client & remote ID guard
│   ├── components/
│   │   ├── AddTodoForm.jsx       # Task input form
│   │   ├── FilterBar.jsx         # Status and user filter controls
│   │   ├── Icons.jsx             # Inline zero-dependency SVGs
│   │   ├── Pagination.jsx        # Chunked page navigation
│   │   ├── ProgressRing.jsx      # SVG completion gauge
│   │   ├── SearchInput.jsx       # Search input with clear trigger
│   │   ├── States.jsx            # Skeletons, error message & empty view
│   │   ├── ThemeToggle.jsx       # Light / Dark theme button
│   │   ├── TodoItem.jsx          # Memoized task item with double-click edit
│   │   └── TodoList.jsx          # Semantic list container
│   ├── constants/
│   │   └── index.js              # Application constants & configuration
│   ├── hooks/
│   │   ├── useDebounce.js        # Debounce hook for search input
│   │   ├── useTheme.js           # Theme state & localStorage sync
│   │   └── useTodos.js           # Reducer, optimistic updates & cache
│   ├── styles/
│   │   └── app.css               # 3-color tokens, non-scrolling shell & themes
│   ├── test/
│   │   └── todosReducer.test.js  # Vitest reducer unit tests
│   ├── App.jsx                   # Main application layout orchestrator
│   └── main.jsx                  # React DOM mount point
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore rules for node_modules, envs & build
├── index.html                    # Application HTML5 shell
├── package.json                  # Dependencies & npm scripts
└── vite.config.js                # Vite configuration with port 5189
```

---

## Testing & Quality Assurance

Unit tests are written with **Vitest** to ensure state transitions remain deterministic.

```bash
npm test
```

* `TOGGLE`: Toggles task completion state.
* `ADD`: Prepends new tasks to the list.
* `UPDATE`: Updates task title on edit save.
* `DELETE`: Removes task by ID.
* `CLEAR_COMPLETED`: Removes all completed tasks.
* `ROLLBACK`: Restores snapshot and shows notice on failure.

---

## License

This project is licensed under the [MIT License](LICENSE).  
Copyright © 2026 Muhammad Shoaib Kalim. All rights reserved.
