const {
  app,
  globalShortcut,
  BrowserWindow,
  BrowserView,
  clipboard,
  ipcMain,
  Menu,
  MenuItem,
} = require("electron");
const { exec } = require("child_process");
const Store = require("electron-store");
const path = require("path");
const defaultConfig = require("./const/default-config");

let CONFIG = new Store();
const isMacOS = process.platform === "darwin";

let mainWindow;
let currentPageIndex;
let pageViews = [];

function createWindow() {
  console.log("createWindow");

  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "index/index-preload.js"),
    },
    titleBarStyle: isMacOS ? "hiddenInset" : "default",
  });
  mainWindow.setBounds(CONFIG.get("bounds"));

  mainWindow.on("close", () => {
    console.log("main.js", "mainWindow close");
    CONFIG.set("bounds", mainWindow.getBounds());
  });

  mainWindow.webContents.loadFile(path.join(__dirname, "index/index.html"));
  !app.isPackaged && mainWindow.webContents.openDevTools({ mode: "detach" });
}

function createPageViews() {
  getConfig().pages.forEach((page, i) => {
    const view = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, "page-preload.js"),
      },
    });
    mainWindow.addBrowserView(view);
    view.webContents.loadURL(page.url);

    pageViews.push(view);

    globalShortcut.register(page.hotkey, async () => {
      if (page.copySelection) {
        await triggerCopy();
      }
      mainWindow.show();
      activatePage(null, i);
      notifyTabsChange();
      view.webContents.send("send-to-gpt", {
        autoSend: page.autoSend,
        text: page.prompt + (page.appendClipboard ? clipboard.readText() : ""),
      });
    });
  });
}

function updateMenu() {
  let defaultMenu = Menu.getApplicationMenu();
  let submenu = [];
  getConfig().pages.forEach((page, i) => {
    submenu.push(
      new MenuItem({
        label: page.title,
        accelerator: isMacOS ? `Cmd+${i + 1}` : `Ctrl+${i + 1}`,
        click: () => {
          activatePage(null, i);
          notifyTabsChange();
        },
      })
    );
  });
  let menu = new MenuItem({ label: "Tab", submenu: submenu });
  defaultMenu.append(menu);
  Menu.setApplicationMenu(defaultMenu);
}

function openConfigWindow() {
  settingsWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "config/config-preload.js"),
    },
  });
  settingsWindow.loadFile(path.join(__dirname, "config/config.html"));
}

function getConfig() {
  return CONFIG.get("config") ?? defaultConfig;
}

async function triggerCopy() {
  console.log("triggerCopy");
  clipboard.clear();
  for (let i = 0; i < 4; i++) {
    exec(
      `/usr/bin/osascript -e 'tell application "System Events" \n keystroke "c" using {command down} \n end tell'`,
      (error, stdout, stderr) => {
        error && console.error("copy error", error);
        stderr && console.error("copy error", stderr);
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("triggerCopy try ", i, clipboard.readText());
    if (clipboard.readText() !== "") {
      break;
    }
  }
}

function getPagesData() {
  console.log("getPagesData");
  return getConfig().pages;
}

function getCurrentPageIndex() {
  console.log("getCurrentPageIndex");
  return currentPageIndex;
}

function getConfigData() {
  console.log("getConfigData");
  return CONFIG.get("config");
}

function saveConfigData(event, data) {
  console.log("saveConfigData", data);
  CONFIG.set("config", data);
  app.relaunch();
  app.exit();
}

function activatePage(_params, pageIndex) {
  console.log("activatePage", currentPageIndex, pageIndex);
  if (currentPageIndex === pageIndex) {
    return;
  }
  currentPageIndex = pageIndex;

  let browserView = pageViews[pageIndex];
  mainWindow.setBrowserView(browserView);
  browserView.setBounds({
    x: 0,
    y: 36,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 36,
  });
  browserView.setAutoResize({
    width: true,
    height: true,
    horizontal: false,
    vertical: false,
  });
}

app.on("ready", () => {
  console.log("main.js", "ready");

  createWindow();
  updateMenu();
  createPageViews();
  activatePage(null, 0);

  regIpcHandles();

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });

  app.on("activate", () => {
    console.log("main.js", "activate");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  console.log("main.js", "window-all-closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function notifyTabsChange(_params) {
  mainWindow.webContents.send("tabsChange");
}

function regIpcHandles() {
  ipcMain.handle("getPagesData", getPagesData);
  ipcMain.handle("getCurrentPageIndex", getCurrentPageIndex);
  ipcMain.on("openConfigWindow", openConfigWindow);
  ipcMain.on("activatePage", activatePage);

  ipcMain.handle("getConfigData", getConfigData);
  ipcMain.on("saveConfigData", saveConfigData);
}
