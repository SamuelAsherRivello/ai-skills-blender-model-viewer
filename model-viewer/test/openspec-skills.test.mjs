import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const repositoryRoot = new URL("../../", import.meta.url);
const skillsRoot = new URL(".agents/skills/", repositoryRoot);

test("keeps OpenSpec skill folders discoverable by Codex", async () => {
  const target = await readFile(
    new URL(".openspec-target", skillsRoot),
    "utf8",
  );
  assert.equal(target.trim(), "codex");

  const skillDirectories = (
    await readdir(skillsRoot, { withFileTypes: true })
  ).filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("openspec-"),
  );

  assert.ok(skillDirectories.length > 0, "expected generated OpenSpec skills");

  for (const directory of skillDirectories) {
    const skill = await readFile(
      new URL(`${directory.name}/SKILL.md`, skillsRoot),
      "utf8",
    );
    const frontmatterName = skill.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    assert.equal(frontmatterName, directory.name);
    const generatedBy = skill.match(
      /^\s+generatedBy:\s*["']?([^"'\s]+)["']?$/m,
    )?.[1];
    assert.equal(generatedBy, "1.13.1");
  }
});
