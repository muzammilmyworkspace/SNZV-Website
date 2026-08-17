/**
 * Runs THIS codebase as the client portal only, on its own port.
 *
 *   npm run dev:portal      → http://localhost:3001  (hot reload, for review)
 *   npm run start:portal    → http://localhost:3001  (production build)
 *
 * The public marketing site keeps running on 3000 from the same repository,
 * untouched. Two servers, one codebase — so the portal can be reviewed and
 * signed off on its own origin without forking the project or duplicating the
 * design system, and without a marketing homepage sitting in front of it.
 *
 * WHY A NODE LAUNCHER RATHER THAN `PORTAL_ONLY=1 next dev`
 * That syntax is POSIX shell only. This project is developed on Windows, where
 * PowerShell reads it as a command name and fails. Setting the variable here
 * works identically on every platform, with no cross-env dependency.
 *
 * The port can be overridden:  npm run dev:portal -- --port 4000
 */
import { spawn } from "node:child_process";

const mode = process.argv[2] === "start" ? "start" : "dev";
const passthrough = process.argv.slice(3);

// An explicit --port wins; otherwise 3001, so it never collides with the
// public site on 3000.
const port = passthrough.includes("--port") ? [] : ["--port", "3001"];

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", mode, ...port, ...passthrough],
  {
    stdio: "inherit",
    env: { ...process.env, PORTAL_ONLY: "1" },
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
