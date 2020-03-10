
import './plugins/Extends';
import Common from './plugins/Common';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  FEATURES[message.group][message.feature](message.data, sendResponse, sender);
});

const FEATURES = {
  Common
};