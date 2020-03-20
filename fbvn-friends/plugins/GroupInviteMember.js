import Common from './Common';

function setFriendsStorage(friends) {
  chrome.storage.local.set({ friends: JSON.stringify(friends) }, function() {
    console.log('Set Friends Storage');
    console.log(friends);
  });
}

function getFriendsStorage(next) {
  chrome.storage.local.get(null, function(result) {
    console.log('Get Friends Storage');
    let friends = result.friends;
    if (!friends) {
      friends = {};
    } else {
      friends = JSON.parse(friends);
    }
    console.log(friends);
    if (next) {
      next(friends);
    }
  });
}

export default {
  storageFriendRecent() {
    async function main() {
      getFriendsStorage((friends) => {
        var friendsRecent = $(`ul.uiList:visible li._698`);

        for (let friend of friendsRecent) {
          var main = $(friend).find(`div.uiProfileBlockContent div.fsl.fwb.fcb > a`);

          var id = main.attr("data-gt").match(/\"eng_tid\"\:\"([0-9]*)\"/).pop();
          var name = main.text();

          if (!friends[id]) {
            friends[id] = { id, name, added: false };
          }
        }
        setFriendsStorage(friends);
      });
    }
    main();
  },
  memberToGroupStatistics() {
    async function main() {
      getFriendsStorage((friends) => {
        var sum = Object.keys(friends).length;
        var invitedCount = 0;
        for (let i in friends) {
          if (friends[i].added) {
            invitedCount++;
          }
        }

        console.log(`Tổng: ${sum}`);
        console.log(`Đã xử lý: ${invitedCount}`);
        console.log(`Chưa xử lý: ${sum - invitedCount}`);
      });
    }
    main();
  },
  memberExtract20() {
    getFriendsStorage((friends) => {
      var n = 0;
      for (let id in friends) {
        let friend = friends[id];
        if (!friend.added) {
          console.log(friend.name);
          friend.added = true;
          n++;
        }
        if (n >= 20) {
          break;
        }
      }
      setFriendsStorage(friends);
    });
  },
  inviteMemberToGroup() {
    async function main(friends) {
      let input = $(`input[data-testid="GROUP_ADD_MEMBER_TYPEAHEAD_INPUT"]`);
      let invitedCount = 0;

      for (let id in friends) {
        let friend = friends[id];
        if (friend.added) {
          continue;
        }

        input.val(friend.name);
        input.realClick();

        await Common.sleep(5000);

        let area = $(`.uiContextualLayerPositioner:visible .uiContextualLayer:visible`);
        let targets = area.find(`li.user[title="${friend.name}"]`);

        if (targets.length === 0) {
          console.log(`${friend.name} is added.`);
        } else {
          let target = targets[0];
          $(target).realClick();
          console.log(`Invite ${friend.name}.`);

          await Common.sleep(5000);

          var errors = $(`div[data-testid="exception_dialog"]:visible`);
          if (errors.length > 0) {
            Common.clickTotalLinks(errors.find(`a[action="cancel"]`));
            console.log(`${friend.name} has already been invited.`);
          } else {
            if ($(`#groupsMembershipAddUndoMessage`).text() === "") {
              console.log(`Error with: ${friend.name}`);
              return;
            } else {
              console.log(`${friend.name} has just been added successfully.`);
              await Common.sleep(1 * 60000);
              invitedCount++;
            }
          }
        }

        friend.added = true;
        setFriendsStorage(friends);
        $("#groupsMembershipAddUndoMessage").remove();

        if (invitedCount >= 3) {
          await Common.sleep(1000);
          chrome.runtime.sendMessage({ command: "Next" });
          break;
        }
      }
    }
    getFriendsStorage((friends) => {
      main(friends);
    });
  },
  addFriends() {
    async function main() {
      var uiMorePagers = $(`a.uiMorePagerPrimary:visible`);
      while (uiMorePagers.length > 0 && $(`button.FriendRequestAdd.addButton:visible`).length < 1000) {
        Common.scrollToElement(uiMorePagers[0]);
        await Common.sleep(1000);
        Common.clickTotalLinks(uiMorePagers);
        await Common.sleep(2000);
        uiMorePagers = $(`a.uiMorePagerPrimary:visible`);
      }

      var friends = $(`button.FriendRequestAdd.addButton:visible`);
      console.log(`Friends found: ${friends.length}`);

      for (let i in friends) {
        var friend = friends[i];
        Common.scrollToElement(friend);
        await Common.sleep(1000);
        $(friend).click();

        console.log(`Sum: ${i}`);
        await Common.sleep(2000);

        var countErrors = 0;
        var Errors1 = $(`button.layerConfirm[type="submit"]:visible`); // confirm add friend
        if (Errors1.length > 0) {
          countErrors += Errors1.length;
          Errors1.click();
        }
        var Errors2 = $(`a[action="cancel"][role="button"]:visible`);  // 5.000 friends & warning
        if (Errors2.length > 0) {
          countErrors += Errors2.length;
          Common.clickTotalLinks(Errors2);
        }
        if (countErrors > 0) {
          console.log(`Errors: ${countErrors}`);
        }

        await Common.sleep(2000);
      }
    }
    main();
  },
  addFriendsGroup() {
    async function main() {
      var listFriends = $(`div#groupsMemberSection_recently_joined`).find(`div[data-name="GroupProfileGridItem"]`);

      for (let friend of listFriends) {
        Common.scrollToElement(friend);
        await Common.sleep(500);

        $(friend).find(`div._60ri a[rel="dialog"]`).realHover();
        await Common.sleep(2000);

        var areaOfFriend = $(`div.uiContextualLayer:visible`);
        areaOfFriend.find(`button.FriendRequestAdd.addButton[type="button"]:visible`).click();
        await Common.sleep(1000);

        $(`button.layerConfirm[type="submit"]:visible`).click(); // confirm add friend
        Common.clickTotalLinks($(`a[action="cancel"][role="button"]:visible`));  // 5.000 friends & warning
        await Common.sleep(1000);
      }
    }
    main();
  },
  storeRecentFriends() {
    async function main() {
      var friendsRecent = $(`ul.uiList:visible li._698`);
      var friends = [];

      for (let friend of friendsRecent) {
        var main = $(friend).find(`div.uiProfileBlockContent div.fsl.fwb.fcb > a`);

        var id = main.attr("data-gt").match(/\"eng_tid\"\:\"([0-9]*)\"/).pop();
        var name = main.text();
        var imgId = $(friend).find(`img[role="img"]`).attr(`src`).match(/0\/([a-z0-9_]*)\.jpg\?/).pop();
        if (!imgId) {
          console.log(`Có lỗi IMG !!!`);
          return;
        }

        friends.push({ id, name, imgId });
      }

      chrome.storage.local.set({ recentFriends: JSON.stringify(friends) }, () => {
        chrome.storage.local.get(null, function(result) {
          console.log(JSON.parse(result.recentFriends));
        });
      });
    }
    main();
  },
  inputRecentFriends() {
    async function main() {
      var input = $(`#groupMembersInput:visible`);

      chrome.storage.local.get(null, async (result) => {
        var recentFriends = JSON.parse(result.recentFriends);

        for (let friend of recentFriends) {
          input.val(friend.name);
          await Common.sleep(500);

          input.realClick();
          await Common.sleep(1000);

          let list = $(`div.uiContextualLayer`).find(`li.user[title="${friend.name}"]:visible`);
          console.log(list.length);
          for (let item of list) {
            let imgId = $(item).find(`img`).attr(`src`).match(/0\/([a-z0-9_]*)\.jpg\?/).pop();
            console.log(imgId, friend.imgId);
            if (imgId === friend.imgId) {
              console.log("Chuẩn bị click!");
              $(item).realClick();
              await Common.sleep(1000);
              break;
            }
            await Common.sleep(3000);
          }
        }
      });
    }
    main();
  }
};