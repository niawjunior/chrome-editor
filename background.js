chrome.runtime.onMessage.addListener((request) => {
  // Check if the message contains the checkbox value
  if (request.type === "autoRunCheckboxValue") {
    // Store the checkbox value in the Chrome extension storage
    chrome.storage.local.set({
      autoRunCheckboxValue: request.value,
    });
  }
});

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
      url: `${chrome.runtime.getURL(
        "editor.html"
      )}?content=${encodeURIComponent(
        info.selectionText
      )}&site=${encodeURIComponent(url.url)}`,
    });
  }
});
