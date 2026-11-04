window.__ModuleLoader__.load({
  id: "dsh-titlebar-workspace",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const h = React.createElement;
    const primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    const IconChevronDownRegular = primitives.IconChevronDownOutlineRegular;
    const StateDot = primitives.StateDot;

    const NS = "titlebar-workspace";
    const SLOT = "shell.overlay";
    const CELL_ID = "titlebar-workspace";
    const CSS_ID = "dsh-titlebar-workspace";

    const zh = {
      "chip.aria": "当前工作区：{name}，打开切换菜单",
      "chip.choose": "选择工作区",
      "chip.untitled": "未命名工作区",
      "menu.label": "切换工作区",
      "menu.empty": "还没有工作区",
      "menu.current": "当前工作区",
      "status.warning": "等待你处理",
      "status.ongoing": "运行中",
      "status.done": "刚完成",
    };
    const en = {
      "chip.aria": "Current workspace: {name}. Open the switcher",
      "chip.choose": "Choose workspace",
      "chip.untitled": "Untitled workspace",
      "menu.label": "Switch workspace",
      "menu.empty": "No workspaces yet",
      "menu.current": "Current workspace",
      "status.warning": "Waiting for you",
      "status.ongoing": "Running",
      "status.done": "Just finished",
    };

    // Metrics mirror the Desktop caption menubar (preload `installWindowsMenu`):
    // 28px buttons, 10px side padding, 6px radius, 14px label text, inside a
    // 40px titlebar strip. Keeping the same numbers is what makes the chip read
    // as part of the 应用 / 编辑 group.
    const CSS = [
      ".tbw-root{position:fixed;top:0;left:var(--tbw-left,96px);z-index:30;-webkit-app-region:no-drag;align-items:center;height:var(--dsh-windows-titlebar-height,40px);display:flex;pointer-events:none}",
      ".tbw-button{pointer-events:auto;border:0;border-radius:6px;background:0 0;height:28px;max-width:260px;padding:0 10px;color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;cursor:default;align-items:center;gap:6px;display:inline-flex}",
      ".tbw-button:hover,.tbw-button[aria-expanded=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".tbw-button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}",
      ".tbw-dot{flex:none;justify-content:center;align-items:center;width:10px;display:inline-flex}",
      ".tbw-name{white-space:nowrap;text-overflow:ellipsis;min-width:0;max-width:200px;overflow:hidden}",
      ".tbw-chevron{flex:none;color:var(--dsw-alias-label-caption);display:inline-flex}",
      ".tbw-menu{position:fixed;top:calc(var(--dsh-windows-titlebar-height,40px) - 4px);z-index:40;min-width:240px;max-width:340px;max-height:min(60vh,420px);overflow-y:auto;background:var(--dsw-specific-input-major);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);box-shadow:var(--dsw-elevation-prominent);padding:4px;pointer-events:auto;-webkit-app-region:no-drag}",
      ".tbw-menu:focus{outline:none}",
      ".tbw-menuLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;padding:6px 8px 4px}",
      ".tbw-item{border:0;border-radius:var(--dsw-radius-sm);background:0 0;width:100%;height:32px;padding:0 8px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;text-align:left;cursor:pointer;align-items:center;gap:8px;display:flex}",
      ".tbw-item:hover,.tbw-item:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}",
      ".tbw-item[aria-checked=true]{color:var(--dsw-alias-state-business-primary)}",
      ".tbw-itemName{white-space:nowrap;text-overflow:ellipsis;min-width:0;flex:1;overflow:hidden}",
      ".tbw-check{flex:none;color:currentColor;display:inline-flex}",
      ".tbw-empty{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;padding:8px}",
      ".tbw-error{pointer-events:auto;color:var(--dsw-alias-state-error-primary);font-size:13px;padding-left:4px}",
    ].join("");

    function ensureStyles() {
      if (document.querySelector('style[data-plugin-css="' + CSS_ID + '"]') !== null) return;
      const style = document.createElement("style");
      style.setAttribute("data-plugin-css", CSS_ID);
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    function workspaceTitle(item, t) {
      if (typeof item.title === "string" && item.title !== "") return item.title;
      if (typeof item.path === "string" && item.path !== "") {
        const parts = item.path.replace(/[\\/]+$/, "").split(/[\\/]/);
        if (parts.length > 0 && parts[parts.length - 1] !== "") return parts[parts.length - 1];
      }
      return t("chip.untitled");
    }

    function workspacePath(item) {
      if (typeof item.path === "string" && item.path !== "") return item.path;
      return typeof item.cwd === "string" && item.cwd !== "" ? item.cwd : undefined;
    }

    /**
     * Measure where the caption menubar ends, so the chip lands right after it.
     * The preload builds that bar in a shadow root and can mount it after this
     * plugin, so poll briefly, then keep up through resize/lang changes.
     */
    function useMenubarRight() {
      const [right, setRight] = React.useState(null);
      React.useEffect(() => {
        let host = null;
        let resize = null;
        let attempts = 0;
        let timer = 0;
        const stopPolling = () => {
          if (timer !== 0) {
            window.clearInterval(timer);
            timer = 0;
          }
        };
        const measure = () => {
          const desktop = document.documentElement.hasAttribute("data-windows-titlebar");
          if (host === null) host = document.querySelector("[data-windows-menu]");
          if (!desktop || host === null) {
            setRight(null);
            return;
          }
          const rect = host.getBoundingClientRect();
          if (rect.width === 0) {
            setRight(null);
            return;
          }
          setRight(Math.round(rect.right + 4));
          if (resize === null && typeof ResizeObserver === "function") {
            resize = new ResizeObserver(measure);
            resize.observe(host);
          }
          stopPolling();
        };
        measure();
        timer = window.setInterval(() => {
          attempts += 1;
          measure();
          if (attempts > 60) stopPolling();
        }, 300);
        window.addEventListener("resize", measure);
        const observer = new MutationObserver(measure);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "data-windows-titlebar"] });
        return () => {
          stopPolling();
          if (resize !== null) resize.disconnect();
          window.removeEventListener("resize", measure);
          observer.disconnect();
        };
      }, []);
      return right;
    }

    /**
     * Aggregate a workspace's member sessions into one dot, using the same
     * priority the sidebar applies per session: waiting for the user first,
     * then live work, then an unread completion.
     */
    function workspaceState(item, statuses) {
      let running = false;
      let done = false;
      for (const sessionId of Array.isArray(item.sessionIds) ? item.sessionIds : []) {
        const status = statuses instanceof Map ? statuses.get(sessionId) : statuses?.[sessionId];
        if (status === undefined || status === null) continue;
        if (status.pendingInteraction !== undefined && status.pendingInteraction !== null) return "warning";
        if (status.running === true) running = true;
        if (status.completionUnread === true) done = true;
      }
      if (running) return "ongoing";
      if (done) return "done";
      return "idle";
    }

    /** Screen-reader/tooltip text for a dot state; idle has no dot. */
    function statusLabel(state, t) {
      if (state === "warning") return t("status.warning");
      if (state === "ongoing") return t("status.ongoing");
      if (state === "done") return t("status.done");
      return "";
    }

    /**
     * Workspace chip in the Desktop caption titlebar.
     *
     * `useWorkspaces` / `useSessions` are root hooks injected by the slot
     * renderer; `switchTo` comes from this entry's `inject` face.
     */
    function WorkspaceChip({ useWorkspaces, useSessions, useSessionStatus, switchTo, t }) {
      const snapshot = useWorkspaces((state) => state);
      const currentSessionId = useSessions((state) => {
        const sessions = state.byId ?? {};
        for (const id of Object.keys(sessions)) {
          if ((sessions[id].retainedBy?.mainView ?? 0) > 0) return id;
        }
        return null;
      });
      const statuses = useSessionStatus((state) => state);
      const left = useMenubarRight();
      const [open, setOpen] = React.useState(false);
      const [error, setError] = React.useState(null);
      const rootRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const buttonRef = React.useRef(null);

      const items = snapshot !== undefined && snapshot !== null && Array.isArray(snapshot.items) ? snapshot.items : [];
      const current = currentSessionId === null || currentSessionId === undefined
        ? undefined
        : items.find((item) => Array.isArray(item.sessionIds) && item.sessionIds.includes(currentSessionId));
      const label = current === undefined ? t("chip.choose") : workspaceTitle(current, t);
      const state = current === undefined ? "idle" : workspaceState(current, statuses);
      const stateText = statusLabel(state, t);

      React.useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (rootRef.current !== null && rootRef.current.contains(target)) return;
          if (menuRef.current !== null && menuRef.current.contains(target)) return;
          setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => document.removeEventListener("pointerdown", onPointerDown, true);
      }, [open]);

      React.useEffect(() => {
        if (!open || menuRef.current === null) return;
        const first = menuRef.current.querySelector('[role="menuitemradio"]');
        if (first !== null) first.focus();
      }, [open]);

      const choose = (workspaceId) => {
        setOpen(false);
        if (current !== undefined && current.workspaceId === workspaceId) return;
        setError(null);
        Promise.resolve(switchTo(workspaceId)).catch((reason) => {
          setError(reason instanceof Error ? reason.message : String(reason));
        });
      };

      const onButtonKeyDown = (event) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
        } else if (event.key === "Escape") {
          setOpen(false);
        }
      };

      const onMenuKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          if (buttonRef.current !== null) buttonRef.current.focus();
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const rows = [...menuRef.current.querySelectorAll('[role="menuitemradio"]')];
        if (rows.length === 0) return;
        const index = rows.indexOf(document.activeElement);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = rows[(index + delta + rows.length) % rows.length];
        if (next !== undefined) next.focus();
      };

      if (left === null) return null;

      return h(
        React.Fragment,
        null,
        h(
          "div",
          { className: "tbw-root", ref: rootRef, style: { "--tbw-left": left + "px" } },
          h(
            "button",
            {
              type: "button",
              ref: buttonRef,
              className: "tbw-button",
              "aria-haspopup": "menu",
              "aria-expanded": open,
              "aria-label": stateText === "" ? t("chip.aria", { name: label }) : t("chip.aria", { name: label }) + "，" + stateText,
              title: current === undefined ? t("chip.choose") : [label, workspacePath(current), stateText].filter(Boolean).join("\n"),
              onMouseDown: (event) => event.preventDefault(),
              onClick: () => setOpen(!open),
              onKeyDown: onButtonKeyDown,
            },
            state !== "idle" ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state, size: 8 })) : null,
            h("span", { className: "tbw-name" }, label),
            h("span", { className: "tbw-chevron", "aria-hidden": true }, h(IconChevronDownRegular, { size: 12 })),
          ),
          error !== null
            ? h("span", { className: "tbw-error", role: "status", title: error }, "!")
            : null,
        ),
        open
          ? h(
              "div",
              {
                className: "tbw-menu",
                ref: menuRef,
                role: "menu",
                "aria-label": t("menu.label"),
                style: { left: left + "px" },
                onKeyDown: onMenuKeyDown,
              },
              h("div", { className: "tbw-menuLabel" }, t("menu.label")),
              items.length === 0
                ? h("div", { className: "tbw-empty" }, t("menu.empty"))
                : items.map((item) => {
                    const active = current !== undefined && current.workspaceId === item.workspaceId;
                    return h(
                      "button",
                      {
                        key: item.workspaceId,
                        type: "button",
                        role: "menuitemradio",
                        "aria-checked": active,
                        className: "tbw-item",
                        title: [workspaceTitle(item, t), workspacePath(item)].filter(Boolean).join("\n"),
                        onClick: () => choose(item.workspaceId),
                      },
                      (() => {
                        const rowState = workspaceState(item, statuses);
                        return rowState !== "idle"
                          ? h("span", { className: "tbw-dot", title: statusLabel(rowState, t), "aria-hidden": true }, h(StateDot, { state: rowState, size: 8 }))
                          : h("span", { className: "tbw-dot", "aria-hidden": true });
                      })(),
                      h("span", { className: "tbw-itemName" }, workspaceTitle(item, t)),
                      active
                        ? h("span", { className: "tbw-check", "aria-hidden": true }, "\u2713")
                        : null,
                    );
                  }),
            )
          : null,
      );
    }

    const inject = ["slots", "locale", "uiWorkspace"];

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "titlebar-workspace: dictionaries");
      ensureStyles();

      ctx.slots.inject(SLOT, () =>
        ctx.slots.register(
          {
            name: SLOT,
            id: CELL_ID,
            order: 5,
            locale: NS,
            inject: () => ({
              switchTo: (workspaceId) => ctx.uiWorkspace.openWorkspace(workspaceId),
            }),
          },
          WorkspaceChip,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
