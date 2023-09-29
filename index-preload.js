const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  //renderer -> main
  getPagesData: () => ipcRenderer.invoke("getPagesData"),
  getCurrentPageIndex:() => ipcRenderer.invoke("getCurrentPageIndex"),
  activatePage: (pageIndex) => ipcRenderer.send("activatePage", pageIndex),
  //main -> renderer
  onTabsChange: (callback) => ipcRenderer.on("tabs-change", callback),
});
