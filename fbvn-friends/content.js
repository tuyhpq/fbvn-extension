
import Common from './plugins/Common';

import FriendManagement from './plugins/FriendManagement';
import GroupModeration from './plugins/GroupModeration';
import GroupInviteMember from './plugins/GroupInviteMember';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Features[message.command](message.data);
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

jQuery.fn.extend({
  realHover: function() {
    const EVENTS = ["hover", "mouseover"];
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
  approvePendingPost(data) {
    GroupModeration.approvePendingPost(data);
  },
  approvePendingMember() {
    GroupModeration.approvePendingMember();
  },
  quicklyModerateGroups() {
    GroupModeration.quicklyModerateGroups();
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
  memberExtract20() {
    GroupInviteMember.memberExtract20();
  },
  inviteMemberToGroup() {
    GroupInviteMember.inviteMemberToGroup();
  },
  addFriends() {
    GroupInviteMember.addFriends();
  },
  addFriendsGroup() {
    GroupInviteMember.addFriendsGroup();
  },
  storeRecentFriends() {
    GroupInviteMember.storeRecentFriends();
  },
  inputRecentFriends() {
    GroupInviteMember.inputRecentFriends();
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
