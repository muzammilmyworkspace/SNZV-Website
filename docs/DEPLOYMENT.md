# Deployment runbook — SnZ Ventures

Production target: **Vercel** + **PostgreSQL** + **private object storage**.

Everything in this repository is written so that a deploy with *no* portal
credentials still succeeds and still serves the public marketing site. That is
deliberate: enabling the portal must never be able to take the public site
down. You can therefore do the steps below in order, at your own pace, and the
site stays live throughout.

---

## 0. What works before you configure anything

| Area | Without credentials |
| --- | --- |
| Public pages, sitemap, robots, OG images | Fully live |
| `/login`, `/register` | Render "Portal not yet enabled" |
| `POST /api/auth/*` | `503` + `"Authentication is not configured on this server."` |
| `/portal/*` | `307` → `/login` |
| Enquiry form | `503` + the direct phone/email/WhatsApp details are shown |

No feature ever silently pretends to work.

---

## 1. Connect the repository to Vercel

1. <https://vercel.com/new> → Import `muzammilmyworkspace/SNZV-Website`.
2. Framework preset: **Next.js**. Leave build and output settings at defaults.
3. Deploy. The public site is live at this point.
4. Add the custom domain under **Settings → Domains** and point DNS at Vercel.

Every push to `main` redeploys automatically from here on.

---

## 2. Provision PostgreSQL

Any PostgreSQL **13 or newer**. Neon, Supabase, Vercel Postgres, RDS and
Railway are all fine. The schema needs **no extensions** — it uses core
`gen_random_uuid()` — so it installs cleanly on managed roles that are not
allowed to `CREATE EXTENSION`.

Take the **pooled** connection string (Neon's `-pooler` host, Supabase port
`6543`). The client runs with `prepare: false`, so transaction pooling is safe.

```
postgres://user:password@host/dbname?sslmode=require
```

---

## 3. Set environment variables in Vercel

**Settings → Environment Variables**, scope *Production* (and *Preview* if you
want a staging portal — give it a **separate database**).

Generate the session secret locally and paste it straight in. It must never be
committed, and it must never appear in a log line:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Required for the portal:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | pooled connection string from step 2 |
| `AUTH_SECRET` | the 64-char hex string generated above |
| `NEXT_PUBLIC_SITE_URL` | `https://www.snzventures.com` |

Then document storage (**one** of the two) and email (**one** of the two) — see
[.env.example](.env.example) for the full annotated list.

Redeploy after adding variables: **Deployments → ⋯ → Redeploy**. Next.js
inlines `NEXT_PUBLIC_*` at build time, so a redeploy is genuinely required.

---

## 4. Create the schema

Run from your machine, against the same database:

```bash
# macOS / Linux
DATABASE_URL='postgres://…' npm run db:migrate

# Windows PowerShell
$env:DATABASE_URL='postgres://…'; npm run db:migrate
```

The runner is transactional and checksummed: each migration applies inside a
transaction, its hash is recorded, and it refuses to run if an already-applied
migration file has been edited. `npm run db:status` shows what would run
without applying anything.

To validate SQL changes before they touch a real database, `npm run db:verify`
applies every migration to an in-memory Postgres and exercises the queries the
app actually issues.

---

## 5. Create the first Super Admin

There is deliberately **no** public path to a staff role and **no** seeded
account. The first super admin is created by CLI:

```bash
DATABASE_URL='postgres://…' npm run db:bootstrap -- \
  --email you@snzventures.com --name "Your Name"
```

The password is generated, printed **once**, and stored only as a scrypt hash.
Save it, sign in, then change it via **Forgot password**. Re-running against an
existing email promotes that account instead of duplicating it.

From then on, super admins create everyone else in **Portal → Staff → Users &
roles**.

---

## 6. Configure document storage

Client documents contain passports, transcripts and financial records. They are
never written to `/public`, to git, or to the Vercel filesystem.

**S3-compatible (recommended).** Create a bucket with *all* public access
blocked, plus an access key limited to that bucket. Set `S3_BUCKET`,
`S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. The app
signs its own SigV4 URLs (no AWS SDK) and issues ~2-minute GET links only after
a server-side authorisation check.

**Vercel Blob.** Simpler, with one honest caveat: the Blob SDK only issues
`access: "public"` objects, so the unguessable 20-hex key is the only boundary.
Access control still happens server-side — the storage key is never sent to a
browser — but prefer S3 for regulated data.

---

## 7. Configure email

Set `RESEND_API_KEY` **or** `MAIL_WEBHOOK_URL` + `MAIL_WEBHOOK_SECRET`, then
`MAIL_FROM` (a domain you have verified with the provider) and `MAIL_TO`.

Email carries enquiry notifications, email verification and password resets.
Reset links are built from `NEXT_PUBLIC_SITE_URL`, so that must be correct
before you rely on them.

---

## 8. Verify the live deployment

```bash
SITE=https://www.snzventures.com

curl -s -o /dev/null -w '%{http_code}\n' $SITE                    # 200
curl -s -o /dev/null -w '%{http_code}\n' $SITE/sitemap.xml        # 200
curl -s -o /dev/null -w '%{http_code}\n' $SITE/login              # 200
curl -s -o /dev/null -w '%{http_code}\n' $SITE/portal             # 307 → /login
```

Then, in a browser:

1. Sign in as the super admin from step 5.
2. **Staff → Users & roles** — the list shows real accounts and no invented rows.
3. Create an advisor. Confirm the role dropdown offered to an *admin* excludes
   `super_admin`, and that you cannot change your own role or status.
4. Register a test client at `/register`. Confirm only Student / Professional /
   Business are offered.
5. Upload a document as that client, review it as staff, and check that the
   download link is `/api/portal/documents/<id>` — never a storage URL.
6. **Staff → Audit log** — the actions above appear, with no password, token or
   secret anywhere in the payload.

Empty tables are expected to show designed empty states, not zeros dressed up
as achievements.

---

## Security invariants

These are enforced in code; keep them true in any future change.

- **Authorisation is server-side and expressed in SQL.** Client queries carry
  `client_id = $viewer`; advisor queries join `staff_assignments`. A row the
  viewer may not see is never fetched, so it cannot leak through a UI bug.
- **Role never comes from the browser.** It is read from the signed session and
  re-checked against the database on each request, so a suspension takes effect
  immediately rather than at next login.
- **Privilege escalation is blocked five ways** in `app/api/admin/users/route.ts`:
  caller must be admin or above; `assignableRoles()` caps what they may grant;
  nobody may change their own role or status; only a super admin may modify
  another super admin; every change is audited.
- **Registration cannot create staff.** The public route accepts only
  `student`, `professional`, `business`.
- **Audit logs never record secrets.** Sensitive keys are stripped, with a
  regex denylist (`password|secret|token|api_key|authorization|cookie|hash`) as
  a second line of defence.
- **Middleware is UX, not security.** It runs on the Edge runtime, which has no
  `node:crypto`, so it only checks that a cookie is *present*. Signature
  verification happens in `getSession()` on the Node runtime, in every page and
  route. Never rely on middleware alone.
- **Secrets stay out of git.** `.gitignore` blocks `.env*` except this
  template, plus `.data/`, audit artefacts and screenshots.

---

## Rollback

Vercel keeps every build. **Deployments → pick the last good one → Promote to
Production.** Database migrations are forward-only; to reverse a schema change,
write a new migration rather than editing an applied one — the checksum guard
will otherwise refuse to run.
