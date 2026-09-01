import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const children = [];

function run(command, args, cwd, name) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  child.on("error", (error) => {
    console.error(`${name} failed to start: ${error.message}`);
  });

  children.push(child);
  return child;
}

console.log("Starting UIForge frontend at http://localhost:5173");
run("npm", ["run", "dev"], path.join(root, "frontend"), "frontend");

console.log("Starting UIForge backend at http://127.0.0.1:7001");
run(
  "poetry",
  ["run", "uvicorn", "main:app", "--reload", "--port", "7001"],
  path.join(root, "backend"),
  "backend"
);

function shutdown() {
  for (const child of children) {
    child.kill();
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
