import Common from './Common';

export default {
  approvePendingPost(data) {
    let loop = data.loop;
    async function main() {
      // escape route if suspended
      setTimeout(() => {
        chrome.storage.local.set({ countRequestMember: $(`#count_badge_requests`).text() }, () => {
          chrome.runtime.sendMessage({ command: "Next" });
        });
      }, 60000 * 2);

      await Common.sleep(2000);
      var articleList = $(`div[role="article"]`);

      for (let article of articleList) {
        Common.scrollToElement(article);
        await Common.sleep(500);

        var isNormalPost1 =
          // approve header
          $(article).find(`h5[data-ft='{"tn":"C"}'] span[class="fwb"]`).length === 0
          // approve body (post must be public)
          && $(article).find(`a[rel="noopener"]`).length === 0;

        // not share
        var isNormalPost2 = $(article).find('div.mts').length === 0;

        // not external link
        var isNormalPost3 = $(article).find('a[target="_blank"]').length === 0;

        // blacklist
        var hasBlackList = false;
        if (data.blackList) {
          var contents = $(article).find(`div[data-testid="post_message"]`).text();
          for (let text of data.blackList) {
            if (contents.toLocaleLowerCase().indexOf(text) > -1) {
              hasBlackList = true;
              break;
            }
          }
        }

        // rejects
        var hasReject = false;
        if (data.rejects) {
          var contents = $(article).find(`div[data-testid="post_message"]`).text();
          for (let text of data.rejects) {
            if (contents.toLocaleLowerCase().indexOf(text) > -1) {
              hasReject = true;
              break;
            }
          }
        }
        if ($(article).find(`div[data-testid="post_message"]`).text().trim().length < 2) {
          hasReject = true;
        }

        // approves
        var hasApproves = false;
        if (data.approves) {
          var contents = $(article).find(`div[data-testid="post_message"]`).text();
          for (let text of data.approves) {
            if (contents.toLocaleLowerCase().indexOf(text) > -1) {
              hasApproves = true;
              break;
            }
          }
        }

        if (isNormalPost1 && isNormalPost2 && isNormalPost3 && !hasReject) {
          if (!hasApproves && (data.notApprovePost || hasBlackList)) {
            $(article).remove();
            continue;
          } else {
            $(article).find(`div._idm`).find(`a[role="button"]`)[0].click(); // 0 is approve button
            console.log('Đã đồng ý.');
          }
        } else {
          $(article).find(`div._idm`).find(`a[role="button"]`)[1].click(); // 1 is reject button
          await Common.sleep(3000);
          $(`button[data-testid="delete_post_confirm_button"]`).click();
          console.log('Đã xóa!');
        }

        await Common.sleep(500);
        $(article).remove();
      }

      if (loop && --loop > 0) {
        Common.scrollToBottom();
        await Common.sleep(3000);
        main();
      } else {
        chrome.storage.local.set({ countRequestMember: $(`#count_badge_requests`).text() }, () => {
          chrome.runtime.sendMessage({ command: "Next" });
        });
      }

    }
    main();
  },
  quicklyModerateGroups() {
    const BLACK_LIST = [
      'kb',
      'add',
      'kết bạn',
      'ib',
      'code',
      'free',
      'miễn phí',
      'minigame',
      'mini game',
      'uy tín',
      'link',
      'clip',
      'xoxo',
      'chấm',
      'dâm',
      'show',
      'tặng'
    ];
    const REJECTS = [
      'mua ac',
      'mua nick',
      'bán ac',
      'bán nick',
      'mua ib',
      'ai mua',
      'ai bán',
      'cần bán',
      'cần mua',
      'uy tín 100%',
      'miễn phí 100%',
      'kc miễn phí',
      'mua kim cương',
      'event tặng ac',
      'kim cương giá rẻ',
      'ai mua thì',
      'nhận quà',
      'nhận thẻ cào',
      'tặng thẻ cào',
      'bốc phốt',
      'dkm',
      'đkm',
      'dcm',
      'đcm',
      'đm',
      'dm',
      'cc',
      'sủa',
      'cứt',
      'ngu',
      'địt mẹ',
      'lồn',
      'lozz',
      'óc chó',
      'súc vật',
      'lừa đảo',
      'trẩu',
      'tuyển dụng',
      'kiếm tiền',
      'liên hệ'
    ];
    const APPROVES = [
      'tuyển thành viên',
      'tuyển tv',
      'ttv'
    ];
    this.approvePendingPost({ blackList: BLACK_LIST, rejects: REJECTS, approves: APPROVES, loop: 999999 });
  },
  approvePendingMember() {
    async function main() {
      await Common.sleep(2000);
      Common.scrollToElement($('#member_requests_pagelet'));
      await Common.sleep(500);

      var approveButtonList = $('button[name="approve"][type="submit"]:visible');
      for (let approveButton of approveButtonList) {
        $(approveButton).click();
        await Common.sleep(1000);
      }
      await Common.sleep(1000);
      chrome.runtime.sendMessage({ command: "Next" });
    }
    main();
  }
};
