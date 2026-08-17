import { db, safeQuery } from "../client";

/**
 * OPERATIONS REPOSITORY (migration 003)
 * ---------------------------------------------------------------------------
 * Status history, staff-only notes, and the multi-step intake forms.
 *
 * Same rule as lib/db/repos/portal.ts: SCOPE IN SQL, never in the component.
 * Two boundaries in this file are load-bearing and must not be relaxed:
 *
 *   1. `admin_notes` has NO client-facing read function. Not a filtered one —
 *      none at all. If a client-visible surface cannot call it, it cannot leak
 *      from one.
 *
 *   2. `status_history` reads split into two functions rather than one with a
 *      boolean. `getClientHistory` hardcodes `internal = FALSE` in the query
 *      text, so the caller cannot pass a flag that accidentally reveals an
 *      internal transition.
 */

/* ------------------------------------------------------------------ types */

export type HistoryEntry = {
  id: string;
  entity: "case" | "application" | "document";
  entityId: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  /**
   * TRUE for entries withheld from the client. Always FALSE on anything
   * `getClientHistory` returns — that query filters it in SQL — so a staff
   * view can label it without any risk of the flag reaching a client surface.
   */
  internal: boolean;
  actorName: string | null;
  createdAt: string;
};

export type AdminNote = {
  id: string;
  body: string;
  authorName: string | null;
  caseId: string | null;
  createdAt: string;
};

export type IntakeForm = {
  id: string;
  userId: string;
  pathway: "study" | "career" | "business";
  status: "draft" | "submitted" | "under_review" | "accepted" | "returned";
  step: number;
  data: Record<string, unknown>;
  submittedAt: string | null;
  updatedAt: string;
};

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

/* -------------------------------------------------------- status history */

/**
 * Record a transition. Called from the same place that performs the update, so
 * the trail cannot drift from the actual status.
 *
 * `internal: true` keeps the entry off every client surface — use it for
 * transitions that are real but not the client's business.
 */
export async function recordStatus(input: {
  entity: HistoryEntry["entity"];
  entityId: string;
  subjectId: string | null;
  fromStatus?: string | null;
  toStatus: string;
  note?: string | null;
  internal?: boolean;
  actorId?: string | null;
}): Promise<void> {
  await safeQuery(async () => {
    await db()`
      INSERT INTO status_history
        (entity, entity_id, subject_id, from_status, to_status, note, internal, actor_id)
      VALUES (
        ${input.entity}, ${input.entityId}, ${input.subjectId},
        ${input.fromStatus ?? null}, ${input.toStatus}, ${input.note ?? null},
        ${input.internal ?? false}, ${input.actorId ?? null}
      )
    `;
    return null;
  }, null);
}

const mapHistory = (r: Record<string, unknown>): HistoryEntry => ({
  id: String(r.id),
  entity: r.entity as HistoryEntry["entity"],
  entityId: r.entity_id as string,
  fromStatus: (r.from_status as string) ?? null,
  toStatus: r.to_status as string,
  note: (r.note as string) ?? null,
  internal: Boolean(r.internal),
  actorName: (r.actor_name as string) ?? null,
  createdAt: iso(r.created_at)!,
});

/**
 * The client's own journey.
 *
 * `subject_id = viewer` scopes it to them, and `internal = FALSE` is written
 * into the query rather than accepted as an argument — see the header note.
 */
export async function getClientHistory(
  viewerId: string,
  limit = 60
): Promise<HistoryEntry[]> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT h.*, u.name AS actor_name
      FROM status_history h
      LEFT JOIN users u ON u.id = h.actor_id
      WHERE h.subject_id = ${viewerId} AND h.internal = FALSE
      ORDER BY h.created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(mapHistory);
  }, []);
}

/** Staff view of one entity's trail — internal entries included. */
export async function getEntityHistory(
  entity: HistoryEntry["entity"],
  entityId: string
): Promise<HistoryEntry[]> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT h.*, u.name AS actor_name
      FROM status_history h
      LEFT JOIN users u ON u.id = h.actor_id
      WHERE h.entity = ${entity} AND h.entity_id = ${entityId}
      ORDER BY h.created_at DESC
    `;
    return rows.map(mapHistory);
  }, []);
}

/** Staff view of everything recorded about one client. */
export async function getSubjectHistory(
  subjectId: string,
  limit = 100
): Promise<HistoryEntry[]> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT h.*, u.name AS actor_name
      FROM status_history h
      LEFT JOIN users u ON u.id = h.actor_id
      WHERE h.subject_id = ${subjectId}
      ORDER BY h.created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(mapHistory);
  }, []);
}

/* ------------------------------------------------------------ admin notes */
/* STAFF ONLY. There is deliberately no client-scoped reader in this section. */

export async function addAdminNote(input: {
  subjectId: string;
  caseId?: string | null;
  authorId: string;
  body: string;
}): Promise<AdminNote | null> {
  return safeQuery(async () => {
    const [row] = await db()`
      INSERT INTO admin_notes (subject_id, case_id, author_id, body)
      VALUES (${input.subjectId}, ${input.caseId ?? null}, ${input.authorId}, ${input.body})
      RETURNING id, body, case_id, created_at
    `;
    return row
      ? {
          id: row.id as string,
          body: row.body as string,
          caseId: (row.case_id as string) ?? null,
          authorName: null,
          createdAt: iso(row.created_at)!,
        }
      : null;
  }, null);
}

export async function getAdminNotes(subjectId: string): Promise<AdminNote[]> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT n.id, n.body, n.case_id, n.created_at, u.name AS author_name
      FROM admin_notes n
      LEFT JOIN users u ON u.id = n.author_id
      WHERE n.subject_id = ${subjectId}
      ORDER BY n.created_at DESC
    `;
    return rows.map((r) => ({
      id: r.id as string,
      body: r.body as string,
      caseId: (r.case_id as string) ?? null,
      authorName: (r.author_name as string) ?? null,
      createdAt: iso(r.created_at)!,
    }));
  }, []);
}

export async function deleteAdminNote(id: string, authorId: string): Promise<boolean> {
  return safeQuery(async () => {
    // Scoped to the author: a note is one person's record of a call, and
    // letting any staff member delete another's would make the trail unusable.
    const rows = await db()`
      DELETE FROM admin_notes WHERE id = ${id} AND author_id = ${authorId} RETURNING id
    `;
    return rows.length > 0;
  }, false);
}

/* ----------------------------------------------------------- intake forms */

const mapIntake = (r: Record<string, unknown>): IntakeForm => ({
  id: r.id as string,
  userId: r.user_id as string,
  pathway: r.pathway as IntakeForm["pathway"],
  status: r.status as IntakeForm["status"],
  step: Number(r.step ?? 0),
  data: (r.data as Record<string, unknown>) ?? {},
  submittedAt: iso(r.submitted_at),
  updatedAt: iso(r.updated_at)!,
});

export async function getIntake(
  userId: string,
  pathway: IntakeForm["pathway"]
): Promise<IntakeForm | null> {
  return safeQuery(async () => {
    const [row] = await db()`
      SELECT * FROM intake_forms
      WHERE user_id = ${userId} AND pathway = ${pathway}
    `;
    return row ? mapIntake(row) : null;
  }, null);
}

/**
 * Save & continue.
 *
 * The JSONB is MERGED (`data || excluded.data`), not replaced, so a step that
 * posts only its own fields cannot wipe the eight steps either side of it.
 *
 * `step` takes the higher of old and new so that going back to edit step 2
 * does not reset the resume point to 2 and hide steps 3–9.
 *
 * A submitted form stops accepting draft writes — the guard is in the WHERE
 * clause, not in the caller.
 */
export async function saveIntakeDraft(input: {
  userId: string;
  pathway: IntakeForm["pathway"];
  step: number;
  data: Record<string, unknown>;
}): Promise<IntakeForm | null> {
  return safeQuery(async () => {
    const [row] = await db()`
      INSERT INTO intake_forms (user_id, pathway, step, data)
      VALUES (${input.userId}, ${input.pathway}, ${input.step}, ${db().json(input.data as never)})
      ON CONFLICT (user_id, pathway) DO UPDATE
        SET data       = intake_forms.data || EXCLUDED.data,
            step       = GREATEST(intake_forms.step, EXCLUDED.step),
            updated_at = now()
        WHERE intake_forms.status = 'draft'
      RETURNING *
    `;
    return row ? mapIntake(row) : null;
  }, null);
}

/** Final submit. Same draft-only guard, so a form cannot be submitted twice. */
export async function submitIntake(input: {
  userId: string;
  pathway: IntakeForm["pathway"];
  data: Record<string, unknown>;
}): Promise<IntakeForm | null> {
  return safeQuery(async () => {
    const [row] = await db()`
      UPDATE intake_forms
         SET data         = intake_forms.data || ${db().json(input.data as never)},
             status       = 'submitted',
             submitted_at = now(),
             updated_at   = now()
       WHERE user_id = ${input.userId}
         AND pathway = ${input.pathway}
         AND status  = 'draft'
      RETURNING *
    `;
    return row ? mapIntake(row) : null;
  }, null);
}

/** Staff: move a submitted intake on, or send it back for changes. */
export async function setIntakeStatus(
  id: string,
  status: IntakeForm["status"]
): Promise<boolean> {
  return safeQuery(async () => {
    const rows = await db()`
      UPDATE intake_forms SET status = ${status}::intake_status, updated_at = now()
      WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
  }, false);
}

export async function getIntakeById(id: string): Promise<IntakeForm | null> {
  return safeQuery(async () => {
    const [row] = await db()`SELECT * FROM intake_forms WHERE id = ${id}`;
    return row ? mapIntake(row) : null;
  }, null);
}

/** Staff queue — submitted intakes waiting to be read, oldest first. */
export async function getIntakeQueue(limit = 100) {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT f.*, u.name AS user_name, u.email AS user_email, u.role AS user_role
      FROM intake_forms f
      JOIN users u ON u.id = f.user_id
      WHERE f.status <> 'draft'
      ORDER BY f.submitted_at ASC NULLS LAST
      LIMIT ${limit}
    `;
    return rows.map((r) => ({
      ...mapIntake(r),
      userName: r.user_name as string,
      userEmail: r.user_email as string,
      userRole: r.user_role as string,
    }));
  }, []);
}
