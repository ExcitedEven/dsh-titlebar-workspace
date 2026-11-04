// Renders the chip in jsdom, opens its menu, and writes a static preview page
// with the Desktop caption bar (应用 / 编辑) for a visual check.

const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const React = require("react");
const { createRoot } = require("react-dom/client");

const dom = new JSDOM(
  `<!doctype html><html lang="zh-CN" data-windows-titlebar=""><head></head><body>
     <div id="menu-host" data-windows-menu=""></div><div id="root"></div>
   </body></html>`,
  { pretendToBeVisual: true, url: "https://example.test/" },
);
const { window } = dom;
global.window = window;
global.document = window.document;
global.Element = window.Element;
global.MutationObserver = window.MutationObserver;

const rect = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height, x: left, y: top, toJSON() {} });
window.Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  if (this.id === "menu-host") return rect(48, 0, 98, 40);
  const className = typeof this.className === "string" ? this.className : "";
  if (className.indexOf("tbw-menu") >= 0) return rect(Number.parseFloat(this.style.left) || 0, 40, 216, 150);
  if (className.indexOf("tbw-sub") >= 0) return rect(Number.parseFloat(this.style.left) || 0, Number.parseFloat(this.style.top) || 0, 300, 190);
  if (className.indexOf("tbw-item") >= 0) return rect(150, 74, 200, 32);
  return rect(0, 0, 0, 0);
};
window.__ModuleLoader__ = { load: (definition) => loaded.push(definition) };
const loaded = [];
const primitives = {
  IconChevronDownOutlineRegular: (props) => React.createElement("svg", { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none" }, React.createElement("path", { d: "M3 4.5L6 7.5L9 4.5", stroke: "currentColor", "strokeWidth": "1.2", "strokeLinecap": "round", "strokeLinejoin": "round" })),
  IconNewChatOutlineRegular: (props) => React.createElement("svg", { width: props.size, height: props.size, viewBox: "0 0 16 16", fill: "none" }, React.createElement("rect", { x: "2.5", y: "3", width: "11", height: "10", rx: "2.5", stroke: "currentColor", strokeWidth: "1.2" }), React.createElement("path", { d: "M8 6v4M6 8h4", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })),
  StateDot: ({ state, size }) => React.createElement("span", { style: { display: "inline-block", width: (size ?? 10) + "px", height: (size ?? 10) + "px", borderRadius: "50%", background: state === "warning" ? "#f5c518" : state === "done" ? "#3ecf8e" : "#4aa3ff" } }),
};
require("../lib/client.js");
const definition = loaded[0];
const exportsObject = definition.factory((name) => {
  if (name === "react") return React;
  if (name === "react-dom") return require("react-dom");
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitives;
  throw new Error(name);
});

const registrations = [];
exportsObject.apply({
  effect: (effect) => effect(),
  locale: { register() {}, bind: () => (key) => key },
  slots: { inject: (_slot, factory) => factory(), register: (declaration, component) => registrations.push({ declaration, component }) },
  uiWorkspace: { openWorkspace: async () => {} },
});

const t = (key, params) => {
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
  return (zh[key] ?? key).replace("{name}", params === undefined ? "" : String(params.name));
};
const workspaces = {
  phase: "ready",
  items: [
    { workspaceId: "w1", title: "working-project", sessionIds: ["s1"], path: "/home/user/projects/working-project" },
    { workspaceId: "w2", title: "pending-project", sessionIds: ["s3"], path: "/home/user/projects/pending-project" },
    { workspaceId: "w3", title: "running-project", sessionIds: ["s4"], path: "/tmp/running-project" },
  ],
};
const sessions = {
  byId: {
    s1: { id: "s1", title: "write-the-docs", updatedAt: 300, retainedBy: { mainView: 1 } },
    s2: { id: "s2", title: "old-session", updatedAt: 100, retainedBy: {} },
    s3: { id: "s3", title: "review-changes", updatedAt: 200, retainedBy: {} },
    s4: { id: "s4", title: "run-tests", updatedAt: 250, retainedBy: {} },
  },
};
const statuses = new Map([
  ["s1", { running: false, completionUnread: true }],
  ["s2", { running: false }],
  ["s3", { running: false, pendingInteraction: { kind: "approval" } }],
  ["s4", { running: true }],
]);

const root = createRoot(window.document.getElementById("root"));
root.render(
  React.createElement(registrations[0].component, {
    useWorkspaces: (selector) => selector(workspaces),
    useSessions: (selector) => selector(sessions),
    useSessionStatus: (selector) => selector(statuses),
    openSession: async () => {},
    newSession: async () => {},
    t,
  }),
);

const wait = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  await wait(80);
  window.document.querySelector(".tbw-button").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(60);
  const rows = [...window.document.querySelectorAll(".tbw-menu [role=menuitem]")];
  if (rows.length > 1) rows[1].dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true, relatedTarget: window.document.body }));
  await wait(60);

  const css = /const CSS = \[([\s\S]*?)\]\.join\(""\);/
    .exec(fs.readFileSync(path.join(__dirname, "..", "lib", "client.js"), "utf8"))[1]
    .replace(/^\s*\/\/.*$/gm, "");
  const pluginCss = [...css.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((match) => match[1]).join("");
  const chipHtml = window.document.getElementById("root").innerHTML;
  const panelsHtml = [...window.document.body.children]
    .filter((element) => element.classList && (element.classList.contains("tbw-menu") || element.classList.contains("tbw-sub")))
    .map((element) => element.outerHTML)
    .join("");

  const html = `<!doctype html>
<html lang="zh-CN" data-windows-titlebar>
<meta charset="utf-8">
<style>
  *{box-sizing:border-box}
  :root{--dsw-font-family:Inter,"Noto Sans SC",system-ui,sans-serif;--dsw-radius-sm:8px;--dsw-radius-md:12px;--dsh-windows-titlebar-height:40px;
    --dsw-alias-label-primary:#f9fafb;--dsw-alias-label-secondary:#cfd3d6;--dsw-alias-label-tertiary:#9aa0a6;--dsw-alias-label-caption:#8b9095;
    --dsw-alias-state-business-primary:#7aaaff;--dsw-specific-sidebar-fill:#151517;--dsw-specific-input-major:#2c2c2e;
    --dsw-alias-interactive-bg-hover:#ffffff14;--dsw-alias-border-l2:#ffffff1f;--dsw-elevation-prominent:0 0 0 .5px #ffffff1f,0 3px 8px #00000040,0 0 20px #00000033;}
  html,body{margin:0;height:100%;background:var(--dsw-specific-sidebar-fill);font-family:var(--dsw-font-family)}
  .caption{position:fixed;top:0;left:48px;height:var(--dsh-windows-titlebar-height);display:flex;align-items:center;z-index:1100;-webkit-app-region:no-drag}
  .caption div{display:flex;gap:2px}
  .caption button{height:28px;padding:0 10px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary);font:inherit;font-size:14px;cursor:default}
  .caption button:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
  .frame{padding-top:40px;height:100%}
  .fake{background:#0f1115;margin:12px;border-radius:12px;height:calc(100% - 24px);opacity:.55}
  ${pluginCss}
</style>
<div class="caption"><div role="menubar"><button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">应用</button><button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">编辑</button></div></div>
<div class="frame"><div class="fake"></div></div>
${chipHtml}
${panelsHtml}
</html>`;

  fs.writeFileSync(path.join(__dirname, "titlebar-preview.html"), html);
  console.log("preview written");
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
