// Listen popup.js
chrome.runtime.onMessage.addListener(
  function(message) {
    if (FEATURES[message.group] && FEATURES[message.group][message.feature]) {
      FEATURES[message.group][message.feature](message.tabId, message.data);
    } else {
      chrome.tabs.sendMessage(message.tabId, message);
    }
  }
);

const FEATURES = {
  // nothing
};
