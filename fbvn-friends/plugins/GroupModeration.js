import Common from './Common';

export default {
  approvePendingPost(data) {
    async function main() {
      // escape route if suspended
      setTimeout(() => {
        chrome.runtime.sendMessage({ command: "Next" });
      }, 60000 * 2);

      await Common.sleep(1000);
      var articleList = $(`div[role="article"]`);

      for (let article of articleList) {
        Common.scrollToElement(article);
        await Common.sleep(800);

        var isNormalPost1 =
          // approve header
          $(article).find(`h5[data-ft='{"tn":"C"}'] span[class="fwb"]`).length === 0
          // approve body (post must be public)
          && $(article).find(`a[rel="noopener"]`).length === 0;

        // not share
        var isNormalPost2 = $(article).find('div.mts').length === 0;

        // not external link
        var isNormalPost3 = $(article).find('a[target="_blank"]').length === 0;

        if (isNormalPost1 && isNormalPost2 && isNormalPost3) {
          if (data.notApprovePost) {
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
      }

      chrome.runtime.sendMessage({ command: "Next" });
    }
    main();
  },
  approvePendingMember() {
    async function main() {
      await Common.sleep(1000);
      Common.scrollToElement($('#member_requests_pagelet'));
      await Common.sleep(1000);

      var approveButtonList = $('button[name="approve"][data-testid="approve_pending_member"]');
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
