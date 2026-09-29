# Initial feature verification

Source publication: [957521aa9347e9066e8c967b36c834ddfe3da1b6](https://github.com/SamuelAsherRivello/ai-skills-blender/commit/957521aa9347e9066e8c967b36c834ddfe3da1b6), 29 September 2026.

The public tree was reconciled against all 20 catalog source paths, including historical firehouse variants. Discovery used HTTP; no source repository clone was created. Export work used the existing, verified source checkout. Every original Blender file retained its SHA-256 hash, and the source working tree was clean after publication.

All 20 GLBs passed Khronos structural validation with zero errors. The compressed forest was validated after lossless decoding; decoded vertex attributes and triangle topology matched before and after compression. Remaining validator warnings concern runtime tangent generation and skinned meshes below identity armature containers. Robot and fox animations retain their source names, `Greeting_Wave` and `Fox_Idle`.

All exports were visually reviewed in Chrome. The source camera preserves subject framing despite large studio floors. Procedural surfaces use texture baking; dense forest colors use per-corner baking. Geometry, foliage, glass, source palettes, and applicable animation remain visible. Browser lighting differs from Blender renders, toon ramps use a PBR palette approximation, and texture/vertex sampling limits fine procedural detail. These differences are disclosed upstream and in the viewer's export notes.

Automated checks cover revision pinning, malformed catalogs, path validation, duplicate IDs, absent metadata, network failures, source refresh without rebuilding, stale selection protection, prohibited distribution fixtures, and release allocation/retry/rollback against a temporary Git remote. Browser acceptance loads public GLBs, checks metadata association and endpoint navigation, verifies animation movement and playback controls, exercises failure/retry and rapid keyboard navigation, and checks a narrow viewport.

The application has no model files or copied catalog. The production build passes the distribution guard. GitHub Pages and release artifact verification are recorded below after deployment.
