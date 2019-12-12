var tabId = null;
var stackJobs = [];

// Get id of current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  tabId = tabs[0].id;
});

// Run a job in stack
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    var job = stackJobs.pop();
    if (job) {
      job();
    }
  }
});

$(function() {
  // Go make friend requests page
  $("#btnGotoCancelMakeFriendRequestsPage").click(() => {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/friends/center/requests/outgoing/" }, () => {
      console.log("Goto " + "https://m.facebook.com/friends/center/requests/outgoing/");
    });
  });

  // Execute cancel make friend requests
  $("#btnExecuteCancelMakeFriendRequests").click(() => {
    chrome.tabs.sendMessage(tabId, { command: "cancelMakeFriendRequests" }, () => {
      console.log("Execute cancel make friend requests successfully.");
    });
  });

  // Go make friend page
  $("#btnGotoMakeFriendPage").click(() => {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/friends/center/suggestions/?mff_nav=1&fb_ref=swpsa" }, () => {
      console.log("Goto " + "https://m.facebook.com/friends/center/suggestions/?mff_nav=1&fb_ref=swpsa");
    });
  });

  // Execute make friend
  $("#btnExecuteMakeFriend").click(() => {
    chrome.tabs.sendMessage(tabId, { command: "makeFriend" }, () => {
      console.log("Execute make friend successfully.");
    });
  });

  // Remove all posts in group
  $("#btnRemovePosts").click(() => {
    chrome.runtime.sendMessage({ msg: "removePosts", tabId: tabId });
  });

  // Remove all posts in group
  $("#btnRemovePostsMobile").click(() => {
    chrome.runtime.sendMessage({ msg: "removePostsMobile", tabId: tabId });
  });
});
