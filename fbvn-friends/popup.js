// Xử lý cơ bản
let currentTabId = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
});
