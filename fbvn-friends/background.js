/* Xử lý cơ bản */

const JOBS_STACK = [];

function ExecuteJob() {
  let job = JOBS_STACK.pop();
  job && job();
}
function AddJob(job) {
  JOBS_STACK.push(job);
  setTimeout(() => {
    if (JOBS_STACK.indexOf(job) > -1) {
      ExecuteJob();
    }
  }, 60000 * 3);
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.command === "Next") {
      ExecuteJob();
    } else {
      FEATURE[message.command](message.tabId, message.data);
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
  AddFriendsAuto(tabId) {
    chrome.tabs.update(tabId, { url: "https://m.facebook.com/friends/center/suggestions/" }, () => {
      AddJob(() => {
        chrome.tabs.sendMessage(tabId, { command: "addFriendsAuto" });
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
    const BLACK_LIST = [
      'kb',
      'add',
      'kết bạn',
      'ib',
      'code',
      'free',
      'miễn phí',
      'minigame',
      'mini game',
      'uy tín',
      'link',
      'clip',
      'xoxo',
      'chấm',
      'dâm',
      'show'
    ];

    const groups = [
      { id: "298297000328148", name: "COD", notApprovePost: true },
      { id: "360848434395577", name: "Hỗ trợ PUBG", notApprovePost: true },
      { id: "694039351025214", name: "Free Fire", blackList: BLACK_LIST },
      { id: "744092792625338", name: "Làm quen", blackList: BLACK_LIST },
      { id: "108807306468805", name: "LOT" },
      // { id: "findbfwifehusbandgf", name: "Cung đấu" }, // đã bán
      // { id: "116039558551577", name: "Giang Hồ Chi Mộng" }, (group is removed)
      { id: "106584670094311", name: "Chợ ăn Cần Thơ" },
      { id: "2621702094586454", name: "Đồ cũ Tuy Hòa" },
      { id: "346843986016861", name: "Tus buồn", blackList: BLACK_LIST },
      // { id: "351563755753840", name: "Xe độ" }, // đã bán
      { id: "498154793692114", name: "Buff sao Liên Quân" },
      { id: "191718824567616", name: "Liên quân confess" },
      { id: "vltk2016", name: "ZSM" },
      // { id: "danh.tuong.3q.vng", name: "Danh tướng" }, // đã bán
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
      let group = groups[getIndex()];
      chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/pending/" }, () => {
        AddJob(() => {
          chrome.tabs.sendMessage(tabId, { command: "approvePendingPost", data: group });
          AddJob(() => {
            chrome.storage.local.get(null, function(result) {
              if (result.countRequestMember !== '' && result.countRequestMember !== '0') {
                chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/requests/" }, () => {
                  AddJob(() => {
                    chrome.tabs.sendMessage(tabId, { command: "approvePendingMember" });
                    AddJob(() => {
                      main();
                    });
                  });
                });
              } else {
                main();
              }
            });
          });
        });
      });
    }
    main();
  },
  UpdateFriendsRecent(tabId) {
    async function main() {
      chrome.tabs.sendMessage(tabId, { command: "storageFriendRecent" });
    }
    main();
  },
  MemberToGroupStatistics(tabId) {
    async function main() {
      chrome.tabs.sendMessage(tabId, { command: "memberToGroupStatistics" });
    }
    main();
  },
  MemberExtract20(tabId) {
    async function main() {
      chrome.tabs.sendMessage(tabId, { command: "memberExtract20" });
    }
    main();
  },
  MemberToGroup(tabId, data) {
    async function main() {
      chrome.tabs.update(tabId, { url: `https://www.facebook.com/groups/${data.groupId}/` }, () => {
        AddJob(() => {
          chrome.tabs.sendMessage(tabId, { command: "inviteMemberToGroup" });
          AddJob(() => {
            chrome.tabs.update(tabId, { url: "https://www.facebook.com/" }, () => {
              AddJob(() => {
                chrome.tabs.sendMessage(tabId, { command: "restOnHomePage" });
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
  },
  AddFriends(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "addFriends" });
  },
  AddFriendsFromGroup(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "addFriendsGroup" });
  },
};
