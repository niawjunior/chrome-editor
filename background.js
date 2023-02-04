async function getTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return tab;
}

chrome.contextMenus.create({
  id: "editor-menu",
  title: "Chrome Editor",
  contexts: ["selection"],
});

function getSelection() {
  console.log(chrome.windows);
}
chrome.contextMenus.onClicked.addListener(async function (info) {
  if (info.menuItemId === "editor-menu") {
    let url = await getTab();
    chrome.tabs.create({
      url: `${chrome.runtime.getURL("editor.html")}?site=${encodeURIComponent(
        url.url
      )}&content=${encodeURIComponent(info.selectionText)}`,
    });
  }
});
