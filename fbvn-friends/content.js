
import Common from './plugins/Common';

import FriendManagement from './plugins/FriendManagement';
import GroupModeration from './plugins/GroupModeration';
import GroupInviteMember from './plugins/GroupInviteMember';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Features[message.command]();
});

jQuery.fn.extend({
  realClick: function() {
    const EVENTS = ["focus", "mousedown", "mouseup", "click"];
    return this.each(function() {
      for (let event of EVENTS) {
        let e = new Event(event, { view: window, bubbles: true, cancelable: false });
        this.dispatchEvent(e);
      }
    });
  }
});

var Features = {
  addFriendsAuto() {
    FriendManagement.addFriendsAuto();
  },
  cancelFriendRequestsSent() {
    FriendManagement.cancelFriendRequestsSent();
  },
  approvePendingPost() {
    GroupModeration.approvePendingPost();
  },
  approvePendingMember() {
    GroupModeration.approvePendingMember();
  },
  storageFriendRecent() {
    GroupInviteMember.storageFriendRecent();
  },
  storageFriendRecent() {
    GroupInviteMember.storageFriendRecent();
  },
  memberToGroupStatistics() {
    GroupInviteMember.memberToGroupStatistics();
  },
  inviteMemberToGroup() {
    GroupInviteMember.inviteMemberToGroup();
  },
  addFriends() {
    GroupInviteMember.addFriends();
  },
  restOnHomePage() {
    async function main() {
      Common.scrollToBottom();
      await Common.sleep(2 * 60000);
      chrome.runtime.sendMessage({ command: "Next" });
    }
    main();
  }
}
