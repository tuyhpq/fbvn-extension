
import Common from './plugins/Common';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Features[message.command](message.data, sendResponse, sender);
});

var Features = {
};
