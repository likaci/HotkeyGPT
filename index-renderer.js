let tabsContainer = document.querySelector("#tabs-container");


window.electronAPI.onTabsChange((event, pages) => {
  console.log("onTabsChange", event, pages);
  initTabs();
});

function onTabClick(tabIndex) {
  console.log("onTabClick", tabIndex);
  window.electronAPI.activatePage(tabIndex);
  initTabs();
}

async function initTabs() {
  console.log("initTabs");
  let pages = await window.electronAPI.getPagesData();
  let index = (await window.electronAPI.getCurrentPageIndex()) || 0;
  console.log("pages", pages);
  let tabs = pages
    .map((p, i) => {
      return `<li class="tab ${
        i === index ? "selected" : ""
      }" onclick="onTabClick(${i})">${p.title}</li>`;
    })
    .join("");
  console.log("tabs", tabs);
  tabsContainer.innerHTML = tabs;
}

function openConfigWindow() {
  window.electronAPI.openConfigWindow();
}

initTabs();
