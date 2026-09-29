import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inspect } from "../scripts/check-distribution.mjs";
test("distribution checker rejects model files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "viewer-test-"));
  try {
    await writeFile(join(dir, "unwanted.glb"), "fixture");
    assert.equal((await inspect(dir)).length, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
