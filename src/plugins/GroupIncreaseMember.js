import Common from './Common';

export default {
  addFriends() {
    async function main() {

      // Open more pagers
      var uiMorePagers = $(`a.uiMorePagerPrimary:visible`);
      while (uiMorePagers.length > 0 && $(`button.FriendRequestAdd.addButton:visible`).length < 1000) {
        Common.scrollToElement(uiMorePagers[0]);
        await Common.sleep(1000);
        uiMorePagers.clickLinks();
        await Common.sleep(2000);
        uiMorePagers = $(`a.uiMorePagerPrimary:visible`);
      }

      var friends = $(`button.FriendRequestAdd.addButton:visible`);
      Common.addLog(`Friends found: ${friends.length}`);

      // Start add friends
      for (let i in friends) {
        let friendBtn = friends[i];
        Common.scrollToElement(friendBtn);
        await Common.sleep(1000);
        $(friendBtn).click();

        Common.addLog(`Done: ${parseInt(i) + 1}`);
        await Common.sleep(2000);

        $(`button.layerConfirm[type="submit"]:visible`).click(); // confirm add friend
        $(`a[action="cancel"][role="button"]:visible`).clickLinks();  // close 5.000 friends or warning dialog

        await Common.sleep(1000);
      }
    }
    main();
  },
};
