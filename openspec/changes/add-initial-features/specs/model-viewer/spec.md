## Purpose

Allow visitors to inspect public Blender models interactively in a full-browser interface with clear navigation and trustworthy model details.

## ADDED Requirements

### Requirement: Full-browser interactive presentation
The app SHALL display Model Viewer and fill the available browser viewport with a landscape-first layout, interactive 3D viewport, and readable controls. It SHALL support orbit and zoom and fit each selected model initially without requiring browser fullscreen permission. Narrow viewports SHALL retain usable controls.

#### Scenario: Viewport resize
- **WHEN** the browser changes size
- **THEN** the canvas resizes, the scene remains correctly proportioned, and navigation stays accessible

### Requirement: Sequential model navigation
The viewer SHALL provide keyboard-accessible Back and Next buttons, current filename, disambiguating source path, and position out of total. Entries SHALL have deterministic path ordering; Back at the first entry SHALL wrap to the last, and Next at the last SHALL wrap to the first. A/Left Arrow SHALL navigate back and D/Right Arrow SHALL navigate next, including with canvas focus. Navigation SHALL be available once the catalog is loaded, even while a model loads. Empty catalogs SHALL disable navigation; single-entry catalogs SHALL remain on that entry. Shortcuts SHALL ignore editable fields and Alt/Ctrl/Meta combinations. Paired source/GLB files SHALL represent one model entry, while distinct source paths remain separate entries.

#### Scenario: Rapid navigation
- **WHEN** the visitor navigates again before a previous load finishes
- **THEN** only the newest selection becomes visible and superseded model resources are released

### Requirement: Metadata and model failures
The viewer SHALL show available documented metadata with provenance separately from runtime-measured statistics, plus export warnings. It SHALL display loading, empty inventory, unsupported graphics, and per-model failure states without misrepresenting a preview image as interactive 3D.

#### Scenario: One asset fails
- **WHEN** a selected GLB fails to load
- **THEN** the visitor sees its filename, a retry action, and available metadata, and can navigate to other entries

#### Scenario: Metadata absent
- **WHEN** an entry lacks a prompt, author, or other optional field
- **THEN** the viewer omits that field or labels it unavailable without guessing its value
