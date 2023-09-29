const {
  app,
  globalShortcut,
  BrowserWindow,
  BrowserView,
  clipboard,
  ipcMain,
} = require("electron");
const { exec } = require("child_process");
const Store = require("electron-store");
const path = require("path");

let CONFIG = new Store();
const isMacOS = process.platform === "darwin";

let mainWindow;
let currentActivePageIndex;
let pageViews = [];

let pageConfig = {
  pages: [
    {
      title: "👩‍🏫解释",
      url: "https://chat.openai.com/",
      hotkey: "alt+z",
      prompt: "请用简单的语言解释给我:\n",
      copySelection: true,
      appendClipboard: true,
      autoSend: true,
    },
    {
      title: "🔠翻译",
      url: "https://chat.openai.com/",
      hotkey: "alt+x",
      prompt: "作为一名专业的翻译，请准确地将文本在这英语和汉语之间翻译:\n",
      copySelection: true,
      appendClipboard: true,
      autoSend: true,
    },
    {
      title: "🛠️软件开发",
      url: "https://chat.openai.com/",
      hotkey: "alt+c",
      prompt: "你是一名优秀的软件工程师, 请按步骤给出答案.",
      copySelection: false,
      appendClipboard: false,
      autoSend: false,
    },
  ],
};

function createWindow() {
  console.log("createWindow");

  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "index-preload.js"),
    },
    titleBarStyle: isMacOS ? "hiddenInset" : "default",
  });
  mainWindow.setBounds(CONFIG.get("bounds"));

  mainWindow.on("close", () => {
    console.log("main.js", "mainWindow close");
    console.log(JSON.stringify(mainWindow.getBounds()));
    CONFIG.set("bounds", mainWindow.getBounds());
  });

  mainWindow.webContents.loadFile("index.html");
  mainWindow.webContents.openDevTools({ mode: "detach" });
}

function createPageViews() {
  pageConfig.pages.forEach((page, i) => {
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
      view.webContents.send("send-to-gpt", {
        autoSend: page.autoSend,
        text: page.prompt + (page.appendClipboard ? clipboard.readText() : ""),
      });
    });
  });
}

async function triggerCopy() {
  console.log("triggerCopy");
  clipboard.clear();
  for (let i = 0; i < 4; i++) {
    console.log("triggerCopy try", i);
    exec(
      `/usr/bin/osascript -e 'tell application "System Events" \n keystroke "c" using {command down} \n end tell'`,
      (error, stdout, stderr) => {
        error && console.error("copy error", error);
        stderr && console.error("copy error", stderr);
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (clipboard.readText() !== "") {
      break;
    }
  }
}

function getPagesData() {
  console.log("getPagesData");
  return pageConfig.pages;
}

function activatePage(_params, pageIndex) {
  console.log("activatePage", currentActivePageIndex, pageIndex);
  if (currentActivePageIndex === pageIndex) {
    return;
  }
  currentActivePageIndex = pageIndex;

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
  mainWindow.webContents.send("tabs-change", getTabData());
}

function regIpcHandles() {
  ipcMain.handle("getPagesData", getPagesData);
  ipcMain.on("activatePage", activatePage);
}
