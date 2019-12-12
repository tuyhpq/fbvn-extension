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
  removePosts() {
    function main() {
      setTimeout(() => {
        $('div[class="mvm pam uiBoxGray _52jv"]').remove();
        var cancels = $('a.autofocus.layerCancel');
        clickAllButton(cancels);

        setTimeout(() => {
          var buttons = $('a[data-testid="post_chevron_button"]');
          clickAllButton(buttons);
          console.log("A: " + buttons.length);
          setTimeout(() => {
            var buttons = $('i[class="_41t7 img sp_66mIw9cKlB9 sx_5bb53b"]');
            clickAllButton(buttons);
            console.log("B: " + buttons.length);

            setTimeout(() => {
              var buttons = $('.uiOverlayFooterButtons button._4jy1[value="1"][type="submit"]');
              clickAllButton(buttons);
              console.log("C: " + buttons.length);
              setTimeout(() => {
                main();
              }, 5000);
            }, 4000);
          }, 2000);
        }, 2000);
      }, 1000);
    }

    $(function() {
      main();
    });
  },
  removePostsMobile() {
    function main() {
      setTimeout(() => {
        var buttons = $('.story_body_container:visible i[class="img sp_sJW2P2tLEpz sx_214509"]');
        clickAllButton(buttons);
        console.log("A1: " + buttons.length);
        setTimeout(() => {
          var buttons = $('.story_body_container:visible i[class="img sp_sJW2P2tLEpz sx_214509"]');
          clickAllButton(buttons);
          console.log("A2: " + buttons.length);

          setTimeout(() => {
            var buttons = $('a:visible[data-sigil="touchable touchable removeStoryButton enabled_action"]');
            clickAllButton(buttons);
            console.log("B: " + buttons.length);

            setTimeout(() => {
              var buttons = $('a:visible[title="Xóa"]');
              clickAllButton(buttons);
              console.log("C: " + buttons.length);
              setTimeout(() => {
                main();
              }, 4000);
            }, 3000);
          }, 3000);
        }, 2000);
      }, 1000);
    }
    $(function() {
      main();
    });
  }
}

var clickAllButton = function(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].click();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
