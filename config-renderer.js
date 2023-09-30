const textArea = document.getElementById("jsonTextArea");
document.getElementById("saveButton").addEventListener("click", () => {
  try {
    let jsonData = JSON.parse(textArea.value);
    window.electronAPI.saveConfigData(jsonData);
  } catch (error) {
    alert("invalid JSON data");
  }
});

async function initConfigData() {
  let data = await window.electronAPI.getConfigData();
  textArea.value = JSON.stringify(data, null, 2);
}

initConfigData();
