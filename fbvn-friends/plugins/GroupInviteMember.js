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
            if ($(`#groupsMembershipAddUndoMessage`).text() !== `${friend.name} đã được mời vào nhóm.`) {
              console.log(`Error with: ${friend.name}`);
              return;
            }
            console.log(`${friend.name} has just been added successfully.`);
            await Common.sleep(1 * 60000);
            invitedCount++;
          }
        }

        friend.added = true;
        setFriendsStorage(friends);

        if (invitedCount >= 3) {
          await Common.sleep(3000);
          chrome.runtime.sendMessage({ command: "Next" });
        }
      }
    }
    getFriendsStorage((friends) => {
      main(friends);
    });
  }
};
