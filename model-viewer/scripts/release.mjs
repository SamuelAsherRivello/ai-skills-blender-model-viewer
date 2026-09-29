import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const requested = process.env.EXISTING_VERSION || "";
const marker = "Model Viewer release run " + process.env.GITHUB_RUN_ID;
let tag = requested;
if (tag && !/^v\d+\.\d+\.\d+$/.test(tag))
  throw new Error("Invalid release tag");
if (!tag) {
  tag =
    git("tag", "--list", "v*")
      .split("\n")
      .find(
        (t) =>
          t &&
          git(
            "for-each-ref",
            "--format=%(contents)",
            "refs/tags/" + t,
          ).includes(marker),
      ) || "";
}
if (tag) {
  git("checkout", tag);
  if (readFileSync("version.txt", "utf8").trim() !== "version=" + tag.slice(1))
    throw new Error("Tag and version.txt disagree");
} else {
  const version = readFileSync("version.txt", "utf8")
    .trim()
    .replace(/^version=/, "");
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error("Invalid baseline version");
  const [major, minor, patch] = version.split(".").map(Number);
  tag = "v" + major + "." + minor + "." + (patch + 1);
  writeFileSync("version.txt", "version=" + tag.slice(1) + "\n");
  git("config", "user.name", "github-actions[bot]");
  git(
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  );
  git("add", "version.txt");
  git("commit", "-m", "chore: release " + tag);
  git("tag", "-a", tag, "-m", marker);
  git("push", "--atomic", "origin", "HEAD:main", "refs/tags/" + tag);
}
appendFileSync(process.env.GITHUB_OUTPUT, "tag=" + tag + "\n");
console.log("Releasing " + tag);
