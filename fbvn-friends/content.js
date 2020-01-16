import FriendManagement from './plugins/FriendManagement';
import GroupModeration from './plugins/GroupModeration';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Features[message.command]();
});

var Features = {
  addFriends() {
    FriendManagement.addFriends();
  },
  cancelFriendRequestsSent() {
    FriendManagement.cancelFriendRequestsSent();
  },
  approvePendingPost() {
    GroupModeration.approvePendingPost();
  },
  approvePendingMember() {
    GroupModeration.approvePendingMember();
  }
}
