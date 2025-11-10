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

function commitOnce() {
  const statusRaw = run("git", ["status", "--porcelain"]).trim();

  if (!statusRaw) {
    return false;
  }

  const statusLines = statusRaw.split("\n").filter(Boolean);
  const filesChanged = statusLines.map((line) => {
    const renameMatch = line.match(/^R.\s+(.*?)\s+->\s+(.*)$/);
    if (renameMatch) {
      return renameMatch[2];
    }

    const simplified = line.slice(3).trim();
    return simplified || line.trim();
  });

  const message = `made update to ${
    filesChanged.length ? ` - ${filesChanged.join(", ")}` : ""
  }`;

  run("git", ["add", "--all"]);
  run("git", ["commit", "-m", message]);

  console.log(`Created commit with message: "${message}"`);
  return true;
}

function main() {
  console.log(
    `Auto-commit watcher running (every ${
      INTERVAL_MS / 1000
    }s). Press Ctrl+C to stop.`
  );

  const tick = () => {
    try {
      const committed = commitOnce();
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
