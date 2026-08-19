# Runtime-Preserve Design Spec

## Target

- Name: Wedding Invitation
- Source URL: https://saiyam-jenny.invitationmedia.in/
- Mirror URL: https://saiyam-jenny.invitationmedia.in/
- Final URL: https://saiyam-jenny.invitationmedia.in/
- Target host: saiyam-jenny.invitationmedia.in

## Product Contract

This source project is a runtime-preserve clone. The exact site renders inside
`components/RuntimePreserveShell.tsx` from `public/_mirror/index.html`.

Use this mode when pixel fidelity depends on canvas, WebGL, shaders, RAF loops,
or complex animation state. Do not replace the iframe with synthesized DOM
unless a later rebuild is verified against the mirror.

## Runtime

- Mode: visual-spec
- Confidence: low
- Engines: Unknown
- Canvas elements: 0
- WebGL canvases: 0
- RAF FPS estimate: 0
- Shader-looking source matches: 0
- Fullscreen runtime layers: 1

### Runtime Reasons

- browser exposes WebGL/WebGL2 capability
- 1 fixed/full-screen runtime layer(s)
- runtime signals exist but are too weak for confident preservation

## Styles And Motion

- Stylesheets: 2
- CSS rules: 898
- Keyframes: 18
- Media queries: 6
- Container queries: 0
- Scroll listeners: 5
- requestAnimationFrame callbacks observed: 0
- Web Animations API records: 0

## Visual Verification

- Overall pixel mismatch: 7.53%
- Overall structural match: 38.46%
- desktop: 9.69% mismatch
- tablet: 6.71% mismatch
- mobile: 6.20% mismatch

## Editable Surface

- `app/page.tsx`: mounts the runtime shell.
- `components/RuntimePreserveShell.tsx`: the exact visual surface.
- `components/EditableOverlay.tsx`: optional metadata/control panel starter.
- `components/runtime-preserve.css`: wrapper styling only.
- `lib/runtime-metadata.json`: extracted runtime facts and source references.
- `runtime-edits.json`: editable runtime constants/textures for supported targets.
- `runtime-recovered/`: semantic Three.js rebuild modules for native-port work.

## Rebuild Guidance

1. Keep the iframe as the visual baseline until a native rebuild beats the same
   pixel gate.
2. Rebuild shell UI, overlays, navigation, and content controls as native React.
3. For canvas/WebGL sections, preserve the original runtime or port the engine
   intentionally; do not approximate shaders with static DOM.
4. Any replacement must pass verify against the original and mirror across
   desktop, tablet, mobile, and interaction states.

## Design-System Artifacts

- Root design guide: /app/sites/job-ihz7tai5/DESIGN.md
- Design JSON: /app/sites/job-ihz7tai5/design/design-system.json
- DTCG tokens: /app/sites/job-ihz7tai5/design/tokens.dtcg.json
