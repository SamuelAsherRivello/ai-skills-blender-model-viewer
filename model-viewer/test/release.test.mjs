import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";
test("release retry reuses its version; next run allocates one patch", () => {
  mkdirSync(".local", { recursive: true });
  const dir = mkdtempSync(resolve(".local/release-test-")),
    repo = join(dir, "repo"),
    remote = join(dir, "remote.git");
  mkdirSync(repo);
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    git("init", "--bare", remote);
    git("init", "-b", "main");
    git("config", "user.name", "Test");
    git("config", "user.email", "test@example.invalid");
    writeFileSync(join(repo, "version.txt"), "version=0.0.2\n");
    git("add", ".");
    git("commit", "-m", "Initial");
    git("remote", "add", "origin", remote);
    git("push", "-u", "origin", "main");
    const run = (id, version = "") =>
      execFileSync(
        process.execPath,
        [resolve("model-viewer/scripts/release.mjs")],
        {
          cwd: repo,
          windowsHide: true,
          stdio: "pipe",
          env: {
            ...process.env,
            GITHUB_RUN_ID: id,
            GITHUB_OUTPUT: join(dir, "output"),
            EXISTING_VERSION: version,
          },
        },
      );
    run("100");
    assert.equal(
      readFileSync(join(repo, "version.txt"), "utf8"),
      "version=0.0.3\n",
    );
    const first = git("rev-parse", "HEAD");
    run("100");
    assert.equal(git("rev-parse", "HEAD"), first);
    assert.equal(git("tag", "--list"), "v0.0.3");
    git("checkout", "main");
    run("101");
    assert.equal(
      readFileSync(join(repo, "version.txt"), "utf8"),
      "version=0.0.4\n",
    );
    run("102", "v0.0.3");
    assert.equal(git("rev-parse", "HEAD"), first);
    assert.equal(git("tag", "--list").split("\n").length, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
