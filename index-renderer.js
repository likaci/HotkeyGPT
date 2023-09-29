let tabsContainer = document.querySelector("#tabs-container");

window.electronAPI.onTabsChange((event, pages) => {
  console.log("onTabsChange", event, pages);
});

function onTabClick(tabIndex) {
  console.log("onTabClick", tabIndex);
  window.electronAPI.activatePage(tabIndex);
}

async function initTabs() {
  console.log("initTabs");
  let pages = await window.electronAPI.getPagesData();
  console.log("pages", pages);
  let tabs = pages
    .map((p, i) => {
      return `<li class="tab" onclick="onTabClick(${i})">${p.title}</li>`;
    })
    .join("");
  console.log("tabs", tabs);
  tabsContainer.innerHTML = tabs;
}

initTabs();
