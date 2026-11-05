/**
 * Host half of the titlebar workspace chip.
 *
 * The feature is browser-side: the chip reads the root `workspaces` hook and
 * switches through `ctx.uiWorkspace.openSession()` / `startSession()`. This
 * entry exists only so the bundle has a Loader row to mount; it registers no
 * Host service, tool, or event.
 */
export function apply() { }
