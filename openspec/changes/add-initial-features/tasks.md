# Tasks

## 1. Confirm source and bootstrap boundaries

- [x] 1.1 Re-enumerate the public source tree over HTTP and record source revision, every .blend, existing GLBs, and metadata paths; verify the tree is complete and no source clone/checkout is created.
- [x] 1.2 Verify the existing source checkout remote and local changes, or select HTTP plus GitHub API publication; verify that only the explicitly authorized upstream export/catalog/guidance scope is included.
- [x] 1.3 Check destination repository availability and template instructions, preserve this proposal, and bootstrap the new public viewer repository with a fresh template Initial Commit; verify initial commit count and origin before adding project changes.
- [x] 1.4 Customize folder/name/Vite base/package scripts and project context while preserving planning artifacts; verify no unintended template placeholders remain and baseline install/test/build commands work.

## 2. Publish browser-ready source assets

- [x] 2.1 Define the source catalog schema and repeatable inventory/metadata extraction; verify unique path IDs, variant-specific provenance, unknown-field handling, and complete .blend coverage.
- [x] 2.2 Export the character, chest, and robot with required geometry/textures/animation; verify GLB validation and browser imports, reusing existing exports only after confirming they match their sources.
- [x] 2.3 Export the firehouse final, baseline, five attempts, pre-sky scene, and two transfer checks; verify each source path has a matching validated GLB and record material conversion diagnostics.
- [x] 2.4 Export fox, lamp, nook, greenhouse, tea scene, island, and floating forest; verify geometry/material visibility and report any unsupported features or size-related blockers.
- [x] 2.5 Reconcile any new source entries discovered since planning; verify every current .blend has a browser-ready catalog entry and no source file was destructively modified.
- [x] 2.6 Add source AGENTS.md requirements and regeneration/validation guidance; verify they require refreshing exports/catalog when models change and retaining provenance and export warnings.
- [x] 2.7 Review scoped source changes, commit and push authorized deliverables, and record the published SHA; verify catalog and every GLB are retrievable anonymously over HTTP and contain actual asset bytes rather than LFS pointer text.

## 3. Build the viewer

- [x] 3.1 Implement revision-pinned public catalog loading and validation; verify malformed schema, duplicate IDs, invalid paths, missing catalog, empty inventory, API limits, and retry with focused tests.
- [x] 3.2 Integrate Babylon rendering, neutral lighting, camera fit/orbit/zoom, and applicable animation; verify a static export, animated robot, and large environment in the browser.
- [x] 3.3 Add full-browser responsive React layout, Back/Next, filename/path, and position; verify endpoints, deterministic ordering, keyboard focus, landscape resize, and narrow-screen controls.
- [x] 3.4 Display available metadata with provenance, measured statistics, and export warnings; verify absent fields are not invented and remote text cannot inject HTML.
- [x] 3.5 Implement selection race protection, disposal, loading/error states, and model retry; verify rapid navigation never displays a stale selection and failed assets do not block other entries.

## 4. Release and documentation

- [x] 4.1 Implement manual patch-version release workflow with serialized version allocation and matching commit/tag/release/build; verify ordinary pushes do not release and failed checks prevent deployment.
- [x] 4.2 Configure Pages deployment for the exact release artifact and same-version retry/rollback; verify failure recovery does not allocate an unintended patch version.
- [x] 4.3 Add distribution checks that reject model binaries and embedded credentials from the viewer repository/build/release; verify these checks fail on a deliberately introduced prohibited fixture without retaining that fixture.
- [x] 4.4 Write project setup, model sourcing, release, and source-maintenance documentation and customize repository metadata; verify commands and source links match actual implementation.

## 5. End-to-end acceptance

- [x] 5.1 Run focused tests/build and browse every current catalog entry using only public remote assets; verify render success, metadata/path association, navigation, animation where applicable, and export warning visibility.
- [x] 5.2 Verify source catalog changes become visible on viewer reload without rebuilding the app, using controlled HTTP test responses; verify immutable asset URLs within a session.
- [x] 5.3 Run the first manual release and verify version agreement across tag, release, and live Pages app; confirm network requests retrieve models from the public source and shipped artifacts contain no models.
- [x] 5.4 Link the verified Pages URL in README and capture a current representative screenshot; verify the link, document remaining export limitations, and preserve the separate source publication SHA in delivery notes.
