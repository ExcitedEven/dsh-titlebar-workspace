// DOM integration smoke test for dsh-titlebar-workspace: mounts the chip in
// jsdom the way the app would and checks the measured placement, the two-pane
// menu (workspaces + conversations), per-conversation dots and the two actions.

const { JSDOM } = require("jsdom");
const React = require("react");
const { createRoot } = require("react-dom/client");

const dom = new JSDOM(
  `<!doctype html><html lang="zh-CN" data-windows-titlebar=""><head></head><body>
     <div id="menu-host" data-windows-menu=""></div>
     <div id="hidden-dialog" role="dialog" aria-modal="true"></div>
     <div id="root"></div>
   </body></html>`,
  { pretendToBeVisual: true, url: "https://example.test/" },
);

const { window } = dom;
global.window = window;
global.document = window.document;
global.Element = window.Element;
global.MutationObserver = window.MutationObserver;
// jsdom has no ResizeObserver: the plugin falls back to polling + resize.

const host = window.document.getElementById("menu-host");
let hostRight = 120;
const rect = (left, top, width, height) => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
  width,
  height,
  x: left,
  y: top,
  toJSON() {},
});
// jsdom does not lay out, so give every element the geometry the browser would.
window.Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  if (this.id === "menu-host") return rect(hostRight - 72, 0, 72, 40);
  const className = typeof this.className === "string" ? this.className : "";
  if (className.indexOf("tbw-menu") >= 0) return rect(Number.parseFloat(this.style.left) || 0, 40, 216, 140);
  if (className.indexOf("tbw-sub") >= 0) return rect(Number.parseFloat(this.style.left) || 0, Number.parseFloat(this.style.top) || 0, 300, 160);
  if (className.indexOf("tbw-item") >= 0 || className.indexOf("tbw-button") >= 0) return rect(124, 60, 200, 32);
  if (this.id === "visible-dialog") return rect(200, 200, 320, 200);
  return rect(0, 0, 0, 0);
};
window.Element.prototype.getClientRects = function getClientRects() {
  const box = this.getBoundingClientRect();
  return box.width > 0 && box.height > 0 ? [box] : [];
};

const loaded = [];
window.__ModuleLoader__ = {
  load(definition) {
    loaded.push(definition);
  },
};

const primitives = {
  IconChevronDownOutlineRegular: (props) => React.createElement("svg", { "data-icon": "chevron", width: props.size, height: props.size }),
  IconNewChatOutlineRegular: (props) => React.createElement("svg", { "data-icon": "new-chat", width: props.size, height: props.size }),
  StateDot: (props) => React.createElement("span", { "data-state-dot": props.state }),
};

require("../lib/client.js");
if (loaded.length !== 1) throw new Error(`expected one bundle, got ${loaded.length}`);
const definition = loaded[0];
if (definition.id !== "dsh-titlebar-workspace") throw new Error(`unexpected id ${definition.id}`);
const exportsObject = definition.factory((name) => {
  if (name === "react") return React;
  if (name === "react-dom") return require("react-dom");
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitives;
  throw new Error(`unexpected require: ${name}`);
});

const registrations = [];
const calls = [];
const ctx = {
  effect(effect) {
    effect();
    return () => {};
  },
  locale: {
    register(namespace, dictionaries) {
      if (!dictionaries.zh || !dictionaries.en) throw new Error("locale dictionaries incomplete");
    },
    bind: () => (key) => key,
  },
  slots: {
    inject(_slot, factory) {
      factory();
    },
    register(declaration, component) {
      registrations.push({ declaration, component });
      return () => {};
    },
  },
  uiWorkspace: {
    openSession(sessionId) {
      calls.push(`open:${sessionId}`);
      return Promise.resolve();
    },
    startSession(workspaceId) {
      calls.push(`new:${workspaceId}`);
      return Promise.resolve();
    },
  },
};
exportsObject.apply(ctx);

const registration = registrations.find((entry) => entry.declaration.name === "shell.overlay");
if (registration === void 0) throw new Error("shell.overlay occupant was not registered");
if (registration.declaration.id !== "titlebar-workspace") throw new Error("unexpected cell id");

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
const t = (key, params) => (zh[key] ?? key).replace("{name}", params === undefined ? "" : String(params.name));

const workspaces = {
  phase: "ready",
  items: [
    { workspaceId: "w1", title: "working-project", sessionIds: ["s1", "s2", "s5", "s8", "s9"], path: "/home/user/projects/working-project" },
    { workspaceId: "w2", title: "pending-project", sessionIds: ["s3"], path: "/home/user/projects/pending-project" },
    { workspaceId: "w3", title: "running-project", sessionIds: ["s4"], path: "/home/user/projects/running-project" },
    { workspaceId: "w4", title: "tie-project", sessionIds: ["s6", "s7"], path: "/home/user/projects/tie-project" },
    { workspaceId: "w5", title: "empty-project", sessionIds: ["s10"], path: "/home/user/projects/empty-project" },
  ],
};
const sessions = {
  byId: {
    s1: { id: "s1", title: "done-session", updatedAt: 300, retainedBy: {} },
    s2: { id: "s2", title: "old-session", updatedAt: 100, retainedBy: {} },
    s3: { id: "s3", title: "pending-session", updatedAt: 200, retainedBy: {} },
    s4: { id: "s4", title: "running-session", updatedAt: 250, retainedBy: {} },
    s5: { id: "s5", title: "another-running-session", updatedAt: 400, retainedBy: {} },
    s6: { id: "s6", title: "done-a", updatedAt: 500, retainedBy: {} },
    s7: { id: "s7", title: "done-b", updatedAt: 600, retainedBy: {} },
    s8: { id: "s8", blank: true, updatedAt: 900, retainedBy: {} },
    s9: { id: "s9", blank: true, updatedAt: 950, retainedBy: { mainView: 1 } },
    s10: { id: "s10", blank: true, updatedAt: 960, retainedBy: {} },
  },
};
const statuses = new Map([
  ["s1", { running: false, completionUnread: true }],
  ["s2", { running: false }],
  ["s3", { running: false, pendingInteraction: { kind: "approval" } }],
  ["s4", { running: true }],
  ["s5", { running: true }],
  ["s6", { running: false, completionUnread: true }],
  ["s7", { running: false, completionUnread: true }],
]);

const component = registration.component;
const container = window.document.getElementById("root");
const root = createRoot(container);
root.render(
  React.createElement(component, {
    useWorkspaces: (selector) => selector(workspaces),
    useSessions: (selector) => selector(sessions),
    useSessionStatus: (selector) => selector(statuses),
    openSession: (sessionId) => {
      calls.push(`open:${sessionId}`);
      return Promise.resolve();
    },
    newSession: (workspaceId) => {
      calls.push(`new:${workspaceId}`);
      return Promise.resolve();
    },
    t,
  }),
);

const wait = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));
const dots = (row) => {
  const dot = row.querySelector("[data-state-dot]");
  return dot === null ? "idle" : dot.getAttribute("data-state-dot");
};

(async () => {
  await wait(90);

  const chip = container.querySelector(".tbw-button");
  if (chip === null) throw new Error("chip button did not render");
  if (chip.textContent !== "working-project") throw new Error(`unexpected chip label: ${chip.textContent}`);
  const rootEl = container.querySelector(".tbw-root");
  if (rootEl.style.getPropertyValue("--tbw-left") !== "124px") {
    throw new Error(`unexpected placement: ${rootEl.style.getPropertyValue("--tbw-left")}`);
  }
  // The chip reports the roster-wide highest state (a warning in another workspace).
  if (dots(chip) !== "warning") throw new Error(`chip dot: ${dots(chip)}`);

  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);

  let menu = window.document.querySelector(".tbw-menu");
  if (menu === null) throw new Error("menu did not open");
  if (menu.style.left !== "124px") throw new Error(`unexpected menu left: ${menu.style.left}`);

  let workspaceRows = [...menu.querySelectorAll("[role=menuitem]")];
  if (workspaceRows.length !== 5) throw new Error(`expected 5 workspace rows, got ${workspaceRows.length}`);
  const rowStates = workspaceRows.map(dots);
  if (rowStates.join(",") !== "done,warning,ongoing,done,idle") throw new Error(`workspace dots: ${rowStates.join(",")}`);
  if (workspaceRows[0].getAttribute("data-current") !== "true") throw new Error("current workspace not marked");

  // The flyout mirrors the sidebar: current blank first as "新对话", other blanks hidden.
  let sessionsPane = window.document.querySelector(".tbw-sub");
  if (sessionsPane === null) throw new Error("flyout did not open");
  if (sessionsPane.style.left !== "342px") throw new Error(`flyout should sit right of the menu: ${sessionsPane.style.left}`);
  let sessionRows = [...sessionsPane.querySelectorAll("[role=menuitem]")];
  if (sessionRows.map((row) => row.textContent).join("|") !== "新对话|another-running-session|done-session|old-session") {
    throw new Error(`unexpected first pane: ${sessionRows.map((row) => row.textContent).join("|")}`);
  }
  if (sessionRows.map(dots).join(",") !== "idle,ongoing,done,idle") throw new Error(`session dots: ${sessionRows.map(dots).join(",")}`);

  // Hovering another workspace swaps the pane without navigating.
  workspaceRows[1].dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true, relatedTarget: window.document.body }));
  await wait(40);
  sessionsPane = window.document.querySelector(".tbw-sub");
  sessionRows = [...sessionsPane.querySelectorAll("[role=menuitem]")];
  if (sessionsPane.style.top === "0px") throw new Error("flyout was not anchored to the hovered row");
  if (sessionRows.length !== 1 || sessionRows[0].textContent !== "pending-session") {
    throw new Error(`unexpected second pane: ${sessionRows.map((row) => row.textContent).join("|")}`);
  }
  if (dots(sessionRows[0]) !== "warning") throw new Error(`session dot: ${dots(sessionRows[0])}`);
  if (calls.length !== 0) throw new Error(`hover navigated: ${calls.join(",")}`);

  // New conversation keeps the flyout open so the provisional "新对话" row is visible.
  if (sessionsPane.querySelector('.tbw-new [data-icon="new-chat"]') === null) throw new Error("new-chat icon missing");
  sessionsPane.querySelector(".tbw-new").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2") throw new Error(`new calls: ${calls.join(",")}`);
  if (window.document.querySelector(".tbw-menu") === null) throw new Error("menu closed after new");
  window.document.querySelector(".tbw-menu").dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await wait(30);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("Escape did not close the menu");

  // Clicking a workspace opens its best conversation: warning first.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  workspaceRows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  workspaceRows[1].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2,open:s3") throw new Error(`warning click: ${calls.join(",")}`);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("menu stayed open after warning click");

  // done beats ongoing inside one workspace; blanks never win.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  workspaceRows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  workspaceRows[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2,open:s3,open:s1") throw new Error(`done beats ongoing: ${calls.join(",")}`);

  // Equal states pick the newest conversation.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  workspaceRows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  workspaceRows[3].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2,open:s3,open:s1,open:s7") throw new Error(`tie newest: ${calls.join(",")}`);

  // A workspace with only a blank conversation reuses it instead of "opening" it.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  workspaceRows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  workspaceRows[4].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2,open:s3,open:s1,open:s7,new:w5") throw new Error(`blank workspace: ${calls.join(",")}`);

  // Placement follows the menubar when the sidebar collapses (left flips to 84px).
  hostRight = 156;
  await wait(260);
  if (container.querySelector(".tbw-root").style.getPropertyValue("--tbw-left") !== "160px") {
    throw new Error(`placement did not follow: ${container.querySelector(".tbw-root").style.getPropertyValue("--tbw-left")}`);
  }

  // Narrow viewport flips the flyout to the left of the menu.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  Object.defineProperty(window, "innerWidth", { value: 480, configurable: true });
  window.dispatchEvent(new window.Event("resize"));
  await wait(40);
  menu = window.document.querySelector(".tbw-menu");
  if (menu === null) throw new Error("menu closed during resize");
  const sub = window.document.querySelector(".tbw-sub");
  if (sub === null) throw new Error("flyout missing after resize");
  const menuRect = menu.getBoundingClientRect();
  const expected = Math.max(8, Math.round(menuRect.left - 300 - 2));
  if (sub.style.left !== expected + "px") throw new Error(`flyout should flip left: ${sub.style.left} != ${expected}px`);

  // A visible dialog closes the menu; the hidden one above never does.
  const dialog = window.document.createElement("div");
  dialog.id = "visible-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  window.document.body.append(dialog);
  await wait(40);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("visible dialog did not close the menu");

  console.log("chip label:", chip.textContent, "dot:", dots(chip));
  console.log("workspace dots:", rowStates.join(","));
  console.log("calls:", calls.join(","));
  console.log("placement after layout shift:", container.querySelector(".tbw-root").style.getPropertyValue("--tbw-left"));
  console.log("all DOM assertions passed");
  process.exit(0);
})().catch((error) => {
  console.error("FAILED:", error.stack);
  process.exit(1);
});
