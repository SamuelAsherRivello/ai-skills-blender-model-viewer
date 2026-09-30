![Samuel Asher Rivello](model-viewer/documentation/samuel-asher-rivello-banner.png)

# Model Viewer

- Interactive 3D gallery for [AI Skills for Blender](https://github.com/SamuelAsherRivello/ai-skills-blender).
- Browse models, play animations, and inspect source metadata.

## Images

### Screenshots

<a href="model-viewer/documentation/screenshot01.png"><img src="model-viewer/documentation/screenshot01.png" width="400" alt="Model Viewer displaying a Blender scene" /></a>

## Live Demo

- [Open Model Viewer](https://samuelasherrivello.github.io/ai-skills-blender-model-viewer/)
- [Latest release](https://github.com/SamuelAsherRivello/ai-skills-blender-model-viewer/releases/latest)

## Table of Contents

- [Images](#images)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Project Details](#project-details)
- [Credits](#credits)

## Getting Started

- Requires Node.js 24+, npm, internet access, and a WebGL browser.
- Run commands from the repository root. No API key required.

### 🛠 Build Project

- Install dependencies: `npm ci`
- Build: `npm run build`
- Preview build: `npm run preview`

### 🛠 Run Project

- Start: `npm run dev`
- Open the printed URL at `/ai-skills-blender-model-viewer/`.

### 🛠 Test Project

- Unit tests: `npm test`
- Distribution check: `npm run check:distribution`
- Browser tests: `npm run test:browser` — requires Google Chrome.
- Set `VIEWER_URL` to test a deployed site.

### 🛠 Release Version

- Push to `main`, then run **Release** in GitHub Actions.
- Each release bumps the patch version and deploys its build to Pages.
- Ordinary pushes run checks only; releases contain no models.
- Re-run failed workflows to resume; set `existing_version` to `vX.Y.Z` for retry or rollback.

## Project Details

### 🎮 Controls

- Previous / next: **Back / Next**, **A / D**, or **← / →**.
- Navigation wraps in both directions, including while loading.
- Drag to orbit; scroll to zoom. Reset, fullscreen, and animation playback controls are included.

### 🧊 Models

- Catalog and GLBs load from the public source at one revision per session.
- Reload to discover new models; no app rebuild needed.
- Source metadata includes provenance; viewport statistics are measured separately.
- Export notes explain shading differences and detail limits.
- [Export maintenance guide](https://github.com/SamuelAsherRivello/ai-skills-blender/blob/main/documentation/models/README.md)

### 📝 Structure

- `model-viewer/src/`: interface and renderer.
- `model-viewer/test/`, `model-viewer/browser/`: automated checks.
- `model-viewer/scripts/`: release and distribution tools.
- `model-viewer/documentation/`: screenshots and [verification notes](model-viewer/documentation/verification.md).
- `.github/workflows/`: checks and Pages releases.

### 📦 AI

- [AGENTS.md](AGENTS.md): repository guidance.
- [OpenSpec](openspec/): specifications and change tracking.

### 📦 Packages

- React: interface.
- Babylon.js: 3D rendering and animation.
- Vite: development and builds.
- Playwright: browser testing.

## Credits

<!-- AI: Preserve established attribution and ownership. Customize the following subsections only from confirmed contributor, contact, and license information; do not infer a new owner from the repository name. -->
### 💡 Contributors

<!-- AI: Preserve existing contributor credit and add contributors only when confirmed. Do not automatically advance experience counts or their reference year. -->
- Samuel Asher Rivello - Over 25 years of game development XP (2026)

### 💡 Contact

<!-- AI: Preserve confirmed contact destinations and their order unless requested otherwise. Use readable display URLs without a protocol or trailing slash while keeping the real link target intact. Do not invent accounts or change target capitalization based on display styling. -->
- [LinkedIn.com/in/SamuelAsherRivello](https://Linkedin.com/in/SamuelAsherRivello) ⭐ 
- [GitHub.com/SamuelAsherRivello](https://github.com/SamuelAsherRivello/)
- [Twitter.com/srivello](https://twitter.com/srivello/)
- Resume / Portfolio: [SamuelAsherRivello.com](http://www.SamuelAsherRivello.com)


### 💡 License

<!-- AI: Keep the license name linked to the actual relative license file and verify that its terms match this statement. Keep the copyright holder and year consistent with that file. Do not change license terms, ownership, or dates without an explicit request. -->
- Provided as-is under the [MIT License](LICENSE).

- Copyright © 2026 Rivello Multimedia Consulting, LLC.
