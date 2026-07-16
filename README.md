# Task Board — Client (Frontend)

A **mini-Trello** project & task management app. Single-page React app with a kanban board, drag-and-drop, priorities, due dates, and dark mode.

- 🌐 **Live app:** https://task-board-client-smoky.vercel.app
- 🔗 **Backend repo:** https://github.com/Chinonye1/task_board_server
- ⚙️ **Live API:** https://task-board-server-4bnh.onrender.com

> Note: the backend runs on a free tier that sleeps after inactivity — the **first** request after idle may take ~30–50s to wake, then it's fast.

---

## Features

- **Projects** — create, view, and delete (with confirmation). Responsive card grid.
- **Tasks** — full CRUD via a dialog form: title, description, **priority** (low/medium/high), and **due date**.
- **Kanban board** — three columns (To Do / In Progress / Done) with live task counts.
- **Drag & drop** — move tasks between columns; changes persist to the database.
- **Visual signals** — priority-colored card borders, status-tinted cards, and **overdue / due-soon** highlighting on dates.
- **Toasts** — success/error feedback on every action.
- **Dark mode** — theme toggle that persists across refreshes.

---

## Tech Stack

- **React 19 + TypeScript**
- **Vite** — build tool & dev server
- **Material UI (MUI)** + **Emotion** — component library & styling
- **React Router** — client-side routing (SPA)
- **@dnd-kit** — drag and drop
- Talks to a REST API (see backend repo)

---

## Local Setup

### Prerequisites
- Node.js 18+
- The [backend API](https://github.com/Chinonye1/task_board_server) running (locally or deployed)

### Steps
```bash
# 1. Clone
git clone https://github.com/Chinonye1/task_board_client.git
cd task_board_client

# 2. Install
npm install

# 3. Create a .env file (see below)

# 4. Run in dev
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### Environment variables (`.env`)
```env
# Base URL of the backend API
VITE_API_URL=http://localhost:3000/api
```
> `VITE_` variables are baked in at **build time**. In production (Vercel), this is set to the deployed API URL via the dashboard, which overrides this file.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

---

## Deployment (Vercel)

Deployed on Vercel with the **Vite** preset:

- **Environment variable:** `VITE_API_URL` = the deployed backend's `/api` URL
- `vercel.json` rewrites all routes to `index.html` so client-side deep links don't 404 on refresh.

---

## Project Structure

```
src/
├── main.tsx              # Entry: router + MUI theme (light/dark) + providers
├── App.tsx               # Layout shell (AppBar + <Outlet/>)
├── colorMode.ts          # Dark-mode context
├── lib/api.ts            # Fetch helper (get/post/put/delete)
├── types.ts              # Project & Task types
├── pages/
│   ├── ProjectsPage.tsx  # List / create / delete projects
│   └── BoardPage.tsx     # Kanban board for one project
└── components/
    ├── DraggableTask.tsx # A task card (draggable)
    ├── DroppableColumn.tsx # A status column (drop zone)
    └── TaskDialog.tsx    # Create/edit task form
```
