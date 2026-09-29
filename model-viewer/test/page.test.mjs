import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import vite from "../../vite.config.js";
test("Pages base and application layers", async () => {
  assert.equal(vite.base, "/ai-skills-blender-model-viewer/");
  const page = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.match(page, /<title>Model Viewer<\/title>/);
  assert.match(page, /id="content_layer"/);
  assert.match(page, /id="ui_layer"/);
});
