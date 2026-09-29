import { useCallback, useEffect, useRef, useState } from "react";
import versionText from "../../version.txt?raw";
import { assetUrl, sourceUrl, loadCatalog, SOURCE } from "./catalog.js";
import { createViewer } from "./viewer.js";
const version = versionText.trim().replace(/^version=/, "");
const number = new Intl.NumberFormat("en");
export function App() {
  const [catalog, setCatalog] = useState(null),
    [catalogError, setCatalogError] = useState("");
  const [refresh, setRefresh] = useState(0),
    [index, setIndex] = useState(0),
    [retry, setRetry] = useState(0);
  const [view, setView] = useState({ status: "idle" }),
    [paused, setPaused] = useState(false),
    [graphicsError, setGraphicsError] = useState("");
  const [full, setFull] = useState(false),
    [settingsError, setSettingsError] = useState("");
  const viewer = useRef(null),
    model = catalog?.models[index];
  const modelCount = catalog?.models.length || 0;
  const navigate = useCallback(
    (direction) => {
      if (modelCount)
        setIndex((i) => (i + direction + modelCount) % modelCount);
    },
    [modelCount],
  );
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        !modelCount ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        event.target?.closest?.(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
        )
      )
        return;
      const key = event.key.toLowerCase();
      const direction =
        key === "a" || key === "arrowleft"
          ? -1
          : key === "d" || key === "arrowright"
            ? 1
            : 0;
      if (!direction) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(direction);
    };
    // Capture before the canvas camera's arrow-key handler.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [modelCount, navigate]);
  useEffect(() => {
    const abort = new AbortController();
    setCatalogError("");
    setCatalog(null);
    setIndex(0);
    loadCatalog({ signal: abort.signal })
      .then(setCatalog)
      .catch((e) => {
        if (e.name !== "AbortError") setCatalogError(e.message);
      });
    return () => abort.abort();
  }, [refresh]);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "model-canvas";
    canvas.setAttribute(
      "aria-label",
      "Interactive 3D model. Drag to orbit; scroll to zoom.",
    );
    canvas.tabIndex = 0;
    document.getElementById("content_layer").append(canvas);
    try {
      viewer.current = createViewer(canvas, setView);
    } catch {
      setGraphicsError(
        "3D graphics are unavailable. Enable WebGL or try another browser.",
      );
    }
    return () => {
      viewer.current?.dispose();
      viewer.current = null;
      canvas.remove();
    };
  }, []);
  useEffect(() => {
    if (model && viewer.current)
      viewer.current.load(
        assetUrl(catalog.revision, model.glbPath),
        model.view,
      );
  }, [model, catalog?.revision, retry]);
  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  async function fullscreen() {
    try {
      setSettingsError("");
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setSettingsError("Fullscreen is unavailable in this browser.");
    }
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            ◇
          </span>
          <div>
            <h1>Model Viewer</h1>
            <p>THE BLENDER COLLECTION</p>
          </div>
        </div>
        <a
          className="repo-link"
          href="https://github.com/SamuelAsherRivello/ai-skills-blender-model-viewer"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </header>
      <aside className="inspector" aria-label="Model information">
        <div className="eyebrow">
          <span className="dot" />
          PUBLIC COLLECTION{" "}
          <span className="entry-count">
            {catalog ? catalog.models.length + " MODELS" : "CONNECTING"}
          </span>
        </div>
        {model ? (
          <>
            <h2>{model.title}</h2>
            <p className="filename">{model.glbPath.split("/").at(-1)}</p>
            <div className="facts">
              <div>
                <span>FORMAT</span>
                <strong>glTF 2.0</strong>
              </div>
              <div>
                <span>FILE SIZE</span>
                <strong>{(model.byteSize / 1024 / 1024).toFixed(2)} MB</strong>
              </div>
            </div>
            <div className="path-block">
              <span>SOURCE PATH</span>
              <code>{model.sourcePath}</code>
            </div>
            <a
              className="source-link"
              href={sourceUrl(catalog.revision, model.sourcePath)}
              target="_blank"
              rel="noreferrer"
            >
              View Blender source ↗
            </a>
            {view.status === "ready" && (
              <section>
                <h3>IN THE VIEWPORT</h3>
                <div className="stats">
                  <span>
                    <b>{number.format(view.stats.meshes)}</b> meshes
                  </span>
                  <span>
                    <b>{number.format(view.stats.triangles)}</b> triangles
                  </span>
                  <span>
                    <b>{view.stats.materials}</b> materials
                  </span>
                </div>
                {view.stats.animations.length > 0 && (
                  <p className="clip">
                    Animation · {view.stats.animations.join(", ")}
                  </p>
                )}
              </section>
            )}
            <section>
              <h3>FROM THE SOURCE</h3>
              {model.metadata?.length ? (
                model.metadata.map((m, i) => (
                  <div className="metadata" key={i}>
                    <a
                      href={sourceUrl(catalog.revision, m.provenancePath)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {m.label} ↗
                    </a>
                    <p>{m.value}</p>
                  </div>
                ))
              ) : (
                <p className="muted">No additional documented metadata.</p>
              )}
            </section>
            {model.warnings?.length > 0 && (
              <details>
                <summary>
                  Export notes <span>{model.warnings.length}</span>
                </summary>
                {model.warnings.map((w, i) => (
                  <p className="muted" key={i}>
                    {w}
                  </p>
                ))}
              </details>
            )}
            <div className="revision">
              SOURCE REVISION{" "}
              <a
                href={
                  "https://github.com/" + SOURCE + "/commit/" + catalog.revision
                }
                target="_blank"
                rel="noreferrer"
              >
                {catalog.revision.slice(0, 7)}
              </a>
            </div>
          </>
        ) : (
          <div className="empty-info">
            <h2>
              {catalogError
                ? "Collection unavailable"
                : catalog
                  ? "No models yet"
                  : "Opening the collection"}
            </h2>
            <p>
              {catalogError ||
                (catalog
                  ? "The public catalog is empty."
                  : "Finding models and metadata from the public source repository.")}
            </p>
            {(catalogError || catalog) && (
              <button onClick={() => setRefresh((v) => v + 1)}>
                Retry collection
              </button>
            )}
          </div>
        )}
      </aside>
      <div className="viewport-caption">
        <span>LIVE 3D</span>
        <p>
          Drag to orbit <i>·</i> Scroll to zoom
          <br />A / D or ← / → to browse
        </p>
      </div>
      <div className="status" role="status" aria-live="polite">
        {graphicsError ? (
          <p>{graphicsError}</p>
        ) : model && view.status === "loading" ? (
          <p>
            <span className="spinner" />
            Loading {model.glbPath.split("/").at(-1)}
          </p>
        ) : model && view.status === "error" ? (
          <div>
            <p>Unable to display this model.</p>
            <small>{view.error}</small>
            <button onClick={() => setRetry((v) => v + 1)}>Retry model</button>
          </div>
        ) : null}
      </div>
      <footer>
        <div className="settings">
          <button
            onClick={() => viewer.current?.fit()}
            disabled={!model || view.status !== "ready"}
          >
            Reset view
          </button>
          <button onClick={fullscreen} aria-pressed={full}>
            Fullscreen
          </button>
          {view.stats?.animations.length > 0 && (
            <button
              onClick={() => {
                setPaused(!paused);
                viewer.current?.setPaused(!paused);
              }}
              aria-pressed={paused}
            >
              {paused ? "Play" : "Pause"}
            </button>
          )}
          {settingsError && <small role="status">{settingsError}</small>}
        </div>
        <nav aria-label="Model navigation">
          <button
            className="nav-button"
            disabled={!modelCount}
            aria-keyshortcuts="A ArrowLeft"
            onClick={() => navigate(-1)}
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <span className="position" data-testid="position">
            {model ? String(index + 1).padStart(2, "0") : "00"}{" "}
            <span>
              / {String(catalog?.models.length || 0).padStart(2, "0")}
            </span>
          </span>
          <button
            className="nav-button next"
            disabled={!modelCount}
            aria-keyshortcuts="D ArrowRight"
            onClick={() => navigate(1)}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
        <span className="version">v{version}</span>
      </footer>
    </>
  );
}
