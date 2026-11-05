# dsh-titlebar-workspace

[中文](#中文) | [English](#english)

## 中文

一个出现在 DeepSeek Harness **桌面端顶栏**的工作区切换器：不打开左侧栏，也能看到当前项目并直接切换。

**功能**

- **当前工作区常驻顶栏** —— 当前项目的名字一直在顶栏，点一下就能切换。
- **状态一眼可见** —— 彩色圆点提示需要关注的事：黄色代表有工作区在等你，绿色代表有对话你还没看过，转圈代表正在运行。
- **跨项目提醒** —— 顶栏显示所有工作区里最紧急的状态，别的项目有审批或提问时，不用切过去也能看到。
- **工作区与对话两级菜单** —— 下拉先列出工作区；鼠标移上去展开该工作区的对话、各自的状态，以及“新建对话”。
- **一次点击直达合适的对话** —— 点工作区会打开最该看的那条：等待优先，其次未读，再其次运行中，同状态取最新的；空工作区则新建一条。
- **按需新建对话** —— 复用已有的空白对话，不会堆出一串空会话；新建后列表保持展开，能立刻看到结果。
- **融入桌面** —— 与顶栏控件同款样式，跟随侧栏收放调整位置；点外部、按 Esc 或弹窗出现时收起。

### 安装

把本目录作为 profile bundle 安装：通过插件页，或使用
`plugin_manager install_bundle`。移除 bundle 即可恢复原生顶栏。

### 测试

```sh
npm install
npm test
npm run preview
```

## English

A workspace switcher for the DeepSeek Harness **desktop titlebar**: see the
current project and switch without opening the left sidebar.

**Features**

- **The current workspace, always visible** — the active project's name sits in
  the titlebar; click it to switch.
- **Status at a glance** — colored dots show what needs attention: yellow for a
  workspace waiting for you, green for a conversation you have not read yet, a
  spinner while work is running.
- **Alerts from every project** — the titlebar carries the most urgent state
  across all workspaces, so a pending approval in another project is visible
  without leaving the current one.
- **Workspaces and their conversations** — the dropdown lists workspaces; hover
  one to see its conversations, their individual statuses and a
  "New conversation" action.
- **One click to the right conversation** — clicking a workspace opens its most
  relevant conversation: waiting first, then unread, then running, newest when
  tied; an empty workspace starts a new conversation.
- **New conversation on demand** — it reuses an existing blank conversation
  instead of piling up empties, and the list stays open so the result is visible
  immediately.
- **Fits the desktop** — styled like the titlebar controls, follows the sidebar
  collapsing, and closes on an outside click, Escape, or when a dialog opens.

### Install

Install this directory as a profile bundle through the plugin page, or with
`plugin_manager install_bundle`. Removing the bundle restores the stock
titlebar.

### Test

```sh
npm install
npm test
npm run preview
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
