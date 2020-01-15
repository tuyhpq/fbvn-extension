import GroupModeration from './plugins/GroupModeration';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  var data = features[message.command]();
  sendResponse({ data });
});

var features = {
  getLikeButtonCount() {
    return $("._6a-y._3l2t._18vj").length;
  },
  cancelMakeFriendRequests() {
    function temporaryFunction() {
      let btnCancelList = $("._26vk._56bt");
      let btnCancel = null;
      for (let btn of btnCancelList) {
        if (btn.value === 'Hủy' && $(btn).is(":visible")) {
          btnCancel = btn;
          break;
        }
      }
      if (btnCancel !== null) {
        // scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);

        setTimeout(() => {
          btnCancel.click();
          temporaryFunction();
        }, 1000);
      }
    }
    temporaryFunction();
  },
  makeFriend() {
    const nameRegExp = /[àÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]+/;

    function temporaryFunction() {
      let btnObjectList = $('._55wp._7om2._5pxa');
      let friend = null;
      for (let obj of btnObjectList) {
        if (
          $(obj).is(":visible") &&
          $(obj).find("._26vk._56bu").is(":visible") &&
          $(obj).find("._26vk._56bu").val() === "Thêm bạn bè" &&
          nameRegExp.test($(obj).find("._52jh._5pxc a").html()) &&
          ($(obj).find(".notice.ellipsis").html().match(/([0-9]*) bạn chung*/) && parseInt($(obj).find(".notice.ellipsis").html().match(/([0-9]*) bạn chung/)[0]) >= 1)
        ) {
          let name = $(obj).find("._52jh._5pxc a").html();
          let mutualFriendsCount = parseInt($(obj).find(".notice.ellipsis").html().match(/([0-9]*) bạn chung/)[0]);

          if (friend === null) {
            friend = { name, mutualFriendsCount, btn: $(obj).find("._26vk._56bu") };
          } else {
            if (mutualFriendsCount > friend.mutualFriendsCount) {
              friend = { name, mutualFriendsCount, btn: $(obj).find("._26vk._56bu") };
            }
          }
        }
      }
      // scroll to bottom
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 3000);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 6000);

      setTimeout(() => {
        console.log(friend);
        if (friend && friend.btn) {
          friend.btn.click();
        }
        if ($("button[value='OK']").length > 0) {
          $("button[value='OK']").click();
        }
        temporaryFunction();
      }, 30000);
    }
    temporaryFunction();
  },
  approvePendingPost() {
    GroupModeration.approvePendingPost();
  },
  approvePendingMember() {
    GroupModeration.approvePendingMember();
  }
}
