# Demo Video Script — Team Task Manager

**Target length:** ~3 minutes (180s). Two browser windows side-by-side
(one normal, one incognito) so you can show admin + member at the same time.

The narration column is what to **say**. The actions column is what to **do
on screen**. Times are guidelines — don't rush, but trim if you run long.

---

## 0:00–0:12 — Intro & live URL (12s)

**Action:** Show the live Railway URL in the browser address bar. Be on the login page.

**Say:**
> "Hi, I'm Ritik. This is **Team Task Manager** — a full-stack MERN app I
> built for the assignment. Teams create projects, invite members with
> admin or member roles, and track tasks through to-do, in-progress, and
> done. Backend is Express on MongoDB, frontend is React 19 with Tailwind.
> The whole thing's deployed on Railway as a single service. Let me show you."

---

## 0:12–0:30 — One-click demo login (18s)

**Action:** Point at the **Try a demo account** section under the form. Click **Admin**. Land on the empty dashboard.

**Say:**
> "I added pre-seeded demo accounts so you don't need to sign up — clicking
> Admin signs me in as Demo Admin. There's also a regular signup flow
> below if you'd rather create your own user. Atlas seeds three demo
> users on first boot."

---

## 0:30–0:55 — Empty dashboard tour (25s)

**Action:** Stay on the dashboard. Move your cursor over each section as you describe it.

**Say:**
> "This is the dashboard. The four cards at the top aggregate across
> every project I'm a member of — total projects, plus task counts by
> status: to-do, in progress, and done. Below that is **Overdue** —
> tasks past their due date that aren't done yet — then **My open
> tasks**, and **Recent activity**. Right now I'm at zero everywhere
> because I haven't created any projects, so let me build one live."

---

## 0:55–1:20 — Create a project (25s)

**Action:**
1. Click **Projects** in the navbar.
2. Click **New project**.
3. Fill in: name = `Product Launch`, description = `Q2 launch — landing page, copy, press release`.
4. Click **Create**.
5. Click into the newly created project card.

**Say:**
> "I navigate to Projects, hit New project, and call it 'Product
> Launch'. Because I created it, I'm automatically the admin — that's
> the project creator. The Project model stores members as a
> sub-document with a role field, and the creator is added to that
> array with role 'admin' on creation."

---

## 1:20–1:45 — Add a member (25s)

**Action:**
1. Click the **Members** tab.
2. In the email field, type `demo.member@example.com`.
3. Click **Add**.
4. Show the member appearing with the role "member".
5. Show the role dropdown and remove button next to them.

**Say:**
> "Members tab. I add Demo Member by email — they're added as 'member'
> by default. As admin I can change anyone's role between admin and
> member, or remove them. The project creator is protected — you can't
> demote or kick them out. The backend enforces all of this through an
> `isProjectAdmin` middleware, not just the UI."

---

## 1:45–2:15 — Create tasks (30s)

**Action:** Click **Tasks** tab → **New task**. Create these in quick succession (use the same modal, just keep clicking New task):

1. `Ship press release` — assignee: Demo Member, priority: high, due: **yesterday's date** (so it shows up as overdue).
2. `Design landing page` — assignee: Demo Member, priority: medium, due: 3 days from now, status: in_progress.
3. `Write product copy` — assignee: Sara Coder, priority: medium.
4. `Set up analytics` — assignee: Demo Admin, status: done.

**Say:**
> "Now four tasks. First — 'Ship press release', assigned to Demo
> Member, due yesterday on purpose so we'll see it flagged as overdue.
> Second — 'Design landing page', already in progress. Third —
> 'Write product copy' assigned to Sara. Fourth — 'Set up analytics',
> marked done. Each task has title, description, assignee, status,
> priority, and a due date. Tasks reference the project and the
> assignee user via Mongo ObjectIds — proper relationships, not
> embedded copies."

After creating, point at the three columns: **To do / In progress / Done**.

> "The board groups by status. Two to-do, one in progress, one done."

---

## 2:15–2:30 — Dashboard recap (15s)

**Action:** Click the **Dashboard** link in the navbar.

**Say:**
> "Back on the dashboard, the cards now show one project, four tasks
> across the columns, and 'Ship press release' shows up in the
> red **Overdue** section because its due date has passed and the
> status isn't done."

---

## 2:30–2:55 — Member view + RBAC (25s)

**Action:**
1. Switch to your **second browser window** (incognito).
2. On the login page, click **Member**. Land on dashboard.
3. Open the same project.
4. Click "Ship press release".
5. Try to click into the **Title** field — show it's disabled.
6. Change the **Status** dropdown to "In progress".
7. Click **Save** → toast appears.
8. Close modal, click "Write product copy" (assigned to Sara, not me).
9. Show the read-only banner: "you can only update tasks assigned to you".

**Say:**
> "Same project from the member's account. I can see everything, but
> watch what happens when I open my assigned task — title, description,
> assignee, priority, due date are all locked. The only thing I can
> change is status. I move it to 'In progress' and save. If I open a
> task assigned to someone else — completely read-only. The server
> rejects any other field with a 403 — I'm not relying on the UI for
> security."

---

## 2:55–3:10 — Wrap (15s)

**Action:** Switch back to the admin window, refresh the project. The task the member moved is now in the In progress column.

**Say:**
> "Refreshing the admin window — the member's status update is
> reflected immediately. That's the whole flow: auth with httpOnly
> JWT cookies, projects with member management, tasks with role-based
> access enforced server-side, and a dashboard that aggregates with
> overdue detection. GitHub repo and live URL are in the form. Thanks
> for watching."

---

## Pre-recording checklist

- [ ] Live Railway URL works — open it, then `<URL>/api/health` shows `{ "success": true }`.
- [ ] Atlas DB has only the **3 demo users** and **no projects/tasks** (run the cleanup once: `mongosh "<your atlas URI>" --eval 'db.projects.deleteMany({});db.tasks.deleteMany({})'`).
- [ ] Two browser windows: normal profile (admin) + incognito (member).
- [ ] Demo login buttons work on both windows.
- [ ] Mic levels OK; macOS Do Not Disturb on so no banner notifications interrupt.

## Recording tips

- **Mac:** `Cmd+Shift+5` → Record Selected Portion → tick **Microphone**. Or QuickTime → File → New Screen Recording.
- Pre-rehearse the click path once before recording so you don't fumble.
- Trim: QuickTime → Edit → Trim. Export 1080p.
- Form caps the upload at 1 GB; a 3-min 1080p mp4 is typically 50–150 MB, well under.
