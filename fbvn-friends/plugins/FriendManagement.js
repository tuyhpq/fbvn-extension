import Common from './Common';

export default {
  addFriendsAuto() {
    console.log("coming soon...");
  },
  cancelFriendRequestsSent() {
    async function main() {
      await Common.sleep(1000);
      let btnCancelList = $(`a[data-sigil="touchable check m-cancel-request"] button[type="submit"]:visible`);
      for (let btn of btnCancelList) {
        Common.scrollToElement(btn, undefined, 100);
        await Common.sleep(800);

        $(btn).click();
        await Common.sleep(400);

        Common.scrollToBottom();
      }
      if (btnCancelList.length !== 0) {
        main();
      }
    }
    main();
  }
};
