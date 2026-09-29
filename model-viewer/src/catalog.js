export const SOURCE = "SamuelAsherRivello/ai-skills-blender";
export const CATALOG_PATH = "documentation/models/index.json";
export function safePath(p) {
  return (
    typeof p === "string" &&
    p.length > 0 &&
    !/[\\?#:%\u0000-\u001f]/.test(p) &&
    !p.startsWith("/") &&
    p.split("/").every((s) => s && s !== "." && s !== "..")
  );
}
export function assetUrl(revision, path) {
  if (!/^[a-f0-9]{40}$/.test(revision) || !safePath(path))
    throw new Error("Invalid source asset path or revision.");
  return `https://raw.githubusercontent.com/${SOURCE}/${revision}/${path.split("/").map(encodeURIComponent).join("/")}`;
}
export function sourceUrl(revision, path) {
  assetUrl(revision, path);
  return `https://github.com/${SOURCE}/blob/${revision}/${path.split("/").map(encodeURIComponent).join("/")}`;
}
export function validateCatalog(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.models))
    throw new Error("Unsupported catalog schema. Expected version 1.");
  const ids = new Set();
  for (const m of data.models) {
    if (
      !m ||
      m.id !== m.sourcePath ||
      ids.has(m.id) ||
      !safePath(m.sourcePath) ||
      !m.sourcePath.endsWith(".blend") ||
      !safePath(m.glbPath) ||
      !m.glbPath.endsWith(".glb") ||
      !Number.isSafeInteger(m.byteSize) ||
      m.byteSize < 1 ||
      typeof m.title !== "string"
    )
      throw new Error("Invalid or duplicate model entry.");
    ids.add(m.id);
    if (
      m.view &&
      (![m.view.position, m.view.target].every(
        (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite),
      ) ||
        !Number.isFinite(m.view.frameHeight) ||
        m.view.frameHeight <= 0 ||
        !Number.isFinite(m.view.aspect) ||
        m.view.aspect <= 0)
    )
      throw new Error("Invalid source camera framing.");
    if (m.previewPath && !safePath(m.previewPath))
      throw new Error("Invalid preview path.");
    if (
      m.warnings &&
      (!Array.isArray(m.warnings) ||
        m.warnings.some((w) => typeof w !== "string"))
    )
      throw new Error("Invalid warnings.");
    if (
      m.metadata &&
      (!Array.isArray(m.metadata) ||
        m.metadata.some(
          (v) =>
            !v ||
            typeof v.label !== "string" ||
            typeof v.value !== "string" ||
            !safePath(v.provenancePath),
        ))
    )
      throw new Error("Invalid metadata provenance.");
  }
  return [...data.models].sort((a, b) =>
    a.sourcePath < b.sourcePath ? -1 : a.sourcePath > b.sourcePath ? 1 : 0,
  );
}
async function json(fetcher, url, signal) {
  const r = await fetcher(url, { signal, credentials: "omit" });
  if (!r.ok)
    throw new Error(
      [403, 429].includes(r.status)
        ? "GitHub is limiting public requests. Please wait and retry."
        : `Public source request failed (${r.status}). Please retry.`,
    );
  try {
    return await r.json();
  } catch {
    throw new Error("The public source returned invalid JSON.");
  }
}
export async function loadCatalog({ signal, fetcher = fetch } = {}) {
  const ref = await json(
    fetcher,
    `https://api.github.com/repos/${SOURCE}/git/ref/heads/main`,
    signal,
  );
  const revision = ref?.object?.sha;
  return {
    revision,
    models: validateCatalog(
      await json(fetcher, assetUrl(revision, CATALOG_PATH), signal),
    ),
  };
}
export function selectionGate() {
  let generation = 0;
  return { next: () => ++generation, current: (id) => id === generation };
}
