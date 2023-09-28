const { app, globalShortcut, BrowserWindow, clipboard } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("https://chat.openai.com/");
}

app.on("ready", () => {
  console.log("main.js", "ready");
  createWindow();

  globalShortcut.register("CMD+G", () => {
    mainWindow.show();
    mainWindow.webContents.send("send-to-gpt", clipboard.readText());
  });

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
