# dsh-titlebar-workspace

A Desktop-only workspace chip in the **caption titlebar**, sitting right after
the preload's 应用 / 编辑 menu and showing the current workspace. Click it to
switch workspaces without opening the left sidebar.

- Rendered into the `shell.overlay` slot (frame-wide floating layer), then
  positioned into the 40px titlebar strip: same 28px button height, 6px radius,
  14px label, secondary label color and hover fill as the caption menu, so it
  reads as one group with 应用 / 编辑.
- **Follows the layout**: the caption menubar's `left` flips between 48px and
  84px through `--dsh-windows-menu-start` when the sidebar collapses, without
  changing its width. The chip re-measures the bar's right edge (ResizeObserver,
  window resize and a 200ms poll that updates only on a real change).
- Attention order everywhere is **warning > done > ongoing > idle**. The chip
  carries the roster-wide highest state, so a warning in another workspace still
  reaches the titlebar (its tooltip names the owning workspace); each workspace
  row carries its own aggregate; every conversation row carries its own dot
  (the same `StateDot` states as the sidebar).
- The menu is a single workspace column; hovering (or focusing) a row opens a
  conversation flyout **anchored to that row**. It opens to the right of the
  menu when there is room and flips to the left when the viewport is too narrow,
  and its top is clamped inside the viewport.
- **Clicking a workspace opens its best conversation**: highest state first
  (warning > done > ongoing > idle), newest conversation last-wins among equal
  states, and a new conversation when the workspace is empty. The flyout keeps
  `新建对话` (`uiWorkspace.startSession`) and the existing conversations
  (`uiWorkspace.openSession`) for choosing a different one explicitly.
- Hidden in a plain browser (`html[data-windows-titlebar]` absent) and while the
  preload menubar is not mounted.

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
