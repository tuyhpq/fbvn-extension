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
  }, 60000 * 5);
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

var oldUrl = null;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    var url = new URL(tab.url);
    var newUrl = url.origin + url.pathname;
    if (oldUrl !== newUrl) {
      oldUrl = newUrl;
      ExecuteJob();
    }
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
      'inb',
      'code',
      'free',
      'miễn phí',
      'uy tín',
      'link',
      'clip',
      'xoxo',
      'chấm',
      'dâm',
      'show',
      'tặng'
    ];
    const REJECTS = [
      'mua ac',
      'mua nick',
      'bán ac',
      'bán nick',
      'mua ib',
      'ai mua',
      'ai bán',
      'cần bán',
      'cần mua',
      'uy tín 100%',
      'miễn phí 100%',
      'kc miễn phí',
      'mua kim cương',
      'event tặng ac',
      'kim cương giá rẻ',
      'ai mua thì',
      'nhận quà',
      'nhận thẻ cào',
      'tặng thẻ cào',
      'bốc phốt',
      'dkm',
      'đkm',
      'dcm',
      'đcm',
      'đm',
      'dm',
      ' cc',
      'sủa',
      'cứt',
      'ngu',
      'địt mẹ',
      'lồn',
      'lozz',
      'óc chó',
      'súc vật',
      'lừa',
      'trẩu',
      'tuyển dụng',
      'kiếm tiền',
      'liên hệ',
      'zalo',
      'giá học sinh',
      'kiếm thẻ',
      'mình bán',
      'bán k',
      'bán code',
      'tặng code',
      'tặng k',
      'mua k',
      'nhận ki',
      'nhận th',
      'cần đổi',
      'đổi ac',
      'gdtg',
      'hack',
      'code',
      'link',
      'http',
      'minigame',
      'mini game',
    ];
    const APPROVES = [
      'tuyển thành viên',
      'tuyển tv',
      'ttv'
    ];

    const groups = [
      { id: "694039351025214", name: "Free Fire", blackList: BLACK_LIST, rejects: REJECTS, loop: 5, notApprovePost: true },
      // { id: "qv98vn", name: "Mua bán PUBG" }, đã bán
      { id: "298297000328148", name: "COD", blackList: BLACK_LIST, rejects: REJECTS },
      // { id: "360848434395577", name: "Hỗ trợ PUBG", approves: ['acc'] }, đã bán
      { id: "744092792625338", name: "Làm quen", blackList: BLACK_LIST, notApprovePost: true },
      // { id: "108807306468805", name: "LOT" }, đã bán 
      // { id: "486751422133880", name: "Hack FF" }, đã bị khóa
      // { id: "1129744734043345", name: "Ngắm Trai" }, đã bán
      { id: "3120470631310759", name: "Vitamin", notApprovePost: true },
      { id: "hahahahahihi", name: "Cà khịa", notApprovePost: true },
      // { id: "findbfwifehusbandgf", name: "Cung đấu" }, // đã bán
      // { id: "116039558551577", name: "Giang Hồ Chi Mộng" }, (group is removed)
      // { id: "106584670094311", name: "Chợ ăn Cần Thơ" }, đã bán 
      { id: "297521937365013", name: "Chợ Bến Tre" },
      // { id: "2621702094586454", name: "Đồ cũ Tuy Hòa" }, đã bán
      // { id: "346843986016861", name: "Tus buồn", blackList: BLACK_LIST }, đã bán
      // { id: "351563755753840", name: "Xe độ" }, // đã bán
      // { id: "498154793692114", name: "Buff sao Liên Quân" }, cho thuê
      { id: "191718824567616", name: "Liên quân confess", notApprovePost: true },
      // { id: "vltk2016", name: "ZSM" }, đã bán
      // { id: "danh.tuong.3q.vng", name: "Danh tướng" }, // đã bán
      // { id: "ccht.garena", name: "FF mua bán" }, cho thuê
      // { id: "1954247621454629", name: "FF cộng đồng" }, đã bán 
      // { id: "AxE.Alliance.Empire.VN", name: "Mua bán AxE" } đã bán
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
      chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/pending_posts/" }, () => {
        AddJob(() => {
          chrome.tabs.sendMessage(tabId, { command: "approvePendingPost", data: group });
          AddJob(() => {
            chrome.storage.local.get(null, function(result) {
              AddJob(() => {
                main();
              });

              if (!group.notMember && result.countRequestMember !== '' && result.countRequestMember !== '0') {
                AddJob(() => {
                  chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/member-requests/" }, () => {
                    AddJob(() => {
                      chrome.tabs.sendMessage(tabId, { command: "approvePendingMember" });
                    });
                  });
                });
              }

              if (result.countReported !== '' && result.countReported !== '0') {
                AddJob(() => {
                  chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/member_reported_content/" }, () => {
                    AddJob(() => {
                      chrome.tabs.sendMessage(tabId, { command: "removeReported" });
                    });
                  });
                });
              }

              if (result.countAlerted !== '' && result.countAlerted !== '0') {
                AddJob(() => {
                  chrome.tabs.update(tabId, { url: "https://www.facebook.com/groups/" + group.id + "/keyword_alerted_content/" }, () => {
                    AddJob(() => {
                      chrome.tabs.sendMessage(tabId, { command: "removeAlerted" });
                    });
                  });
                });
              }

              ExecuteJob();
            });
          });
        });
      });
    }
    main();
  },
  QuicklyModerateGroups(tabId) {
    async function main() {
      chrome.tabs.sendMessage(tabId, { command: "quicklyModerateGroups" });
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
  StoreRecentFriends(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "storeRecentFriends" });
  },
  InputRecentFriends(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "inputRecentFriends" });
  }
};
