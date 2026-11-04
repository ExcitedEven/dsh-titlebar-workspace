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
      "chip.aria": "当前工作区：{name}，打开工作区菜单",
      "chip.choose": "选择工作区",
      "chip.untitled": "未命名工作区",
      "menu.workspaces": "工作区",
      "menu.sessions": "对话",
      "menu.new": "新建对话",
      "menu.empty": "还没有工作区",
      "menu.emptySessions": "还没有对话",
      "menu.current": "当前工作区",
      "session.untitled": "未命名对话",
      "status.warning": "等待你处理",
      "status.ongoing": "运行中",
      "status.done": "刚完成",
    };
    const en = {
      "chip.aria": "Current workspace: {name}. Open the workspace menu",
      "chip.choose": "Choose workspace",
      "chip.untitled": "Untitled workspace",
      "menu.workspaces": "Workspaces",
      "menu.sessions": "Conversations",
      "menu.new": "New conversation",
      "menu.empty": "No workspaces yet",
      "menu.emptySessions": "No conversations yet",
      "menu.current": "Current workspace",
      "session.untitled": "Untitled conversation",
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
      ".tbw-menu{position:fixed;top:calc(var(--dsh-windows-titlebar-height,40px) - 4px);z-index:40;background:var(--dsw-specific-input-major);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);box-shadow:var(--dsw-elevation-prominent);padding:4px;pointer-events:auto;-webkit-app-region:no-drag;display:flex;align-items:stretch}",
      ".tbw-menu:focus{outline:none}",
      ".tbw-col{display:flex;flex-direction:column;min-width:0;padding:2px}",
      ".tbw-colWorkspaces{width:210px}",
      ".tbw-colSessions{width:286px;max-height:min(70vh,460px);border-left:.5px solid var(--dsw-alias-border-l2);margin-left:4px;padding-left:8px}",
      ".tbw-colBody{min-height:0;overflow-y:auto;display:flex;flex-direction:column}",
      ".tbw-menuLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;padding:6px 8px 4px}",
      ".tbw-item{border:0;border-radius:var(--dsw-radius-sm);background:0 0;width:100%;height:32px;padding:0 8px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;text-align:left;cursor:pointer;align-items:center;gap:8px;display:flex}",
      ".tbw-item:hover,.tbw-item:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}",
      ".tbw-item[aria-current=true],.tbw-item[data-active=true]{background:var(--dsw-alias-interactive-bg-hover)}",
      ".tbw-item[aria-current=true]{color:var(--dsw-alias-state-business-primary)}",
      ".tbw-itemName{white-space:nowrap;text-overflow:ellipsis;min-width:0;flex:1;overflow:hidden}",
      ".tbw-check{flex:none;color:currentColor;display:inline-flex}",
      ".tbw-new{border:0;border-radius:var(--dsw-radius-sm);background:0 0;width:100%;height:32px;padding:0 8px;color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;text-align:left;cursor:pointer;align-items:center;gap:8px;display:flex;flex:none}",
      ".tbw-new:hover,.tbw-new:focus-visible{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);outline:none}",
      ".tbw-plus{flex:none;justify-content:center;align-items:center;width:16px;height:16px;color:var(--dsw-alias-label-tertiary);font-size:16px;line-height:16px;display:inline-flex}",
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

    function lookup(statuses, sessionId) {
      if (statuses === undefined || statuses === null) return undefined;
      return statuses instanceof Map ? statuses.get(sessionId) : statuses[sessionId];
    }

    /** One conversation's dot, using the sidebar's status priority. */
    function sessionState(status) {
      if (status === undefined || status === null) return "idle";
      if (status.pendingInteraction !== undefined && status.pendingInteraction !== null) return "warning";
      if (status.running === true) return "ongoing";
      if (status.completionUnread === true) return "done";
      return "idle";
    }

    /** Aggregate the members of one workspace for its row in the left column. */
    function workspaceState(item, statuses) {
      let running = false;
      let done = false;
      for (const sessionId of Array.isArray(item.sessionIds) ? item.sessionIds : []) {
        const state = sessionState(lookup(statuses, sessionId));
        if (state === "warning") return "warning";
        if (state === "ongoing") running = true;
        if (state === "done") done = true;
      }
      if (running) return "ongoing";
      if (done) return "done";
      return "idle";
    }

    function statusLabel(state, t) {
      if (state === "warning") return t("status.warning");
      if (state === "ongoing") return t("status.ongoing");
      if (state === "done") return t("status.done");
      return "";
    }

    function sessionTitle(session, t) {
      if (typeof session.title === "string" && session.title !== "") return session.title;
      return t("session.untitled");
    }

    /**
     * Track the caption menubar's right edge.
     *
     * The bar's `left` is a CSS variable the sidebar flips when it collapses
     * (`--dsh-windows-menu-start`), so its width does not change when the layout
     * shifts — a ResizeObserver alone misses that. Poll the rect at a low rate
     * and update only on a real change; ResizeObserver and window resize make
     * the common cases immediate.
     */
    function useMenubarRight() {
      const [right, setRight] = React.useState(null);
      React.useEffect(() => {
        let resize = null;
        let timer = 0;
        const measure = () => {
          const desktop = document.documentElement.hasAttribute("data-windows-titlebar");
          const host = desktop ? document.querySelector("[data-windows-menu]") : null;
          if (host === null) {
            setRight((current) => (current === null ? current : null));
            return;
          }
          const rect = host.getBoundingClientRect();
          if (rect.width === 0) {
            setRight((current) => (current === null ? current : null));
            return;
          }
          const next = Math.round(rect.right + 4);
          setRight((current) => (current === next ? current : next));
          if (resize === null && typeof ResizeObserver === "function") {
            resize = new ResizeObserver(measure);
            resize.observe(host);
          }
        };
        measure();
        timer = window.setInterval(measure, 200);
        window.addEventListener("resize", measure);
        const observer = new MutationObserver(measure);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "data-windows-titlebar"] });
        return () => {
          if (timer !== 0) window.clearInterval(timer);
          if (resize !== null) resize.disconnect();
          window.removeEventListener("resize", measure);
          observer.disconnect();
        };
      }, []);
      return right;
    }

    /**
     * Workspace chip in the Desktop caption titlebar.
     *
     * `useWorkspaces` / `useSessions` / `useSessionStatus` are root hooks injected
     * by the slot renderer; `openSession` / `newSession` come from this entry's
     * `inject` face.
     */
    function WorkspaceChip({ useWorkspaces, useSessions, useSessionStatus, openSession, newSession, t }) {
      const workspaceSnapshot = useWorkspaces((state) => state);
      const sessionSnapshot = useSessions((state) => state);
      const statuses = useSessionStatus((state) => state);
      const left = useMenubarRight();
      const [open, setOpen] = React.useState(false);
      const [activeId, setActiveId] = React.useState(null);
      const [error, setError] = React.useState(null);
      const rootRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const buttonRef = React.useRef(null);

      const workspaces = workspaceSnapshot !== undefined && workspaceSnapshot !== null && Array.isArray(workspaceSnapshot.items) ? workspaceSnapshot.items : [];
      const sessions = sessionSnapshot !== undefined && sessionSnapshot !== null && sessionSnapshot.byId !== undefined ? sessionSnapshot.byId : {};

      let currentSessionId = null;
      for (const id of Object.keys(sessions)) {
        if ((sessions[id].retainedBy?.mainView ?? 0) > 0) {
          currentSessionId = id;
          break;
        }
      }
      const currentWorkspace = currentSessionId === null
        ? undefined
        : workspaces.find((item) => Array.isArray(item.sessionIds) && item.sessionIds.includes(currentSessionId));
      // The chip reports the open conversation's own status, not the project aggregate.
      const currentState = sessionState(lookup(statuses, currentSessionId));
      const label = currentWorkspace === undefined ? t("chip.choose") : workspaceTitle(currentWorkspace, t);
      const stateText = statusLabel(currentState, t);

      const activeWorkspace = workspaces.find((item) => item.workspaceId === activeId)
        ?? currentWorkspace
        ?? workspaces[0];
      const activeSessions = activeWorkspace === undefined
        ? []
        : (Array.isArray(activeWorkspace.sessionIds) ? activeWorkspace.sessionIds : [])
            .map((id) => sessions[id])
            .filter((session) => session !== undefined && session.archived !== true)
            .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

      const openMenu = () => {
        setActiveId(currentWorkspace === undefined ? null : currentWorkspace.workspaceId);
        setOpen(true);
      };

      const run = (action) => {
        setOpen(false);
        setError(null);
        Promise.resolve(action()).catch((reason) => {
          setError(reason instanceof Error ? reason.message : String(reason));
        });
      };

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
        const target = menuRef.current.querySelector('[data-current="true"]') ?? menuRef.current.querySelector("button");
        if (target !== null) target.focus();
      }, [open]);

      const onMenuKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          if (buttonRef.current !== null) buttonRef.current.focus();
          return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const rows = [...menuRef.current.querySelectorAll("button")];
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
              title: currentWorkspace === undefined ? t("chip.choose") : [label, workspacePath(currentWorkspace), stateText].filter(Boolean).join("\n"),
              onMouseDown: (event) => event.preventDefault(),
              onClick: () => (open ? setOpen(false) : openMenu()),
            },
            currentState !== "idle" ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: currentState, size: 8 })) : null,
            h("span", { className: "tbw-name" }, label),
            h("span", { className: "tbw-chevron", "aria-hidden": true }, h(IconChevronDownRegular, { size: 12 })),
          ),
          error !== null ? h("span", { className: "tbw-error", role: "status", title: error }, "!") : null,
        ),
        open
          ? h(
              "div",
              {
                className: "tbw-menu",
                ref: menuRef,
                style: { left: left + "px" },
                onKeyDown: onMenuKeyDown,
              },
              h(
                "div",
                { className: "tbw-col tbw-colWorkspaces" },
                h("div", { className: "tbw-menuLabel" }, t("menu.workspaces")),
                h(
                  "div",
                  { className: "tbw-colBody", role: "menu", "aria-label": t("menu.workspaces") },
                  workspaces.length === 0
                    ? h("div", { className: "tbw-empty" }, t("menu.empty"))
                    : workspaces.map((item) => {
                        const rowState = workspaceState(item, statuses);
                        const active = activeWorkspace !== undefined && activeWorkspace.workspaceId === item.workspaceId;
                        const isCurrent = currentWorkspace !== undefined && currentWorkspace.workspaceId === item.workspaceId;
                        return h(
                          "button",
                          {
                            key: item.workspaceId,
                            type: "button",
                            role: "menuitem",
                            className: "tbw-item",
                            "data-active": active,
                            "data-current": isCurrent,
                            "aria-current": isCurrent ? "true" : undefined,
                            title: [workspaceTitle(item, t), workspacePath(item), statusLabel(rowState, t)].filter(Boolean).join("\n"),
                            onMouseEnter: () => setActiveId(item.workspaceId),
                            onFocus: () => setActiveId(item.workspaceId),
                            onClick: () => setActiveId(item.workspaceId),
                          },
                          rowState !== "idle"
                            ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: rowState, size: 8 }))
                            : h("span", { className: "tbw-dot", "aria-hidden": true }),
                          h("span", { className: "tbw-itemName" }, workspaceTitle(item, t)),
                          isCurrent ? h("span", { className: "tbw-check", "aria-hidden": true }, "\u2713") : null,
                        );
                      }),
                ),
              ),
              h(
                "div",
                { className: "tbw-col tbw-colSessions" },
                h("div", { className: "tbw-menuLabel" }, activeWorkspace === undefined ? t("menu.sessions") : workspaceTitle(activeWorkspace, t)),
                h(
                  "button",
                  {
                    type: "button",
                    className: "tbw-new",
                    onClick: () => {
                      if (activeWorkspace === undefined) return;
                      run(() => newSession(activeWorkspace.workspaceId));
                    },
                  },
                  h("span", { className: "tbw-plus", "aria-hidden": true }, "+"),
                  h("span", { className: "tbw-itemName" }, t("menu.new")),
                ),
                h(
                  "div",
                  { className: "tbw-colBody", role: "menu", "aria-label": t("menu.sessions") },
                  activeSessions.length === 0
                    ? h("div", { className: "tbw-empty" }, t("menu.emptySessions"))
                    : activeSessions.map((session) => {
                        const rowState = sessionState(lookup(statuses, session.id));
                        const isCurrent = session.id === currentSessionId;
                        return h(
                          "button",
                          {
                            key: session.id,
                            type: "button",
                            role: "menuitem",
                            className: "tbw-item",
                            "aria-current": isCurrent ? "true" : undefined,
                            title: [sessionTitle(session, t), statusLabel(rowState, t)].filter(Boolean).join("\n"),
                            onClick: () => run(() => openSession(session.id)),
                          },
                          rowState !== "idle"
                            ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: rowState, size: 8 }))
                            : h("span", { className: "tbw-dot", "aria-hidden": true }),
                          h("span", { className: "tbw-itemName" }, sessionTitle(session, t)),
                        );
                      }),
                ),
              ),
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
              openSession: (sessionId) => ctx.uiWorkspace.openSession(sessionId),
              newSession: (workspaceId) => ctx.uiWorkspace.startSession(workspaceId),
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
