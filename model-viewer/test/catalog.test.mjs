import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCatalog,
  assetUrl,
  loadCatalog,
  selectionGate,
} from "../src/catalog.js";
const sha = "a".repeat(40);
const model = {
  id: "examples/a/result.blend",
  sourcePath: "examples/a/result.blend",
  glbPath: "examples/a/result.glb",
  title: "A",
  byteSize: 100,
  metadata: [
    {
      label: "Review",
      value: "<script>bad()</script>",
      provenancePath: "examples/a/review.md",
    },
  ],
};
const catalog = { schemaVersion: 1, models: [model] };
test("catalog accepts empty and keeps metadata as inert text", () => {
  assert.deepEqual(validateCatalog({ schemaVersion: 1, models: [] }), []);
  assert.equal(
    validateCatalog(catalog)[0].metadata[0].value,
    model.metadata[0].value,
  );
});
test("rejects unsupported schema, duplicates and path escapes", () => {
  assert.throws(() => validateCatalog({ ...catalog, schemaVersion: 2 }));
  assert.throws(() => validateCatalog({ ...catalog, models: [model, model] }));
  for (const path of [
    "../x.glb",
    "/x.glb",
    "https://evil/x.glb",
    "a\\b.glb",
    "a/%2e%2e/x.glb",
  ])
    assert.throws(() =>
      validateCatalog({ ...catalog, models: [{ ...model, glbPath: path }] }),
    );
});
test("pins asset URLs and rejects invalid revisions", () => {
  assert.match(assetUrl(sha, model.glbPath), new RegExp("/" + sha + "/"));
  assert.throws(() => assetUrl("main", model.glbPath));
});
test("reload discovers changed upstream without a build", async () => {
  let revision = sha;
  const calls = [];
  const fetcher = async (url) => {
    calls.push(url);
    return {
      ok: true,
      json: async () =>
        url.includes("api.github") ? { object: { sha: revision } } : catalog,
    };
  };
  const first = await loadCatalog({ fetcher });
  revision = "b".repeat(40);
  const second = await loadCatalog({ fetcher });
  assert.notEqual(first.revision, second.revision);
  assert.ok(calls[1].includes(sha));
  assert.ok(calls[3].includes(revision));
});
test("network failures are actionable", async () => {
  for (const status of [403, 429, 404])
    await assert.rejects(
      loadCatalog({ fetcher: async () => ({ ok: false, status }) }),
      /retry/i,
    );
  await assert.rejects(
    loadCatalog({
      fetcher: async () => ({
        ok: true,
        json: async () => {
          throw new Error("bad");
        },
      }),
    }),
    /invalid JSON/,
  );
});
test("stale selection completions cannot win", () => {
  const gate = selectionGate();
  const old = gate.next();
  const latest = gate.next();
  assert.equal(gate.current(old), false);
  assert.equal(gate.current(latest), true);
});
