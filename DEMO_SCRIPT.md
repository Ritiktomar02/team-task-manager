# Demo Video Script — Team Task Manager (~3 minutes)

Two browser windows side-by-side: **Window A** (normal) for Admin,
**Window B** (incognito) for Member. Read the **dialogue** out loud while
performing the **action**. Don't rush — natural pace is fine.

---

## 0:00 – 0:20 · Intro

**Action:** Show the live URL in the address bar, then the login page with the
Admin / Member demo buttons visible.

**Dialogue:**
> "Hi, I'm Ritik. This is **Team Task Manager** — a full-stack MERN application
> I built for this assignment. It lets teams create projects, invite members
> with admin or member roles, assign tasks, and track progress on a dashboard.
> The backend is Node and Express talking to MongoDB through Mongoose, the
> frontend is React 19 with Tailwind, and it's deployed as a single service
> on Railway. Let me walk you through it."

---

## 0:20 – 0:40 · One-click demo login

**Action:** Point at the **Try a demo account** section. Click **Admin**. Land
on the empty dashboard.

**Dialogue:**
> "I added pre-seeded demo accounts so reviewers can skip the signup flow.
> Clicking Admin signs me in as Demo Admin instantly. Of course there's a
> regular signup form below if you'd rather create a new account — auth uses
> bcrypt-hashed passwords and JWT in an httpOnly cookie. I'll go in as Admin."

---

## 0:40 – 1:05 · Empty dashboard tour

**Action:** Hover over each section as you talk.

**Dialogue:**
> "This is the dashboard. The four cards at the top aggregate across every
> project I'm a member of — total projects, plus task counts by status:
> to-do, in-progress, and done. Below that, three sections: **Overdue**, in
> red, lists tasks past their due date that aren't done yet; **My open
> tasks** are my own assignments; and **Recent activity** shows the latest
> changes. Right now everything's empty because I haven't created a project —
> let me build one live."

---

## 1:05 – 1:30 · Create a project

**Action:** Click **Projects** → **New project**. Name: `Product Launch`.
Description: `Q2 launch — landing page, copy, press release`. Hit Create.
Click into the new project card.

**Dialogue:**
> "I head over to Projects and click New project. I'll call it 'Product
> Launch' with a quick description. Because I created it, I'm automatically
> the admin — the Project model stores members as a sub-document with a role
> field, and the creator is added with role admin on creation. The project
> opens up with two tabs, Tasks and Members."

---

## 1:30 – 1:55 · Add a member

**Action:** Click the **Members** tab. Type `demo.member@example.com` in the
email input. Click **Add**. The member appears in the list with role "member".
Hover over the role dropdown and remove button.

**Dialogue:**
> "On the Members tab, I add Demo Member by email — the backend looks them up
> in the User collection and pushes a new entry into this project's members
> array. They're added as 'member' by default. As admin, I can change anyone's
> role between admin and member, or remove them entirely — except the project
> creator, who's protected from being removed or demoted. All of this is
> enforced by an `isProjectAdmin` middleware on the server, not just hidden in
> the UI."

---

## 1:55 – 2:30 · Create tasks

**Action:** Switch back to **Tasks** tab → **New task**. Create these in
order, reusing the modal:

1. `Ship press release` — assignee Demo Member, priority high, **due yesterday's date** (so it'll show as overdue), status to-do.
2. `Design landing page` — assignee Demo Member, status in-progress, priority medium, due 3 days from now.
3. `Write product copy` — unassigned, status to-do.

**Dialogue:**
> "Now let me add some tasks. First — 'Ship press release', I'll assign it to
> Demo Member, mark it high priority, and set the due date to yesterday on
> purpose so we'll see how the dashboard flags it as overdue. Second — 'Design
> landing page', also assigned to the member, already in progress. And one
> more, 'Write product copy', unassigned for now. Each task has title,
> description, assignee, status, priority, and due date — all stored as proper
> ObjectId references to the user and project, not embedded copies."

Point to the three columns.

> "The board groups tasks by status — two in to-do, one in progress."

---

## 2:30 – 3:05 · Member view + RBAC

**Action:** Switch to **Window B** (incognito). On the login page, click the
**Member** demo button. Land on dashboard. Open the same project. Click
"Ship press release" (assigned to me).

Try clicking the **Title** field — it's disabled. Change **Status** to "In
progress". Click Save. Toast appears.

Close modal, click "Write product copy" (unassigned, not mine). Show the
read-only banner.

**Dialogue:**
> "Now I'm logged in as Demo Member in a separate window. I open the same
> project — I can see everything, but watch what happens when I try to edit my
> task. Title, description, assignee, priority, due date — all locked. The
> only thing I can change is status. I'll move 'Ship press release' to In
> progress and save. If I open a task that isn't mine, the modal goes
> completely read-only, and the server rejects any other field with a 403
> Forbidden — so even if someone bypasses the UI with a direct API call, the
> middleware blocks them. That's the role-based access control working
> end-to-end."

---

## 3:05 – 3:25 · Back to admin & overdue

**Action:** Switch to **Window A**. Refresh the page. Show the In-progress
column now has the task the member moved. Click **Dashboard** in the navbar.

**Dialogue:**
> "Back as the admin, I refresh, and the status change the member just made is
> reflected immediately. Heading to the dashboard — the cards now show one
> project, three tasks across the columns, and 'Ship press release' is in the
> red Overdue section because its due date has passed and it's not done. The
> dashboard is just a Mongo aggregation that runs across every project the
> current user belongs to."

---

## 3:25 – 3:40 · Wrap

**Dialogue:**
> "And that's the full flow — authentication with httpOnly cookies, projects
> with team management, tasks with role-based access enforced on the server,
> and a dashboard with overdue detection. The GitHub repo and the live URL
> are in the form. Thanks for watching."

---

## Pre-recording checklist

- [ ] `<URL>/api/health` returns `{"success":true,"status":"ok"}`.
- [ ] Two windows open: normal profile (will be Admin) + incognito (will be Member).
- [ ] macOS Do Not Disturb on, no chat / email banners.
- [ ] Mic checked, headphones off speakers (no echo).

## Recording tips

- Mac: `Cmd+Shift+5` → Record Selected Portion → tick **Microphone** → start.
- Run through the full click path once *without* recording so the order's locked in.
- Trim with QuickTime → Edit → Trim. Export 1080p mp4 (well under the 1 GB form limit).
