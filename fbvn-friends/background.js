var stackJobs = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "removePosts") {
      removePosts(request.tabId)
    } else if (request.msg == "removePostsMobile") {
      removePostsMobile(request.tabId);
    };
  }
);

var removePosts = function(tabId) {
  chrome.tabs.sendMessage(tabId, { command: "removePosts" });

  setInterval(() => {
    chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/1954247621454629" }, () => {
      console.log("Goto " + "https://www.facebook.com/groups/1954247621454629");
      stackJobs.push(() => {
        console.log("Goto " + "https://www.facebook.com/groups/1954247621454629" + " successfully.");
        chrome.tabs.sendMessage(tabId, { command: "removePosts" });
      });
    });
  }, 60000);

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      var job = stackJobs.pop();
      if (job) {
        job();
      }
    }
  });
};

var removePostsMobile = function(tabId) {
  chrome.tabs.sendMessage(tabId, { command: "removePostsMobile" });

  setInterval(() => {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/groups/1954247621454629" }, () => {
      console.log("Goto " + "https://m.facebook.com/groups/1954247621454629");
      stackJobs.push(() => {
        console.log("Goto " + "https://m.facebook.com/groups/1954247621454629" + " successfully.");
        chrome.tabs.sendMessage(tabId, { command: "removePostsMobile" });
      });
    });
  }, 60000);

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      var job = stackJobs.pop();
      if (job) {
        job();
      }
    }
  });
};

