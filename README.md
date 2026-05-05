# Team Task Manager

A full-stack MERN web app where teams create projects, invite members, assign
tasks, and track progress with role-based access (Admin / Member).

## Live Demo

- App: _replace with your Railway URL after deploy_
- Health: `/api/health`

## Features

- **Authentication** — signup / login / logout with httpOnly JWT cookies, bcrypt-hashed passwords.
- **Projects & Team Management** — create projects, invite members by email, change member roles, remove members. Project creator is always an admin.
- **Tasks** — create / edit / delete with title, description, assignee, status (`todo` / `in_progress` / `done`), priority (`low` / `medium` / `high`), and due date.
- **Role-Based Access (RBAC)**
  - **Admin** — full project control: edit project, add/remove members, change roles, create/edit/delete any task.
  - **Member** — view all project tasks; can only update the status of tasks assigned to them.
- **Dashboard** — across all your projects: project count, status counts, overdue tasks, your open tasks, recent activity.
- **REST API** — clean resource-oriented endpoints, validations, populated relationships.

## Tech Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4, Axios    |
| Backend  | Node.js, Express 5, JWT, bcrypt                          |
| Database | MongoDB + Mongoose                                       |
| Hosting  | Railway (single service serving API + built React SPA)   |

## Project Structure

```
team-task-manager/
├── backend/
│   ├── config/             # db connection
│   ├── controllers/        # auth, project, task
│   ├── middlewares/        # auth + RBAC (isUser, isProjectMember, isProjectAdmin)
│   ├── models/             # User, Project, Task
│   ├── routes/             # /api/user, /api/projects, /api/tasks
│   ├── utils/              # token, avatar
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, TaskRow, TaskFormModal, MembersPanel, ...
│   │   ├── context/        # UserContext + UserProvider
│   │   ├── pages/          # Login, SignUp, Dashboard, Projects, Project
│   │   ├── services/       # api.js (axios + endpoint constants)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── package.json            # root: orchestrates install/build/start
└── railway.json            # Railway deploy config
```

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone and install

```bash
git clone https://github.com/Ritiktomar02/team-task-manager.git
cd team-task-manager
npm install            # cascades into backend/ and frontend/
```

### 2. Configure backend env

Copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_ACCESS_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

### 3. Configure frontend env

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_BASE_URL=http://localhost:8080
```

### 4. Run

In two terminals:

```bash
npm run dev:backend     # http://localhost:8080
npm run dev:frontend    # http://localhost:5173
```

Visit http://localhost:5173, sign up, and you're in.

## API Reference

All endpoints are JSON; auth is via the `accessToken` httpOnly cookie set on login/register. All requests must include credentials.

### Auth — `/api/user`

| Method | Path        | Auth | Body                                    |
| ------ | ----------- | ---- | --------------------------------------- |
| POST   | `/register` | —    | `{ username, email, password }`         |
| POST   | `/login`    | —    | `{ email, password }`                   |
| POST   | `/logout`   | —    |                                         |
| GET    | `/profile`  | ✓    |                                         |
| GET    | `/search`   | ✓    | `?q=...` (returns matching users)       |

### Projects — `/api/projects`

| Method | Path                                   | Auth     | Notes                                |
| ------ | -------------------------------------- | -------- | ------------------------------------ |
| POST   | `/`                                    | user     | Create project (creator = admin)     |
| GET    | `/`                                    | user     | List projects you are a member of    |
| GET    | `/:projectId`                          | member   | Project detail                       |
| PATCH  | `/:projectId`                          | admin    | Update name/description              |
| DELETE | `/:projectId`                          | admin    | Delete project + all its tasks       |
| POST   | `/:projectId/members`                  | admin    | Add member by email `{ email, role }`|
| DELETE | `/:projectId/members/:userId`          | admin    | Remove member (creator protected)    |
| PATCH  | `/:projectId/members/:userId/role`     | admin    | `{ role: "admin" \| "member" }`      |

### Tasks — `/api/tasks`

| Method | Path                       | Auth                | Notes                                                |
| ------ | -------------------------- | ------------------- | ---------------------------------------------------- |
| GET    | `/dashboard`               | user                | Aggregated stats across user's projects              |
| GET    | `/project/:projectId`      | member              | List tasks for a project                             |
| POST   | `/`                        | admin               | Create task — body: `{ projectId, title, ... }`     |
| PATCH  | `/:taskId`                 | admin / assignee    | Admin can edit all; assignee can only change status  |
| DELETE | `/:taskId`                 | admin               | Delete task                                          |

## Data Models

- **User** — `username, email (unique), password (bcrypt, select:false), picture`
- **Project** — `name, description, createdBy (User), members[{ user: User, role: "admin"|"member" }]`
- **Task** — `project (Project), title, description, assignee (User|null), status, priority, dueDate, createdBy (User)`

Relationships: `Project.members.user` and `Task.assignee` reference `User`. Deleting a project deletes its tasks. Removing a member nulls their assignments.

## Deployment (Railway)

1. **MongoDB Atlas** — create a free cluster at https://cloud.mongodb.com, create a DB user, allow network access from `0.0.0.0/0`, and copy the connection string.
2. **Push** this repo to GitHub.
3. **New Project on Railway** → "Deploy from GitHub repo" → pick this repo.
4. **Set env variables** in the Railway service → Variables:
   - `NODE_ENV=production`
   - `PORT=8080` (Railway will inject one too; the app reads `PORT`)
   - `MONGO_URI=<your atlas URI>`
   - `JWT_ACCESS_SECRET=<long random string>`
   - `CLIENT_URL=https://<your-railway-domain>.up.railway.app`
5. **Generate domain** — Settings → Networking → Generate Domain.
6. Railway runs `npm install` (cascades), `npm run build` (builds the frontend), and `npm start` (boots Express, which serves both `/api/*` and the built React app).
7. Hit your domain in a browser. The first signup creates the first user.

`railway.json` configures the build/start/healthcheck. The Express server in production mode serves `frontend/dist` and falls back to `index.html` for any non-`/api` path so deep-linked SPA routes work.

## License

ISC
