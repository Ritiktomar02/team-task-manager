# Demo Video Script — Team Task Manager (~2 min)

Two browser windows side-by-side: **Window A** (normal) for Admin,
**Window B** (incognito) for Member.

| Time | What to do | What to say |
| ---- | ---------- | ----------- |
| **0:00–0:10** | Show the live URL, then the login page. | "Hi, I'm Ritik. This is **Team Task Manager** — a MERN app with role-based access. Backend is Express + MongoDB, frontend is React, deployed on Railway. Let me show you." |
| **0:10–0:20** | Click the **Admin** demo button. Land on the empty dashboard. | "I added demo accounts so you can skip signup — I'll log in as Admin." |
| **0:20–0:50** | Go to **Projects → New project**. Name: `Product Launch`. Open it. **Members tab** → add `demo.member@example.com`. **Tasks tab** → New task: `Ship landing page`, assign to Demo Member, due **yesterday** (so it's overdue), priority high. New task: `Write copy`, assign to Demo Member, in_progress. | "I create a project — I'm automatically the admin. I invite a member by email. Then I create two tasks — one due yesterday so we'll see it flagged as overdue, one in progress." |
| **0:50–1:20** | Switch to **Window B**. Click the **Member** demo button. Open the same project. Click `Ship landing page`. Try clicking the title — it's disabled. Change **Status** to "In progress" → Save. Open `Write copy` (assigned to me too) → change status. Try opening any other task → show fields are read-only. | "Same project, but as a member. Title, assignee, due date are all locked. The only thing I can change is status — and only on tasks assigned to me. The server enforces this, not just the UI." |
| **1:20–1:40** | Switch back to **Window A**. Click **Dashboard**. | "Back to admin. Dashboard aggregates across all my projects: status counts, my open tasks, and overdue — `Ship landing page` is in red because its due date passed and it's not done." |
| **1:40–2:00** | Click into the project, show the In progress column has the task the member just moved. | "And the status changes the member made show up live. That's the full flow — auth, projects, members, tasks, RBAC, and the overdue dashboard. GitHub link and live URL are in the form. Thanks." |

## Pre-recording checklist

- [ ] `<URL>/api/health` returns `{"success":true,"status":"ok"}`
- [ ] Two windows ready, one normal + one incognito
- [ ] Mac Do Not Disturb on
- [ ] Use `Cmd+Shift+5` to record screen + mic, trim with QuickTime
