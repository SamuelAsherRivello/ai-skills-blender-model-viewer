## Purpose

Provide a complete public inventory of Blender examples with browser-ready models and traceable metadata independently of viewer releases.

## ADDED Requirements

### Requirement: Complete browser-ready source assets
The source repository SHALL publish a self-contained GLB counterpart for every .blend, including historical iterations and transfer checks, preserving source files. Every export SHALL be validated for geometry, required textures, and applicable animation; material or feature losses SHALL be recorded and blocking export failures SHALL prevent claiming complete coverage.

#### Scenario: Export inventory
- **WHEN** the public source inventory is prepared
- **THEN** every .blend path maps to a publicly accessible validated GLB with embedded required textures and explicit export diagnostics

### Requirement: Source-owned catalog and ongoing maintenance
The source repository SHALL publish a versioned JSON catalog with stable path-based IDs, source and GLB paths, byte sizes, available preview paths, metadata provenance, and export warnings. AGENTS.md SHALL require updating exports and the catalog when models change. Missing metadata SHALL remain unknown rather than invented.

#### Scenario: Model update
- **WHEN** an agent adds or changes a source model
- **THEN** source guidance requires regenerating and validating its export and catalog entry before publishing

### Requirement: Public runtime discovery
The viewer SHALL load the catalog, models, previews, and metadata using unauthenticated public HTTP from SamuelAsherRivello/ai-skills-blender without checking out that repository. Each browsing session SHALL use a consistent source revision and display source links.

#### Scenario: Source changes independently
- **WHEN** a new source catalog is published and a visitor reloads the unchanged viewer
- **THEN** the new public inventory becomes discoverable without a viewer release

#### Scenario: Unavailable source
- **WHEN** the catalog is missing, malformed, or rate-limited
- **THEN** the viewer shows an actionable error with retry and never silently substitutes bundled models
