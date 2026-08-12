import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { User, PublicUser, Role } from "./types";

/**
 * STORAGE ADAPTER
 * ---------------------------------------------------------------------------
 * ⚠ NOT PRODUCTION STORAGE.
 *
 * No database exists in this project yet, so this adapter persists to a JSON
 * file under .data/ (gitignored). It is real enough that the whole portal
 * works end to end in development, and it is deliberately behind an interface
 * so swapping in Postgres/Prisma is a single-file change.
 *
 * It is NOT suitable for production because:
 *   • file writes are not transactional and race under concurrency
 *   • it does not survive ephemeral/serverless filesystems
 *   • it does not scale past a single instance
 *
 * See CONTENT-HANDOFF.md → "Portal backend" for the migration checklist.
 */

export interface UserStore {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: {
    email: string;
    name: string;
    role: Role;
    passwordHash: string;
  }): Promise<User>;
  update(id: string, patch: Partial<Omit<User, "id">>): Promise<User | null>;
  list(): Promise<User[]>;
  countByRole(): Promise<Record<string, number>>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function readAll(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

async function writeAll(users: User[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write-then-rename so a crash mid-write cannot truncate the file.
  const tmp = `${USERS_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), "utf8");
  await fs.rename(tmp, USERS_FILE);
}

const normalise = (email: string) => email.trim().toLowerCase();

export const fileUserStore: UserStore = {
  async findByEmail(email) {
    const users = await readAll();
    return users.find((u) => u.email === normalise(email)) ?? null;
  },

  async findById(id) {
    const users = await readAll();
    return users.find((u) => u.id === id) ?? null;
  },

  async create({ email, name, role, passwordHash }) {
    const users = await readAll();
    const now = new Date().toISOString();
    const user: User = {
      id: randomUUID(),
      email: normalise(email),
      name: name.trim(),
      role,
      passwordHash,
      // No mail provider is wired for verification links yet; the flag exists
      // so the gate can be switched on without a migration.
      emailVerified: false,
      createdAt: now,
      profile: {},
    };
    users.push(user);
    await writeAll(users);
    return user;
  },

  async update(id, patch) {
    const users = await readAll();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) return null;
    users[i] = { ...users[i], ...patch, id: users[i].id };
    await writeAll(users);
    return users[i];
  },

  async list() {
    return readAll();
  },

  async countByRole() {
    const users = await readAll();
    return users.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {});
  },
};

export const users: UserStore = fileUserStore;

/** Strips the password hash. Use before anything crosses into a component. */
export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _omit, ...rest } = user;
  void _omit;
  return rest;
}
