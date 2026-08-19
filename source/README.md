# Runtime-Preserve Source

This is an editable React/Next wrapper around the exact mirrored runtime for
Wedding Invitation.

The iframe in `components/RuntimePreserveShell.tsx` is the pixel-perfect
surface. Keep it when the target depends on canvas, WebGL, shaders, RAF loops,
or other runtime state that should not be rewritten as static DOM.

## Run

```bash
npm install
npm run dev
```

## Edit

- Edit React shell/layout code in `app/` and `components/`.
- Edit runtime metadata in `lib/runtime-metadata.json`.
- Edit runtime constants/textures in `runtime-edits.json`, then run
  `npm run edit-runtime`.
- Use `runtime-recovered/` as the human-readable Three.js rebuild layer.
- Read `design.md` before rebuilding any part as native React.
- The exact runtime files are served from `public/_mirror/`.
