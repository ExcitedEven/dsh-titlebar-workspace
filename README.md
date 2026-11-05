# dsh-titlebar-workspace

A Desktop-only workspace chip in the **titlebar**, showing the current
workspace. Click it to switch workspaces without opening the left sidebar.

- The chip lives in the `shell.overlay` slot; the dropdown and its flyout are
  rendered through a `react-dom` portal into `document.body` with `z-index`
  above every in-page layer. The overlay slot is a stacking context
  (`z-index: 20`), so a child of it can never paint above the right sidebar
  (whose own layers reach `z-index: 90`). A plugin cannot ask for a native
  Electron menu: the desktop IPC only exposes its two fixed titlebar menus.
- Rendered into the `shell.overlay` slot (frame-wide floating layer), then
  positioned into the 40px titlebar strip: same 28px button height, 6px radius,
  14px label, secondary label color and hover fill as the titlebar controls, so
  it sits naturally in the titlebar row.
- **Follows the layout**: the titlebar controls' `left` flips between 48px and
  84px through `--dsh-windows-menu-start` when the sidebar collapses, without
  changing their width. The chip re-measures their right edge (ResizeObserver,
  window resize and a 200ms poll that updates only on a real change).
- Attention order everywhere is **warning > done > ongoing > idle**. The chip
  carries the roster-wide highest state, so a warning in another workspace still
  reaches the titlebar (its tooltip names the owning workspace); each workspace
  row carries its own aggregate; every conversation row carries its own dot
  (the same `StateDot` states as the sidebar).
- Blank conversations follow the sidebar: only the **current** blank one is
  listed (as `新对话`, always first); other blanks stay hidden and never count
  toward any status or toward the click target.
- The menu is a single workspace column; hovering (or focusing) a row opens a
  conversation flyout **anchored to that row**. It opens to the right of the
  menu when there is room and flips to the left when the viewport is too narrow,
  and its top is clamped inside the viewport.
- The flyout's new-conversation row reuses `IconNewChatOutlineRegular` from the
  shared `@deepseek-ai/dsh-client-ui-primitives` module — the same export the
  sidebar's New Session button renders; nothing is copied into this package.
- **Clicking a workspace opens its best conversation**: highest state first
  (warning > done > ongoing > idle), newest conversation last-wins among equal
  states, and a new conversation when the workspace is empty. The flyout keeps
  `新建对话` (`uiWorkspace.startSession`, which reuses an existing blank like the
  sidebar button) and the existing conversations (`uiWorkspace.openSession`) for
  choosing a different one explicitly. Creating keeps the flyout open so the new
  `新对话` row is visible immediately.
- Hidden in a plain browser (`html[data-windows-titlebar]` absent) and while the
  titlebar menu host is not mounted.

## Install

```sh
# through the plugin page / plugin_manager, pointing at this directory
```

The profile records it as `link:/home/user/projects/working-project/dsh-titlebar-workspace`.
Removing the bundle restores the stock titlebar.

## Test

```sh
npm install   # react, react-dom, jsdom (dev only)
npm test      # jsdom: placement, layout shift, two panes, dots, start/open calls
npm run preview   # writes titlebar-preview.html for a visual check
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
