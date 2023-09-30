const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  //renderer -> main
  getConfigData: () => ipcRenderer.invoke("getConfigData"),
  saveConfigData: (data) => ipcRenderer.send("saveConfigData", data),
  //main -> renderer
});
