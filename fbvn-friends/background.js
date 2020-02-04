/* Xử lý cơ bản */

const JOBS_STACK = [];

function ExecuteJob() {
  let job = JOBS_STACK.pop();
  job && job();
}
function AddJob(job) {
  JOBS_STACK.push(job);
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.command === "Next") {
      ExecuteJob();
    } else {
      FEATURE[message.command](message.tabId);
    }
  }
);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    ExecuteJob();
  }
});

/* Tính năng */

const FEATURE = {
  /**
   * Tự động kết bạn
   */
  AddFriends(tabId) {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/friends/center/suggestions/" }, () => {
      AddJob(() => {
        chrome.tabs.sendMessage(tabId, { command: "addFriends" });
      });
    });
  },
  /**
  * Hủy lời mời kết bạn đã gửi
  */
  CancelFriendRequestsSent(tabId) {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/friends/center/requests/outgoing/" }, () => {
      AddJob(() => {
        chrome.tabs.sendMessage(tabId, { command: "cancelFriendRequestsSent" });
      });
    });
  },
  /**
   * Duyệt bài và thành viên
   */
  BasicModerateGroups(tabId) {
    const groups = [
      { id: "744092792625338", name: "Làm quen" },
      { id: "108807306468805", name: "LOT" },
      { id: "106584670094311", name: "Chợ ăn Cần Thơ" },
      { id: "2621702094586454", name: "Đồ cũ Tuy Hòa" },
      { id: "346843986016861", name: "Tus buồn" },
      { id: "351563755753840", name: "Xe độ" },
      { id: "498154793692114", name: "Buff sao Liên Quân" },
      { id: "191718824567616", name: "Liên quân confess" },
      { id: "vltk2016", name: "ZSM" },
      { id: "danh.tuong.3q.vng", name: "Danh tướng" },
      { id: "ccht.garena", name: "FF mua bán" },
      { id: "1954247621454629", name: "FF cộng đồng" },
      { id: "AxE.Alliance.Empire.VN", name: "Mua bán AxE" }
    ];
    let id = 0;
    let getIndex = function() {
      let val = id;
      if (++id >= groups.length) {
        id = 0;
      }
      return val;
    }
    async function main() {
      let groupId = groups[getIndex()].id;
      chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + groupId + "/pending/" }, () => {
        AddJob(() => {
          chrome.tabs.sendMessage(tabId, { command: "approvePendingPost" });
          AddJob(() => {
            chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + groupId + "/requests/" }, () => {
              AddJob(() => {
                chrome.tabs.sendMessage(tabId, { command: "approvePendingMember" });
                AddJob(() => {
                  main();
                });
              });
            });
          });
        });
      });
    }
    main();
  }
};
