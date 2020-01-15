const JOB_LIST = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command == "Next") {
      let job = JOB_LIST.pop();
      job && job();
    } else if (request.command == "CensorGroup") {
      censorGroup(request.tabId)
    }
  }
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    let job = JOB_LIST.pop();
    job && job();
  }
});

var groups = [
  '2621702094586454',  // đồ cũ Tuy Hòa
  '498154793692114', // buff sao
  '191718824567616', // liên quân confess
  'vltk2016', // zsm
  'danh.tuong.3q.vng', // danh tướng
  'ccht.garena', // ff mua bán
  '1954247621454629' // ff garena
];
var id = 0;
var getId = function() {
  var val = id;
  if (++id >= groups.length) {
    id = 0;
  }
  return val;
}

function censorGroup(tabId) {
  let groupId = groups[getId()];
  chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + groupId + "/pending/" }, () => {
    JOB_LIST.push(() => {
      chrome.tabs.sendMessage(tabId, { command: "approvePendingPost" });
      JOB_LIST.push(() => {
        chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + groupId + "/requests/" }, () => {
          JOB_LIST.push(() => {
            chrome.tabs.sendMessage(tabId, { command: "approvePendingMember" });
            JOB_LIST.push(() => { censorGroup(tabId); });
          });
        });
      });
    });
  });
}

var removePosts = function(tabId) {
  chrome.tabs.sendMessage(tabId, { command: "removePosts" });

  setInterval(() => {
    chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/1954247621454629" }, () => {
      console.log("Goto " + "https://www.facebook.com/groups/1954247621454629");
      JOB_LIST.push(() => {
        console.log("Goto " + "https://www.facebook.com/groups/1954247621454629" + " successfully.");
        chrome.tabs.sendMessage(tabId, { command: "removePosts" });
      });
    });
  }, 60000);

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      var job = JOB_LIST.pop();
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
      JOB_LIST.push(() => {
        console.log("Goto " + "https://m.facebook.com/groups/1954247621454629" + " successfully.");
        chrome.tabs.sendMessage(tabId, { command: "removePostsMobile" });
      });
    });
  }, 60000);

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      var job = JOB_LIST.pop();
      if (job) {
        job();
      }
    }
  });
};

