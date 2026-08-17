/**
 * Runs THIS codebase as the client portal only, on its own port.
 *
 *   npm run dev:portal      → http://localhost:3001  (real sign-in)
 *   npm run start:portal    → http://localhost:3001  (production build)
 *   npm run dev:demo        → http://localhost:3002  (role preview, no login)
 *
 * `dev:demo` additionally sets DEMO_MODE, which switches on /demo — the four
 * role previews. It runs on its own port so the login-required portal and the
 * no-login preview can be open side by side and compared.
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
const demo = process.argv.includes("--demo");
const passthrough = process.argv.slice(3).filter((a) => a !== "--demo");

// An explicit --port wins; otherwise 3001, so it never collides with the
// public site on 3000.
const port = passthrough.includes("--port")
  ? []
  : ["--port", demo ? "3002" : "3001"];

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", mode, ...port, ...passthrough],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PORTAL_ONLY: "1",
      // Only ever set by an explicit --demo. Never inferred, never defaulted.
      ...(demo ? { DEMO_MODE: "1" } : {}),
    },
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
