const {
  app,
  globalShortcut,
  BrowserWindow,
  BrowserView,
  clipboard,
} = require("electron");
const path = require("path");

let config = {
  pages: [
    {
      url: "https://chat.openai.com/",
      hotkey: "alt+z",
      prompt: "请用简单的语言解释给我:\n",
      autoSend: true,
    },
    {
      url: "https://chat.openai.com/",
      hotkey: "alt+x",
      prompt: "请把下面的句子中英互译, 并每句中英对照:\n",
      autoSend: true,
    },
    {
      url: "https://chat.openai.com/",
      hotkey: "alt+c",
      prompt: "你是一名优秀的软件工程师:\n",
      autoSend: false,
    },
  ],
};

let mainWindow;
let browserViews = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    // },
  });
}

function createPages() {
  config.pages.forEach((page) => {
    const browserView = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    mainWindow.setBrowserView(browserView);
    browserViews.push(browserView);
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
    browserView.webContents.loadURL(page.url);

    globalShortcut.register(page.hotkey, () => {
      mainWindow.show();
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
      browserView.webContents.send("send-to-gpt", {
        prompt: page.prompt,
        autoSend: page.autoSend,
        text: clipboard.readText(),
      });
    });
  });
}

app.on("ready", () => {
  console.log("main.js", "ready");
  createWindow();
  createPages();

  app.on("will-quit", () => {
    console.log("main.js", "will-quit");
    globalShortcut.unregisterAll();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
