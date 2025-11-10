#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const INTERVAL_MS = 30_000;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const err = new Error(
      result.stderr?.trim() || `Command failed: ${command} ${args.join(" ")}`
    );
    err.stderr = result.stderr;
    err.stdout = result.stdout;
    err.status = result.status;
    throw err;
  }

  return result.stdout ?? "";
}

function commitOnce(baseMessage) {
  const status = run("git", ["status", "--porcelain"]).trim();

  if (!status) {
    return false;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const message = baseMessage
    ? `${baseMessage} ${timestamp}`
    : `Auto commit ${timestamp}`;

  run("git", ["add", "--all"]);
  run("git", ["commit", "-m", message]);

  console.log(`Created commit with message: "${message}"`);
  return true;
}

function main() {
  const baseMessage = process.argv.slice(2).join(" ").trim();

  console.log(
    `Auto-commit watcher running (every ${
      INTERVAL_MS / 1000
    }s). Press Ctrl+C to stop.`
  );

  const tick = () => {
    try {
      const committed = commitOnce(baseMessage);
      if (!committed) {
        console.log("No changes to commit.");
      }
    } catch (error) {
      console.error(
        "Auto-commit failed:",
        error.stderr?.trim() || error.message
      );
    }
  };

  // Initial check right away then schedule interval
  tick();
  setInterval(tick, INTERVAL_MS);
}

main();
