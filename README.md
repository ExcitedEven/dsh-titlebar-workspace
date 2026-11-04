# dsh-titlebar-workspace

A Desktop-only workspace chip in the **caption titlebar**, sitting right after
the preload's 应用 / 编辑 menu and showing the current workspace. Click it to
switch workspaces without opening the left sidebar.

- Rendered into the `shell.overlay` slot (frame-wide floating layer), then
  positioned into the 40px titlebar strip: same 28px button height, 6px radius,
  14px label, secondary label color and hover fill as the caption menu, so it
  reads as one group with 应用 / 编辑.
- The current workspace is resolved from the main Session's `retainedBy.mainView`
  and the root `workspaces` snapshot; switching calls
  `ctx.uiWorkspace.openWorkspace(workspaceId)` — the same path a sidebar
  workspace row takes.
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
npm test      # jsdom mount: placement, workspace rows, status dots, switch call
npm run preview   # writes titlebar-preview.html for a visual check
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
