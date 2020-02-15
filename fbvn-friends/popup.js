// Xử lý cơ bản
let currentTabId = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
});

/**
 * Quản lý Bạn Bè
 */

$("#btnAddFriends").click(() => {
  chrome.runtime.sendMessage({ command: "AddFriends", tabId: currentTabId });
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

$("#btnMemberToGroup").click(() => {
  chrome.runtime.sendMessage({ command: "MemberToGroup", tabId: currentTabId });
});
