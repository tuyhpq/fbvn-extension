
import Common from './plugins/Common';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Features[message.command](message.data, sendResponse, sender);
});

var Features = {
  async addSuggestedFriends() {

    Common.scrollToBottom();
    await Common.sleep(3000);
    Common.scrollToBottom();
    await Common.sleep(3000);

    async function main() {
      let friendList = $(`div.friendBrowserCheckboxResults li.friendBrowserListUnit:visible`);
      let maxElement = null;
      let max = -1;

      for (let friend of friendList) {
        let presentation = $(friend).find(`table[role="presentation"]:visible`).text();
        let arr = presentation.match(/([0-9]*) bạn chung/);
        let commonFriends = 0;
        if (arr && arr.length > 0) {
          commonFriends = arr.pop();
        }
        if (commonFriends > max) {
          max = commonFriends;
          maxElement = friend;
        }
      }

      if (maxElement) {
        Common.scrollToElement(maxElement);
        await Common.sleep(1000);
        $(maxElement).find(`button.FriendRequestAdd.addButton:visible`).click();
        await Common.sleep(1000);

        let title = $(maxElement).find(`div.friendBrowserNameTitle`).text();
        Common.addLog(`${title} (${max} bạn chung)`);
      }

      await Common.sleep(1000);
      $(maxElement).remove();
      await Common.sleep(1000);
      main();
    }
    main();
  }
};
