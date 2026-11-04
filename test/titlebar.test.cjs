// DOM integration smoke test for dsh-titlebar-workspace: mounts the chip into
// jsdom the way the app would and checks the measured position, the workspace
// list and the switch call.

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
// jsdom has no ResizeObserver: the plugin must fall back to polling + resize.

window.document.getElementById("menu-host").getBoundingClientRect = () => ({
  left: 48,
  right: 120,
  top: 0,
  bottom: 40,
  width: 72,
  height: 40,
  x: 48,
  y: 0,
  toJSON() {},
});

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
const opened = [];
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
    openWorkspace(workspaceId) {
      opened.push(workspaceId);
      return Promise.resolve();
    },
  },
};
exportsObject.apply(ctx);

const registration = registrations.find((entry) => entry.declaration.name === "shell.overlay");
if (registration === void 0) throw new Error("shell.overlay occupant was not registered");
if (registration.declaration.id !== "titlebar-workspace") throw new Error("unexpected cell id");

const t = (key, params) => {
  const zh = {
    "chip.aria": "当前工作区：{name}，打开切换菜单",
    "chip.choose": "选择工作区",
    "chip.untitled": "未命名工作区",
    "menu.label": "切换工作区",
    "menu.empty": "还没有工作区",
    "menu.current": "当前工作区",
  };
  const template = zh[key] ?? key;
  return template.replace("{name}", params === undefined ? "" : String(params.name));
};

const workspaces = {
  phase: "ready",
  items: [
    { workspaceId: "w1", title: "working-project", sessionIds: ["s1", "s2"], path: "/home/user/projects/working-project" },
    { workspaceId: "w2", title: "pending-project", sessionIds: ["s3"], path: "/tmp/pending-project" },
    { workspaceId: "w3", title: "running-project", sessionIds: ["s4"], path: "/tmp/running-project" },
  ],
};
const sessions = { byId: { s1: { id: "s1", retainedBy: { mainView: 1 } }, s2: { id: "s2", retainedBy: {} } } };
const statuses = new Map([
  ["s1", { running: false, completionUnread: true }],
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
    switchTo: (workspaceId) => {
      opened.push(workspaceId);
      return Promise.resolve();
    },
    t,
  }),
);

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  await wait(60);

  const chip = container.querySelector(".tbw-button");
  if (chip === null) throw new Error("chip button did not render");
  if (chip.textContent !== "DSH") throw new Error(`unexpected chip label: ${chip.textContent}`);
  const rootEl = container.querySelector(".tbw-root");
  if (rootEl === null) throw new Error("chip root missing");
  if (rootEl.style.getPropertyValue("--tbw-left") !== "124px") {
    throw new Error(`unexpected placement: ${rootEl.style.getPropertyValue("--tbw-left")}`);
  }
  if (chip.getAttribute("aria-expanded") !== "false") throw new Error("aria-expanded should start false");

  chip.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);

  const menu = window.document.querySelector(".tbw-menu");
  if (menu === null) throw new Error("menu did not open");
  if (menu.style.left !== "124px") throw new Error(`unexpected menu left: ${menu.style.left}`);
  const rows = [...menu.querySelectorAll('[role="menuitemradio"]')];
  if (rows.length !== 3) throw new Error(`expected 3 workspace rows, got ${rows.length}`);
  if (rows[0].textContent.indexOf("DSH") < 0) throw new Error("first row label missing");
  if (rows[0].getAttribute("aria-checked") !== "true") throw new Error("current workspace not checked");
  const chipDot = container.querySelector(".tbw-button .tbw-dot [data-state-dot]");
  if (chipDot === null || chipDot.getAttribute("data-state-dot") !== "done") throw new Error("chip dot should show done");
  const rowStates = rows.map((row) => (row.querySelector("[data-state-dot]")?.getAttribute("data-state-dot") ?? "idle"));
  if (rowStates.join(",") !== "done,warning,ongoing") throw new Error(`row dots: ${rowStates.join(",")}`);

  rows[1].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(30);
  if (opened.join(",") !== "w2") throw new Error(`switchTo calls: ${opened.join(",")}`);
  if (window.document.querySelector(".tbw-menu") !== null) throw new Error("menu stayed open after choosing");

  console.log("chip label:", chip.textContent);
  console.log("placement:", rootEl.style.getPropertyValue("--tbw-left"));
  console.log("menu rows:", rows.map((row) => row.textContent).join(" | "));
  console.log("switchTo:", opened.join(","));
  console.log("all DOM assertions passed");
  process.exit(0);
})().catch((error) => {
  console.error("FAILED:", error.message);
  process.exit(1);
});
