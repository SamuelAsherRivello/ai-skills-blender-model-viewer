# Proposal

## Why

The public Blender examples need a browser-based way to inspect their geometry and metadata without downloading Blender. A separately released viewer should remain current with source models without packaging those models into its own releases.

## What Changes

- Create SamuelAsherRivello/ai-skills-blender-model-viewer from the current github-repository-template snapshot with fresh history; use model-viewer/ for the application and Model Viewer as the display name.
- Build a React full-browser, landscape-first interface with interactive 3D, Back/Next navigation, current filename, position, and sourced metadata.
- Discover and load models and metadata over public HTTP from SamuelAsherRivello/ai-skills-blender. Never clone/check out that repository for viewer discovery or bundle models into viewer releases.
- As an explicitly authorized upstream prerequisite, create a GLB counterpart for every source .blend, publish a catalog and export diagnostics, and update source AGENTS.md to require maintaining these deliverables. Commit and push this scoped source work to make it public.
- Add a manually invoked release workflow that increments the patch version, publishes a GitHub release, and deploys that version to GitHub Pages. Link the live viewer from README.

## Capabilities

### New Capabilities

- `public-model-catalog`: Upstream browser-ready exports, provenance, catalog publication, and public HTTP discovery.
- `model-viewer`: Full-browser React interface, interactive rendering, sequential navigation, metadata, and failure states.
- `viewer-releases`: Template-based repository identity, versioned manual releases, Pages hosting, and model-free distribution.

### Modified Capabilities

None; this project has no existing accepted specifications.

## Impact

Viewer: React/Vite template, proposed Babylon.js renderer, HTTP catalog client, README, tests, version file, and GitHub workflows. Source repository: new GLB assets/catalog/export tooling or documentation and AGENTS.md; source edits are a separate explicitly authorized work scope, not ordinary edits under this viewer's local OpenSpec root.

Public HTTP inspection on 2026-09-29 found 20 .blend files and two GLB exports (chest and robot), across final scenes, iterations, baselines, and transfer checks. Re-enumerate at implementation time. Public availability is now confirmed. Export fidelity is an acceptance risk, especially procedural materials and large scenes; it must be validated rather than assumed.
