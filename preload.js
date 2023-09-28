const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  console.log("preload.js", "DOMContentLoaded");

  ipcRenderer.on("send-to-gpt", (event, data) => {
    console.log("preload.js", "send-to-gpt", data);
    let textarea = document.getElementById("prompt-textarea");
    let button = textarea?.nextSibling;
    textarea?.value = data;
    textarea?.dispatchEvent(new Event("input", { bubbles: true }));
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
});
