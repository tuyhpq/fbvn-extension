
import Common from './plugins/Common';

// Init ID of current tab
let currentTabId = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
});

setInterval(() => {
  Common.getLogs((logs) => {
    $(`#logsArea`).val(logs);
  });
}, 500);

$(`#addSuggestedFriends`).click(() => {
  chrome.tabs.sendMessage(currentTabId, { command: `addSuggestedFriends` });
});
