const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  console.log("page", "DOMContentLoaded");

  ipcRenderer.on("send-to-gpt", (event, data) => {
    console.log("page", "send-to-gpt", data);
    const textarea = document.getElementById("prompt-textarea");

    if (textarea) {
      textarea.focus();
      textarea.value = (data.prompt ? data.prompt : "") + data.text;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      console.log("page", "send-to-gpt", "textarea not found");
    }

    if (data.autoSend) {
      const button = textarea?.nextSibling;
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });
});
