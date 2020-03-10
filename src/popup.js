
import Common from './plugins/Common';

// Init ID of current tab
let currentTabId = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
});

// Handle logs
setInterval(() => {
  Common.getLogs((logs) => {
    $('#logsArea').val(logs);
  });
}, 500);

// Handle events
$('button').click((e) => {
  let group = $(e.target).attr("data-group");
  let feature = $(e.target).attr("data-feature");
  let data = {};
  $('input').each(function() {
    data[$(this).attr('id')] = $(this).val();
  });
  chrome.runtime.sendMessage({ tabId: currentTabId, group, feature, data });
});
