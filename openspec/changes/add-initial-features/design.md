# Design

## Context

See proposal.md for motivation and confirmed scope. The current viewer directory started empty; the OpenSpec CLI created a minimal planning root. The public template already supplies React/Vite, separate content_layer and ui_layer elements, version metadata, and Pages/release workflows. Public source inspection found 20 Blender files and two GLBs; repeated result.blend names require path-based identity.

## Goals / Non-Goals

Goals: isolate source publication from app releases; maintain complete model coverage and traceable metadata; keep the viewer usable when individual assets fail.

Non-goals: editing models in the browser, browser-side Blender conversion, an authenticated backend, recreating Cycles renders exactly, bundling model snapshots, or historical version hosting at separate Pages URLs. Pages serves the latest successfully deployed viewer; release tags preserve app history.

## Decisions

### Repository bootstrap

During implementation, copy the template's current tracked snapshot via HTTP into the new repository without its history. Preserve these planning artifacts outside the initial template snapshot commit, create the template-required Initial Commit, then customize model-viewer/, display text, Vite base, documentation, workflows, and OpenSpec project context. Do not overwrite this change or generated skills blindly. Keep npm package/config files at the repository root and app source/tests under model-viewer/. Create a public destination repository because the intended deliverable is a public Pages viewer.

### Source export boundary

Do not clone/check out ai-skills-blender. Discovery always uses public HTTP. For the explicitly authorized source modification, first verify whether the existing user checkout belongs to the public source and preserves unrelated work; use that existing checkout if valid. Otherwise prepare changed files from HTTP and publish a scoped commit through the GitHub API without cloning. This upstream work is a separately scoped prerequisite to the repo-local viewer implementation; record its published commit SHA before integration.

Inventory every .blend, including baseline and iteration scenes. Use an existing matching validated chest.glb or robot.glb where appropriate; otherwise write result.glb beside the source. Preserve every original .blend. Export evaluated geometry, embedded textures, and relevant animation. Bake procedural materials into supported PBR channels when necessary; verify representative comparisons and record deviations. Do not claim all models are ready until every entry has a valid export. Do not execute embedded Blender scripts just because a source file contains them.

Publish documentation/models/index.json in the source repository. Proposed schemaVersion 1 entries contain id (source path), title, sourcePath, glbPath, byteSize, optional previewPath, metadata values paired with provenance paths, and export warnings. Include source content hashes for stale-export detection. Extract structured values from nearby output manifests first, then explicit statements from reviews and associated prompts. Keep variant-specific provenance and do not conflate AI target metadata with actual Blender output. Do not infer authors or licenses absent evidence. A repeatable generator and AGENTS.md describe regeneration and validation. Commit/push only owned source deliverables and scoped guidance edits; verify the published catalog and GLBs anonymously.

### HTTP data flow

Resolve the public source main revision through GitHub API once per session, then fetch the source-owned catalog and relative assets from raw.githubusercontent.com at that commit. This avoids a changing branch mixing catalog and assets. Check schema, paths, allowed source host/repository, and duplicates. Use public HTTP to reconcile the source tree against catalog coverage in integration checks. Prefer the catalog over scraping Markdown in every browser: extraction remains reproducible upstream, source links remain inspectable, and request volume is bounded. Cache per-session metadata, load selected GLBs lazily, and refresh the inventory on reload. Treat API 403/429, malformed JSON, missing assets, and network failures explicitly. No browser credentials and no build-time model downloads.

### Rendering and UI

Use React/Vite from the template plus Babylon.js and its GLB loader. Babylon is a proposed implementation choice suitable for scene, animation, orbit camera, and asset-container lifecycle support; Three.js would also work but adds no necessary behavior here. Mount the renderer in content_layer and React controls in ui_layer. Use a viewport-filling canvas with a compact landscape metadata panel and bottom navigation; collapse details appropriately on narrow screens. Preserve useful template corner roles without collisions. Fit an orbit camera to model bounds, provide neutral environment lighting, and retain applicable animation with predictable playback. Never stretch the scene to force an aspect ratio.

Sort catalog entries by source path. Disable navigation at endpoints. Use selection generation IDs to reject stale async completions and dispose the outgoing asset container and owned resources. Render remote metadata as text, never raw HTML. Measured geometry/material/animation counts are labeled separately from documented source values.

### Release pipeline

Use workflow_dispatch for Release; normal push checks can run CI but must not release/deploy implicitly. Serialize version allocation. Validate tests and production build, bump the template baseline patch version, commit/tag it, and create a release with matching app assets. Deploy that exact artifact through the official Pages workflow with the repository subpath base. Record deployment success separately from tag creation; a retry for an existing version must reuse its artifact/ref without another bump. Set README's stable Pages URL after verifying it works, and show the built version in the app. Inspect repository/build/release manifests to prohibit model binaries and secrets; source-owned metadata/catalog also remains remote rather than a copied inventory. Rollback redeploys a previously verified app version without altering source assets.

## Risks / Trade-offs

- Procedural materials and unsupported Blender features can lose fidelity: bake supported channels, inspect exports, record limitations, and report blocking cases rather than replacing them with previews.
- The largest observed .blend is approximately 38 MB; exported size can be much larger: measure GLB sizes/load behavior and optimize without silently dropping geometry or animation. Large-file public delivery must be verified, including LFS pointers if encountered.
- Public API limits/outages: one revision lookup per session, cache within the session, visible retry, and no embedded tokens.
- Remote source evolves independently: schema versioning and immutable per-session asset URLs protect consistency; acceptance uses current source coverage rather than hardcoded counts.
- Existing source work may be dirty: review scoped diffs and stage only authorized export/catalog/guidance changes; never sweep unrelated changes into the publication commit.

## Migration Plan

Publish validated source deliverables first, then bootstrap and implement the viewer, verify its real-browser HTTP integration, and invoke the first release. Confirm Pages version, external asset loading, and README URL. On failure retain the last successful Pages deployment and retry the same release where possible.

## Open Questions

Exact per-model baking parameters and optimization limits require inspecting the existing scenes during implementation. They do not change the GLB/catalog contract; export failures remain explicit delivery blockers. Destination repository availability and Pages permissions must be checked before bootstrap/release.
