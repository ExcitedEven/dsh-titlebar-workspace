// DOM integration smoke test for dsh-titlebar-workspace: mounts the chip in
// jsdom the way the app would and checks the measured placement, the two-pane
// menu (workspaces + conversations), per-conversation dots and the two actions.

const { JSDOM } = require("jsdom");
const React = require("react");
const { createRoot } = require("react-dom/client");

const dom = new JSDOM(
  `<!doctype html><html lang="zh-CN" data-windows-titlebar=""><head></head><body>
     <div id="menu-host" data-windows-menu=""></div>
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
  return rect(0, 0, 0, 0);
};

const loaded = [];
window.__ModuleLoader__ = {
  load(definition) {
    loaded.push(definition);
  },
};

const primitives = {
  IconChevronDownOutlineRegular: (props) => React.createElement("svg", { "data-icon": "chevron", width: props.size, height: props.size }),
  StateDot: (props) => React.createElement("span", { "data-state-dot": props.state }),
};

require("../lib/client.js");
if (loaded.length !== 1) throw new Error(`expected one bundle, got ${loaded.length}`);
const definition = loaded[0];
if (definition.id !== "dsh-titlebar-workspace") throw new Error(`unexpected id ${definition.id}`);
const exportsObject = definition.factory((name) => {
  if (name === "react") return React;
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
  "session.untitled": "未命名对话",
  "status.warning": "等待你处理",
  "status.ongoing": "运行中",
  "status.done": "刚完成",
};
const t = (key, params) => (zh[key] ?? key).replace("{name}", params === undefined ? "" : String(params.name));

const workspaces = {
  phase: "ready",
  items: [
    { workspaceId: "w1", title: "working-project", sessionIds: ["s1", "s2"], path: "/home/user/projects/working-project" },
    { workspaceId: "w2", title: "pending-project", sessionIds: ["s3"], path: "/tmp/pending-project" },
    { workspaceId: "w3", title: "running-project", sessionIds: ["s4"], path: "/tmp/running-project" },
  ],
};
const sessions = {
  byId: {
    s1: { id: "s1", title: "done-session", updatedAt: 300, retainedBy: { mainView: 1 } },
    s2: { id: "s2", title: "old-session", updatedAt: 100, retainedBy: {} },
    s3: { id: "s3", title: "pending-session", updatedAt: 200, retainedBy: {} },
    s4: { id: "s4", title: "running-session", updatedAt: 250, retainedBy: {} },
  },
};
const statuses = new Map([
  ["s1", { running: false, completionUnread: true }],
  ["s2", { running: false }],
  ["s3", { running: false, pendingInteraction: { kind: "approval" } }],
  ["s4", { running: true }],
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
  if (chip.textContent !== "DSH") throw new Error(`unexpected chip label: ${chip.textContent}`);
  const rootEl = container.querySelector(".tbw-root");
  if (rootEl.style.getPropertyValue("--tbw-left") !== "124px") {
    throw new Error(`unexpected placement: ${rootEl.style.getPropertyValue("--tbw-left")}`);
  }
  // The chip reports the open conversation's status.
  if (dots(chip) !== "done") throw new Error(`chip dot: ${dots(chip)}`);

  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);

  let menu = window.document.querySelector(".tbw-menu");
  if (menu === null) throw new Error("menu did not open");
  if (menu.style.left !== "124px") throw new Error(`unexpected menu left: ${menu.style.left}`);

  const workspaceRows = [...menu.querySelectorAll("[role=menuitem]")];
  if (workspaceRows.length !== 3) throw new Error(`expected 3 workspace rows, got ${workspaceRows.length}`);
  const rowStates = workspaceRows.map(dots);
  if (rowStates.join(",") !== "done,warning,ongoing") throw new Error(`workspace dots: ${rowStates.join(",")}`);
  if (workspaceRows[0].getAttribute("data-current") !== "true") throw new Error("current workspace not marked");

  // The flyout shows the current workspace's conversations, placed to the right.
  let sessionsPane = window.document.querySelector(".tbw-sub");
  if (sessionsPane === null) throw new Error("flyout did not open");
  if (sessionsPane.style.left !== "342px") throw new Error(`flyout should sit right of the menu: ${sessionsPane.style.left}`);
  let sessionRows = [...sessionsPane.querySelectorAll("[role=menuitem]")];
  if (sessionRows.map((row) => row.textContent).join("|") !== "done-session|old-session") {
    throw new Error(`unexpected first pane: ${sessionRows.map((row) => row.textContent).join("|")}`);
  }
  if (sessionRows.map(dots).join(",") !== "done,idle") throw new Error(`session dots: ${sessionRows.map(dots).join(",")}`);

  // Hovering another workspace swaps the pane without creating anything.
  workspaceRows[1].dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true, relatedTarget: window.document.body }));
  await wait(40);
  sessionsPane = window.document.querySelector(".tbw-sub");
  sessionRows = [...sessionsPane.querySelectorAll("[role=menuitem]")];
  if (sessionsPane.style.top === "0px") throw new Error("flyout was not anchored to the hovered row");
  if (sessionRows.length !== 1 || sessionRows[0].textContent !== "pending-session") {
    throw new Error(`unexpected second pane: ${sessionRows.map((row) => row.textContent).join("|")}`);
  }
  if (dots(sessionRows[0]) !== "warning") throw new Error(`session dot: ${dots(sessionRows[0])}`);

  // New conversation is explicit.
  sessionsPane.querySelector(".tbw-new").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2") throw new Error(`new calls: ${calls.join(",")}`);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("menu stayed open after new");

  // Opening an existing conversation.
  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(50);
  menu = window.document.querySelector(".tbw-menu");
  const reopenedRows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  reopenedRows[2].dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true, relatedTarget: window.document.body }));
  await wait(30);
  const busyRow = window.document.querySelector(".tbw-sub [role=menuitem]");
  busyRow.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (calls.join(",") !== "new:w2,open:s4") throw new Error(`calls: ${calls.join(",")}`);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("menu stayed open after open");

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
