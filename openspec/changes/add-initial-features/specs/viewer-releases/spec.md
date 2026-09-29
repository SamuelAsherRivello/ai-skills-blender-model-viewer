## Purpose

Publish independently versioned Model Viewer application releases on GitHub Pages without distributing the externally hosted model collection.

## ADDED Requirements

### Requirement: Project identity
The project SHALL use the template snapshot with fresh history in SamuelAsherRivello/ai-skills-blender-model-viewer, application folder model-viewer/, and display name Model Viewer. README SHALL describe actual behavior and link to the verified live Pages app.

#### Scenario: Initial repository
- **WHEN** the template baseline is established
- **THEN** origin targets the new repository, template history is absent, and project naming is customized before feature delivery

### Requirement: Manual versioned releases
A manually dispatched release workflow SHALL increment the patch version, produce a matching version commit/tag and GitHub release, and deploy that exact application build to GitHub Pages. Ordinary pushes SHALL NOT create releases. Concurrent runs SHALL NOT allocate duplicate versions; failed verification SHALL NOT promote a broken build.

#### Scenario: Successful release
- **WHEN** a maintainer invokes Release and verification succeeds
- **THEN** the next patch version is published and the live app reports the same version as its release tag

#### Scenario: Deployment failure
- **WHEN** Pages deployment fails after a version is allocated
- **THEN** the workflow reports failure and supports retrying that same version without allocating another patch

### Requirement: Model-free application distribution
The viewer repository, build, Pages artifact, and release attachments SHALL contain no source or exported 3D models. Runtime model bytes SHALL come from the external public source, and no access token SHALL be shipped to browsers.

#### Scenario: Release artifact inspection
- **WHEN** the production package is validated
- **THEN** it contains application resources only, and a browser trace confirms model requests target the external public source
