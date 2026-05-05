# Demo Video Script (2–4 minutes)

Record at 1080p with screen + mic. Use **two browser windows side-by-side** so
you can show admin and member views at the same time without logging out — one
in your normal profile, one in a Chrome incognito / different profile so cookies
don't collide.

Total target: ~3 minutes. Speak naturally; bullets are *what to demo*, not
lines to read.

---

## 0:00–0:15 — Intro

> "Hi, I'm Ritik. This is **Team Task Manager** — a full-stack MERN app where
> teams create projects, invite members with admin or member roles, assign
> tasks, and track progress on a dashboard. Backend is Express + MongoDB,
> frontend is React 19 with Tailwind. Let me walk through it."

Show: live URL in the browser address bar.

## 0:15–0:35 — One-click demo login (Admin)

1. On the login page, point at the **Try a demo account** section.
2. Click **Admin**.

> "I added pre-seeded demo accounts so reviewers can jump straight in. Clicking
> Admin signs me in as Demo Admin — no signup needed. The data is auto-seeded
> on first server boot."

Land on the dashboard.

## 0:35–1:00 — Dashboard

Point out:
- **4 stat cards:** Projects, To do, In progress, Done
- **Overdue** section (red) — "Ship press release" is past its due date
- **My open tasks** — admin's open assignments
- **Recent activity** — latest 10 tasks across all projects

> "The dashboard aggregates across every project I'm a member of and surfaces
> what needs attention — overdue first, then my own open work."

## 1:00–1:30 — Project detail (admin view)

1. Click into **Product Launch**.
2. Show the three columns: **To do / In progress / Done**.
3. Click **New task** → fill in `Coordinate launch email`, assign to a member, set due date, priority high → Create.
4. Click an existing task ("Design landing page hero") → change priority or due date → Save.
5. Switch to the **Members** tab → show the three members with their roles. Show the role dropdown and the remove button.

> "As admin I have full control: create, edit, delete tasks; manage members
> and their roles."

## 1:30–2:15 — Member view (RBAC enforcement)

1. Switch to the **second browser window**. From the login page, click **Member**.
2. Land on the dashboard — note the member's open tasks include the ones assigned to them.
3. Open the same project.
4. Click "Ship press release" (assigned to this member).
5. Try to change the **title** — show that the field is disabled.
6. Change **status** to "In progress" → Save → toast.
7. Click an unassigned task ("Review with stakeholders").
8. Show "Read-only — you can only update tasks assigned to you."
9. Switch to **Members** tab — show no Add member form, no role dropdowns, no remove buttons.

> "Members can read everything, but the UI and the API both lock them down:
> they can only update status on tasks they're assigned to. The server enforces
> this independently — no client-side workaround possible."

## 2:15–2:35 — Back to admin: live update

1. Switch back to the admin window, refresh the project.
2. Show the task the member just moved is now in the In progress column.

## 2:35–3:00 — Wrap

> "That's the role-based flow end-to-end: signup is also there if you want a
> fresh account, projects, members, tasks, status tracking, and a dashboard
> with overdue detection. The repo's on GitHub, the live URL is in the form,
> and there's a README with API docs and the deploy steps. Thanks for watching."

---

## Pre-recording checklist

- [ ] Live URL is up — visit `<railway-url>/api/health` and check `{ "success": true }`.
- [ ] Demo data is seeded — log in as `demo.admin@example.com` / `Demo@123` and confirm the **Product Launch** project exists with 5 tasks.
- [ ] Two browser windows ready: one for Admin, one (incognito or different profile) for Member.
- [ ] Mic levels OK, no notification chimes (Do Not Disturb on).

## Recording tips

- **Mac:** `Cmd+Shift+5` → Record Selected Portion → tick "Built-in Microphone".
  Or QuickTime → File → New Screen Recording.
- Pre-rehearse the click path once before hitting record so you don't fumble.
- Trim with QuickTime (`Edit → Trim`) or iMovie. Export at 1080p.
- Form caps file size at 1 GB; a 3-min 1080p mp4 is typically 50–150 MB.
