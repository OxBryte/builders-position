#!/usr/bin/env node

import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runWithOutput(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: ["ignore", "pipe", "inherit"],
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  return result.stdout;
}

function main() {
  const status = runWithOutput("git", ["status", "--porcelain"]).trim();

  if (!status) {
    console.log("No changes to commit. Working tree clean.");
    return;
  }

  const message =
    process.argv.slice(2).join(" ") ||
    `Auto commit ${new Date().toISOString().replace(/[:.]/g, "-")}`;

  run("git", ["add", "--all"]);
  run("git", ["commit", "-m", message]);

  console.log(`Created commit with message: "${message}"`);
}

main();
