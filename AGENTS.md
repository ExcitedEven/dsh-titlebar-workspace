# AGENTS.md

Desktop titlebar workspace chip for DeepSeek Harness. The profile links this
directory as `dsh-titlebar-workspace`; edits hot-reload into the running app.

## Commands

- `npm install` — dev-only (`react`, `react-dom`, `jsdom`); the plugin itself
  has no build step and no runtime dependencies.
- `npm test` — jsdom mount: placement, layout shift, dots, blank handling,
  click targets.
- `npm run preview` — writes `tools/titlebar-preview.html` for a visual check.

## Layout

- `lib/client.js` — the whole feature (prebuilt browser bundle, loaded by the
  client module loader).
- `lib/index.js` — empty host entry; the bundle needs a Loader row to mount.
- `cordis.patch.yml` — inserts the entry.
- `test/`, `tools/` — jsdom test and preview generator (not shipped).

## Pitfalls

- The dropdown and flyout must stay portaled to `document.body`: the
  `shell.overlay` slot is a `z-index: 20` stacking context, and the right sidebar
  reaches `z-index: 90`.
- Only a *visible* `[role="dialog"][aria-modal="true"]` counts as a modal. The
  app keeps a hidden one mounted; a naive query closes the menu on open.
- Blank sessions: only the current one is listed (as `新对话`); blanks never
  count toward a status or a click target.
- Titlebar metrics mirror the Desktop titlebar controls (28px button, 6px radius,
  14px label). `--dsh-windows-menu-start` flips 48↔84px with the sidebar.

