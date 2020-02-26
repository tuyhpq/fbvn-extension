// Xử lý cơ bản
let currentTabId = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
});

/**
 * Quản lý Bạn Bè
 */

$("#btnAddFriendsAuto").click(() => {
  chrome.runtime.sendMessage({ command: "AddFriendsAuto", tabId: currentTabId });
});

$("#btnCancelFriendRequestsSent").click(() => {
  chrome.runtime.sendMessage({ command: "CancelFriendRequestsSent", tabId: currentTabId });
});

/**
 * Quản lý Nhóm
 */

$("#btnBasicModerateGroups").click(() => {
  chrome.runtime.sendMessage({ command: "BasicModerateGroups", tabId: currentTabId });
});

/**
 * Thêm Bạn Bè vào Nhóm
 */

$("#btnUpdateFriendsRecent").click(() => {
  chrome.runtime.sendMessage({ command: "UpdateFriendsRecent", tabId: currentTabId });
});

$("#btnMemberToGroupStatistics").click(() => {
  chrome.runtime.sendMessage({ command: "MemberToGroupStatistics", tabId: currentTabId });
});

$("#btnMemberExtract20").click(() => {
  chrome.runtime.sendMessage({ command: "MemberExtract20", tabId: currentTabId });
});

$(function() {
  chrome.storage.local.get(null, function(result) {
    if (result.groupId) {
      $("#groupId").val(result.groupId);
    }
  });
});

$("#btnMemberToGroup").click(() => {
  var data = {
    groupId: $("#groupId").val()
  };
  chrome.storage.local.set({ groupId: data.groupId });
  chrome.runtime.sendMessage({ command: "MemberToGroup", tabId: currentTabId, data });
});

$("#btnAddFriends").click(() => {
  chrome.runtime.sendMessage({ command: "AddFriends", tabId: currentTabId });
});
