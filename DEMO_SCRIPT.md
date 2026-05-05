# Demo Video Script (2–5 minutes)

Record at 1080p with screen + mic. Two browser windows side-by-side help: one for **Alice (admin)**, one for **Bob (member)** in a different profile / incognito so cookies don't collide.

Total target: ~3 minutes. Speak naturally; the bullets are *what to demo*, not lines to read.

---

## 0:00–0:20 — Intro

> "Hi, I'm Ritik. This is **Team Task Manager**, a full-stack MERN app I built. Teams can create projects, invite members with admin/member roles, assign tasks, and track progress on a dashboard. The backend is Express + MongoDB; the frontend is React 19 with Tailwind. Single Railway service serves the API and the built React app. Let me walk through it."

Show: live URL in browser address bar.

## 0:20–0:50 — Sign up + first project (Alice / admin)

1. Open the live URL → click **Create an account**.
2. Sign up as Alice (`alice@example.com`).
3. Lands on dashboard — empty state.
4. Go to **Projects** → **New project** → "Q2 Launch Plan".

> "Alice just signed up and created a project. Because she's the creator, she's automatically the admin."

## 0:50–1:25 — Invite a member (Bob)

1. Open the project → switch to **Members** tab.
2. Add `bob@example.com`.
3. Show toast confirmation; show Bob in member list as "member".

> "I invited Bob by email. Notice he's added as a member, not an admin — only the creator and other admins can manage the project."

## 1:25–2:00 — Tasks (admin side)

1. Back to **Tasks** tab → **New task** → "Ship landing page" assigned to Bob, priority high, due tomorrow.
2. Add a second task — "Write copy", unassigned, status `in_progress`.
3. Show the three columns: To do / In progress / Done.

## 2:00–2:30 — Member view (Bob)

1. Switch to Bob's window — log in.
2. Dashboard shows the assigned task in "My open tasks" plus the status counts.
3. Open the project → click "Ship landing page".
4. Try to change the **title** — show that fields are disabled for him.
5. Change **status** to "In progress" → save → toast.

> "Bob can see all project tasks, but he can only update the status of tasks assigned to him. The title, assignee, due date, and priority are locked."

## 2:30–2:50 — Dashboard + overdue

1. Go back to Alice → set a task's due date to yesterday.
2. Open Dashboard → it appears in the **Overdue** section in red.

## 2:50–3:00 — Wrap

> "That's the role-based flow end-to-end: signup, projects, members, tasks, status tracking, and a dashboard with overdue detection. GitHub link and live URL are in the form. Thanks!"

---

## Recording tips

- **Mac:** QuickTime → New Screen Recording → enable mic. Or Cmd+Shift+5.
- Pre-create the accounts before hitting record so you don't fumble with passwords.
- Trim with QuickTime (Edit → Trim) or iMovie. Export at 1080p.
- File size for the form is capped at 1 GB, so a 3-min 1080p mp4 (~50–150 MB) is fine.
