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
- The chip's dot is the **open conversation's** status; the workspace rows carry
  the aggregate; every conversation row in the right pane carries its own dot
  (same `StateDot` states as the sidebar: warning / ongoing / done / idle).
- The menu is two panes: hovering a workspace shows its conversations on the
  right, with `新建对话` (`uiWorkspace.startSession`) and the existing
  conversations (`uiWorkspace.openSession`). Clicking a workspace row only
  selects it, so it never creates a conversation by itself.
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
