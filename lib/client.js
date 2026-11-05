"use strict";
/**
 * TypeScript source for the client bundle.
 *
 * The DSH client module loader executes this file as a script: it calls
 * `window.__ModuleLoader__.load` and hands over a factory. React, react-dom and
 * the shared UI primitives are resolved through that factory's `require` at
 * runtime.
 */
const loader = window.__ModuleLoader__;
if (loader === undefined) {
    throw new Error("dsh-titlebar-workspace: client module loader unavailable");
}
loader.load({
    id: "dsh-titlebar-workspace",
    factory: (require) => {
        var module = { exports: {} };
        var exports = module.exports;
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
        const React = require("react");
        const reactDom = require("react-dom");
        const h = React.createElement;
        const primitives = require("@deepseek-ai/dsh-client-ui-primitives");
        const IconChevronDownRegular = primitives.IconChevronDownOutlineRegular;
        const IconNewChatRegular = primitives.IconNewChatOutlineRegular;
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
            "session.new": "新对话",
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
            "session.new": "New conversation",
            "session.untitled": "Untitled conversation",
            "status.warning": "Waiting for you",
            "status.ongoing": "Running",
            "status.done": "Just finished",
        };
        // Metrics mirror the Desktop titlebar controls: 28px buttons, 10px side
        // padding, 6px radius, 14px label text, inside a 40px titlebar strip.
        // Keeping the same numbers is what makes the chip sit in the titlebar row.
        const CSS = [
            ".tbw-root{position:fixed;top:0;left:var(--tbw-left,96px);z-index:30;-webkit-app-region:no-drag;align-items:center;height:var(--dsh-windows-titlebar-height,40px);display:flex;pointer-events:none}",
            ".tbw-button{pointer-events:auto;border:0;border-radius:6px;background:0 0;height:28px;max-width:260px;padding:0 10px;color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;cursor:default;align-items:center;gap:6px;display:inline-flex}",
            ".tbw-button:hover,.tbw-button[aria-expanded=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
            ".tbw-button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}",
            ".tbw-dot{flex:none;justify-content:center;align-items:center;width:10px;display:inline-flex}",
            ".tbw-name{white-space:nowrap;text-overflow:ellipsis;min-width:0;max-width:200px;overflow:hidden}",
            ".tbw-chevron{flex:none;color:var(--dsw-alias-label-caption);display:inline-flex}",
            ".tbw-menu{position:fixed;top:calc(var(--dsh-windows-titlebar-height,40px) - 4px);z-index:1200;width:216px;max-height:min(60vh,420px);overflow-y:auto;background:var(--dsw-specific-input-major);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);box-shadow:var(--dsw-elevation-prominent);padding:4px;pointer-events:auto;-webkit-app-region:no-drag;display:flex;flex-direction:column}",
            ".tbw-menu:focus{outline:none}",
            ".tbw-sub{position:fixed;z-index:1201;width:300px;max-height:min(60vh,420px);overflow-y:auto;background:var(--dsw-specific-input-major);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);box-shadow:var(--dsw-elevation-prominent);padding:4px;pointer-events:auto;-webkit-app-region:no-drag;display:flex;flex-direction:column}",
            ".tbw-sub:focus{outline:none}",
            ".tbw-subHead{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px;padding:6px 8px 4px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;flex:none}",
            ".tbw-menuLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;padding:6px 8px 4px}",
            ".tbw-item{border:0;border-radius:var(--dsw-radius-sm);background:0 0;width:100%;height:32px;padding:0 8px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;text-align:left;cursor:pointer;align-items:center;gap:8px;display:flex}",
            ".tbw-item:hover,.tbw-item:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}",
            ".tbw-item[aria-current=true],.tbw-item[data-active=true]{background:var(--dsw-alias-interactive-bg-hover)}",
            ".tbw-item[aria-current=true]{color:var(--dsw-alias-state-business-primary)}",
            ".tbw-itemName{white-space:nowrap;text-overflow:ellipsis;min-width:0;flex:1;overflow:hidden}",
            ".tbw-check{flex:none;color:currentColor;display:inline-flex}",
            ".tbw-new{border:0;border-radius:var(--dsw-radius-sm);background:0 0;width:100%;height:32px;padding:0 8px;color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-family);font-size:14px;line-height:20px;text-align:left;cursor:pointer;align-items:center;gap:8px;display:flex;flex:none}",
            ".tbw-new:hover,.tbw-new:focus-visible{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);outline:none}",
            ".tbw-plus{flex:none;justify-content:center;align-items:center;width:16px;height:16px;color:currentColor;display:inline-flex}",
            ".tbw-empty{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;padding:8px}",
            ".tbw-error{pointer-events:auto;color:var(--dsw-alias-state-error-primary);font-size:13px;padding-left:4px}",
        ].join("");
        function ensureStyles() {
            if (document.querySelector('style[data-plugin-css="' + CSS_ID + '"]') !== null)
                return;
            const style = document.createElement("style");
            style.setAttribute("data-plugin-css", CSS_ID);
            style.textContent = CSS;
            document.head.appendChild(style);
        }
        /** Only a rendered, exposed dialog counts as an open modal. */
        function hasVisibleModal() {
            try {
                for (const element of document.querySelectorAll('[role="dialog"][aria-modal="true"]')) {
                    if (element.getAttribute("aria-hidden") === "true")
                        continue;
                    if (element.hasAttribute("hidden"))
                        continue;
                    if (element.getClientRects().length === 0)
                        continue;
                    return true;
                }
                return false;
            }
            catch {
                return false;
            }
        }
        function workspaceTitle(item, t) {
            if (typeof item.title === "string" && item.title !== "")
                return item.title;
            if (typeof item.path === "string" && item.path !== "") {
                const parts = item.path.replace(/[\\/]+$/, "").split(/[\\/]/);
                if (parts.length > 0 && parts[parts.length - 1] !== "")
                    return parts[parts.length - 1];
            }
            return t("chip.untitled");
        }
        function workspacePath(item) {
            if (typeof item.path === "string" && item.path !== "")
                return item.path;
            return typeof item.cwd === "string" && item.cwd !== "" ? item.cwd : undefined;
        }
        function lookup(statuses, sessionId) {
            if (statuses === undefined || statuses === null)
                return undefined;
            return statuses instanceof Map ? statuses.get(sessionId) : statuses[sessionId];
        }
        /** One conversation's dot, using the sidebar's status priority. */
        function sessionState(status) {
            if (status === undefined || status === null)
                return "idle";
            if (status.pendingInteraction !== undefined && status.pendingInteraction !== null)
                return "warning";
            if (status.running === true)
                return "ongoing";
            if (status.completionUnread === true)
                return "done";
            return "idle";
        }
        /** The product's attention order: waiting first, then unread, then live work. */
        const STATE_RANK = { warning: 3, done: 2, ongoing: 1, idle: 0 };
        function rankOf(state) {
            return STATE_RANK[state] ?? 0;
        }
        function isBlank(session) {
            return session !== undefined && session.blank === true;
        }
        /** Aggregate the members of one workspace for its row in the left column. */
        function workspaceState(item, statuses, sessions) {
            let best = "idle";
            for (const sessionId of Array.isArray(item.sessionIds) ? item.sessionIds : []) {
                // The sidebar never lets a blank placeholder carry a status.
                if (isBlank(sessions === undefined ? undefined : sessions[sessionId]))
                    continue;
                const state = sessionState(lookup(statuses, sessionId));
                if (rankOf(state) > rankOf(best))
                    best = state;
            }
            return best;
        }
        /** Highest-priority workspace across the roster, used by the chip outside the menu. */
        function globalState(workspaces, statuses, sessions) {
            let best = { state: "idle" };
            for (const workspace of workspaces) {
                const state = workspaceState(workspace, statuses, sessions);
                if (rankOf(state) > rankOf(best.state))
                    best = { state, workspace };
            }
            return best;
        }
        /**
         * The conversation a workspace click should open: highest state first
         * (warning > done > ongoing > idle), newest first among equal states.
         */
        function bestSession(item, sessions, statuses) {
            let best;
            let bestRank = -1;
            for (const sessionId of Array.isArray(item.sessionIds) ? item.sessionIds : []) {
                const session = sessions[sessionId];
                if (session === undefined || session.archived === true || session.blank === true)
                    continue;
                const rank = rankOf(sessionState(lookup(statuses, sessionId)));
                if (rank > bestRank || (rank === bestRank && (session.updatedAt ?? 0) > (best === undefined ? -1 : best.updatedAt ?? 0))) {
                    best = session;
                    bestRank = rank;
                }
            }
            return best;
        }
        /**
         * Conversations shown in the flyout. Mirrors the sidebar: every ordinary
         * session, plus the current blank one as the provisional New Conversation
         * row (always first); other blanks stay hidden.
         */
        function visibleSessions(item, sessions, currentSessionId) {
            return (Array.isArray(item.sessionIds) ? item.sessionIds : [])
                .map((id) => sessions[id])
                .filter((session) => session !== undefined && session.archived !== true && (session.blank !== true || session.id === currentSessionId))
                .sort((a, b) => {
                const aBlank = a.blank === true ? 1 : 0;
                const bBlank = b.blank === true ? 1 : 0;
                if (aBlank !== bBlank)
                    return bBlank - aBlank;
                return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
            });
        }
        function statusLabel(state, t) {
            if (state === "warning")
                return t("status.warning");
            if (state === "ongoing")
                return t("status.ongoing");
            if (state === "done")
                return t("status.done");
            return "";
        }
        function sessionTitle(session, t) {
            if (session.blank === true)
                return t("session.new");
            if (typeof session.title === "string" && session.title !== "")
                return session.title;
            return t("session.untitled");
        }
        /**
         * Track the right edge of the titlebar's own controls.
         *
         * Their `left` is a CSS variable the sidebar flips when it collapses
         * (`--dsh-windows-menu-start`), so the width does not change when the layout
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
                    if (timer !== 0)
                        window.clearInterval(timer);
                    if (resize !== null)
                        resize.disconnect();
                    window.removeEventListener("resize", measure);
                    observer.disconnect();
                };
            }, []);
            return right;
        }
        /**
         * Workspace chip in the Desktop titlebar.
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
            const [anchorTop, setAnchorTop] = React.useState(null);
            const [subPos, setSubPos] = React.useState(null);
            const [viewportWidth, setViewportWidth] = React.useState(() => window.innerWidth);
            const [error, setError] = React.useState(null);
            const rootRef = React.useRef(null);
            const menuRef = React.useRef(null);
            const subRef = React.useRef(null);
            const buttonRef = React.useRef(null);
            const workspaces = workspaceSnapshot !== undefined && workspaceSnapshot !== null && Array.isArray(workspaceSnapshot.items)
                ? workspaceSnapshot.items
                : [];
            const sessions = sessionSnapshot !== undefined && sessionSnapshot !== null && sessionSnapshot.byId !== undefined
                ? sessionSnapshot.byId
                : {};
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
            // The chip reports the whole roster's highest state, so a warning in another
            // workspace still reaches the window's titlebar.
            const global = globalState(workspaces, statuses, sessions);
            const label = currentWorkspace === undefined ? t("chip.choose") : workspaceTitle(currentWorkspace, t);
            const stateText = statusLabel(global.state, t);
            const ownerTitle = global.workspace !== undefined && (currentWorkspace === undefined || global.workspace.workspaceId !== currentWorkspace.workspaceId)
                ? workspaceTitle(global.workspace, t)
                : undefined;
            const activeWorkspace = workspaces.find((item) => item.workspaceId === activeId)
                ?? currentWorkspace
                ?? workspaces[0];
            const activeSessions = activeWorkspace === undefined ? [] : visibleSessions(activeWorkspace, sessions, currentSessionId);
            const openMenu = () => {
                setActiveId(currentWorkspace === undefined ? null : currentWorkspace.workspaceId);
                setAnchorTop(null);
                setSubPos(null);
                setOpen(true);
            };
            React.useEffect(() => {
                ensureStyles();
            }, []);
            React.useEffect(() => {
                const onResize = () => setViewportWidth(window.innerWidth);
                window.addEventListener("resize", onResize);
                return () => window.removeEventListener("resize", onResize);
            }, []);
            // Place the conversation flyout beside the menu: right when it fits,
            // otherwise left, vertically aligned to the hovered workspace row and
            // clamped inside the viewport. Recompute after layout (rAF) and whenever
            // either panel changes size, so a late stylesheet or a taller list cannot
            // leave the flyout at a stale position.
            React.useLayoutEffect(() => {
                if (!open || activeWorkspace === undefined) {
                    setSubPos(null);
                    return undefined;
                }
                const compute = () => {
                    const menu = menuRef.current;
                    if (menu === null)
                        return;
                    const sub = subRef.current;
                    const menuRect = menu.getBoundingClientRect();
                    const subRect = sub === null ? null : sub.getBoundingClientRect();
                    const styled = subRect !== null && subRect.width > 0 && subRect.width < window.innerWidth;
                    const width = styled ? subRect.width : 300;
                    const height = styled && subRect.height > 0 ? subRect.height : 320;
                    const barHeight = Number.parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--dsh-windows-titlebar-height")) || 40;
                    const viewportHeight = window.innerHeight;
                    const fitsRight = menuRect.right + 2 + width <= window.innerWidth - 8;
                    const nextLeft = fitsRight
                        ? Math.round(menuRect.right + 2)
                        : Math.max(8, Math.round(menuRect.left - width - 2));
                    const wanted = anchorTop === null ? barHeight + 4 : anchorTop;
                    const nextTop = Math.max(barHeight + 4, Math.min(Math.round(wanted), viewportHeight - 8 - height));
                    setSubPos((current) => current !== null && current.left === nextLeft && current.top === nextTop && current.side === (fitsRight ? "right" : "left")
                        ? current
                        : { left: nextLeft, top: nextTop, side: fitsRight ? "right" : "left" });
                };
                compute();
                const raf = window.requestAnimationFrame(compute);
                const observer = typeof ResizeObserver === "function" ? new ResizeObserver(compute) : null;
                if (observer !== null) {
                    if (menuRef.current !== null)
                        observer.observe(menuRef.current);
                    if (subRef.current !== null)
                        observer.observe(subRef.current);
                }
                window.addEventListener("resize", compute);
                return () => {
                    window.cancelAnimationFrame(raf);
                    if (observer !== null)
                        observer.disconnect();
                    window.removeEventListener("resize", compute);
                };
            }, [open, activeId, anchorTop, viewportWidth, activeWorkspace === undefined ? null : activeWorkspace.workspaceId]);
            const run = (action) => {
                setOpen(false);
                setError(null);
                Promise.resolve(action()).catch((reason) => {
                    setError(reason instanceof Error ? reason.message : String(reason));
                });
            };
            React.useEffect(() => {
                if (!open)
                    return undefined;
                const onPointerDown = (event) => {
                    const target = event.target instanceof Node ? event.target : null;
                    if (rootRef.current !== null && rootRef.current.contains(target))
                        return;
                    if (menuRef.current !== null && menuRef.current.contains(target))
                        return;
                    if (subRef.current !== null && subRef.current.contains(target))
                        return;
                    setOpen(false);
                };
                // The panels sit above every in-page layer, so a dialog that opens
                // while the menu is up would otherwise be behind it.
                const closeOnModal = () => {
                    if (hasVisibleModal())
                        setOpen(false);
                };
                const observer = new MutationObserver(closeOnModal);
                observer.observe(document.body, { childList: true, subtree: true });
                closeOnModal();
                document.addEventListener("pointerdown", onPointerDown, true);
                return () => {
                    observer.disconnect();
                    document.removeEventListener("pointerdown", onPointerDown, true);
                };
            }, [open]);
            React.useEffect(() => {
                if (!open || menuRef.current === null)
                    return;
                const target = menuRef.current.querySelector('[data-current="true"]') ?? menuRef.current.querySelector("button");
                if (target !== null)
                    target.focus();
            }, [open]);
            const onMenuKeyDown = (event) => {
                const menu = menuRef.current;
                if (menu === null)
                    return;
                if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                    if (buttonRef.current !== null)
                        buttonRef.current.focus();
                    return;
                }
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    const first = subRef.current === null ? null : subRef.current.querySelector("button");
                    if (first !== null)
                        first.focus();
                    return;
                }
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                    return;
                event.preventDefault();
                const rows = [...menu.querySelectorAll("button")];
                if (rows.length === 0)
                    return;
                const index = rows.findIndex((row) => row === document.activeElement);
                const delta = event.key === "ArrowDown" ? 1 : -1;
                const next = rows[(index + delta + rows.length) % rows.length];
                if (next !== undefined)
                    next.focus();
            };
            const onSubKeyDown = (event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                    if (buttonRef.current !== null)
                        buttonRef.current.focus();
                    return;
                }
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    const active = menuRef.current === null ? null : menuRef.current.querySelector('[data-active="true"]');
                    if (active !== null)
                        active.focus();
                    return;
                }
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                    return;
                event.preventDefault();
                const sub = subRef.current;
                if (sub === null)
                    return;
                const rows = [...sub.querySelectorAll("button")];
                if (rows.length === 0)
                    return;
                const index = rows.findIndex((row) => row === document.activeElement);
                const delta = event.key === "ArrowDown" ? 1 : -1;
                const next = rows[(index + delta + rows.length) % rows.length];
                if (next !== undefined)
                    next.focus();
            };
            if (left === null)
                return null;
            const menuLeft = Math.max(8, Math.min(left, viewportWidth - 232));
            const chipNode = h("div", { className: "tbw-root", ref: rootRef, style: { "--tbw-left": left + "px" } }, h("button", {
                type: "button",
                ref: buttonRef,
                className: "tbw-button",
                "aria-haspopup": "menu",
                "aria-expanded": open,
                "aria-label": stateText === "" ? t("chip.aria", { name: label }) : t("chip.aria", { name: label }) + "，" + stateText + (ownerTitle === undefined ? "" : "（" + ownerTitle + "）"),
                title: currentWorkspace === undefined ? t("chip.choose") : [label, workspacePath(currentWorkspace), stateText, ownerTitle === undefined ? undefined : "（" + ownerTitle + "）"].filter(Boolean).join("\n"),
                onMouseDown: (event) => event.preventDefault(),
                onClick: () => (open ? setOpen(false) : openMenu()),
            }, global.state !== "idle" ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: global.state, size: 8 })) : null, h("span", { className: "tbw-name" }, label), h("span", { className: "tbw-chevron", "aria-hidden": true }, h(IconChevronDownRegular, { size: 12 }))), error !== null ? h("span", { className: "tbw-error", role: "status", title: error }, "!") : null);
            const menuNode = open
                ? reactDom.createPortal(h("div", {
                    className: "tbw-menu",
                    ref: menuRef,
                    style: { left: menuLeft + "px" },
                    onKeyDown: onMenuKeyDown,
                }, h("div", { className: "tbw-menuLabel" }, t("menu.workspaces")), workspaces.length === 0
                    ? h("div", { className: "tbw-empty" }, t("menu.empty"))
                    : workspaces.map((item) => {
                        const rowState = workspaceState(item, statuses, sessions);
                        const active = activeWorkspace !== undefined && activeWorkspace.workspaceId === item.workspaceId;
                        const isCurrent = currentWorkspace !== undefined && currentWorkspace.workspaceId === item.workspaceId;
                        return h("button", {
                            key: item.workspaceId,
                            type: "button",
                            role: "menuitem",
                            className: "tbw-item",
                            "data-active": active,
                            "data-current": isCurrent,
                            "aria-current": isCurrent ? "true" : undefined,
                            title: [workspaceTitle(item, t), workspacePath(item), statusLabel(rowState, t)].filter(Boolean).join("\n"),
                            onMouseEnter: (event) => {
                                setActiveId(item.workspaceId);
                                setAnchorTop(event.currentTarget.getBoundingClientRect().top);
                            },
                            onFocus: (event) => {
                                setActiveId(item.workspaceId);
                                setAnchorTop(event.currentTarget.getBoundingClientRect().top);
                            },
                            onClick: () => {
                                const target = bestSession(item, sessions, statuses);
                                if (target === undefined)
                                    run(() => newSession(item.workspaceId));
                                else
                                    run(() => openSession(target.id));
                            },
                        }, rowState !== "idle"
                            ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: rowState, size: 8 }))
                            : h("span", { className: "tbw-dot", "aria-hidden": true }), h("span", { className: "tbw-itemName" }, workspaceTitle(item, t)), isCurrent ? h("span", { className: "tbw-check", "aria-hidden": true }, "\u2713") : null);
                    })), document.body)
                : null;
            const subNode = open && activeWorkspace !== undefined
                ? reactDom.createPortal(h("div", {
                    className: "tbw-sub",
                    ref: subRef,
                    role: "menu",
                    "aria-label": t("menu.sessions"),
                    style: {
                        left: (subPos === null ? menuLeft + 226 : subPos.left) + "px",
                        top: (subPos === null ? 44 : subPos.top) + "px",
                    },
                    onKeyDown: onSubKeyDown,
                }, h("div", { className: "tbw-subHead", title: workspacePath(activeWorkspace) }, workspaceTitle(activeWorkspace, t)), h("button", {
                    type: "button",
                    className: "tbw-new",
                    onClick: () => {
                        setError(null);
                        Promise.resolve(newSession(activeWorkspace.workspaceId)).catch((reason) => {
                            setError(reason instanceof Error ? reason.message : String(reason));
                        });
                    },
                }, h("span", { className: "tbw-plus", "aria-hidden": true }, IconNewChatRegular === undefined ? "+" : h(IconNewChatRegular, { size: 16 })), h("span", { className: "tbw-itemName" }, t("menu.new"))), activeSessions.length === 0
                    ? h("div", { className: "tbw-empty" }, t("menu.emptySessions"))
                    : activeSessions.map((session) => {
                        const rowState = sessionState(lookup(statuses, session.id));
                        const isCurrent = session.id === currentSessionId;
                        return h("button", {
                            key: session.id,
                            type: "button",
                            role: "menuitem",
                            className: "tbw-item",
                            "aria-current": isCurrent ? "true" : undefined,
                            title: [sessionTitle(session, t), statusLabel(rowState, t)].filter(Boolean).join("\n"),
                            onClick: () => run(() => openSession(session.id)),
                        }, rowState !== "idle"
                            ? h("span", { className: "tbw-dot", "aria-hidden": true }, h(StateDot, { state: rowState, size: 8 }))
                            : h("span", { className: "tbw-dot", "aria-hidden": true }), h("span", { className: "tbw-itemName" }, sessionTitle(session, t)));
                    })), document.body)
                : null;
            return h(React.Fragment, null, chipNode, menuNode === null && subNode === null ? null : reactDom.createPortal(h(React.Fragment, null, menuNode, subNode), document.body));
        }
        const inject = ["slots", "locale", "uiWorkspace"];
        function apply(ctx) {
            ctx.effect(() => ctx.locale.register(NS, { zh, en }), "titlebar-workspace: dictionaries");
            // Keep the stylesheet alive across HMR swaps: the previous bundle's teardown
            // can remove a style tag inserted by the incoming bundle, and then nothing
            // would re-add it (unstyled menu/flyout landing in normal flow).
            ctx.effect(() => {
                ensureStyles();
                const observer = new MutationObserver(() => ensureStyles());
                observer.observe(document.head, { childList: true });
                return () => observer.disconnect();
            }, "titlebar-workspace: styles");
            ctx.slots.inject(SLOT, () => ctx.slots.register({
                name: SLOT,
                id: CELL_ID,
                order: 5,
                locale: NS,
                inject: () => ({
                    openSession: (sessionId) => ctx.uiWorkspace.openSession(sessionId),
                    newSession: (workspaceId) => ctx.uiWorkspace.startSession(workspaceId),
                }),
            }, WorkspaceChip));
        }
        exports.apply = apply;
        exports.inject = inject;
        return module.exports;
    },
});
