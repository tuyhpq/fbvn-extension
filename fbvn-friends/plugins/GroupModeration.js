import Common from './Common';

export default {
  approvePendingPost(data) {
    let loop = data.loop;
    async function main(timeSleep = 5000) {
      // escape route if suspended
      setTimeout(() => {
        chrome.storage.local.set({
          countRequestMember: $(`a[href*="member-requests"] .sv5sfqaa`).text(),
          countReported: $(`a[href*="member_reported_content"] .sv5sfqaa`).text(),
          countAlerted: $(`a[href*="keyword_alerted_content"] .sv5sfqaa`).text()
        }, () => {
          chrome.runtime.sendMessage({ command: "Next" });
        });
      }, 60000 * 5);

      await Common.sleep(timeSleep);
      var articleList = $(`.sej5wr8e > .tr9rh885`);

      for (let article of articleList) {
        Common.scrollToElement(article);
        await Common.sleep(500);

        var contents = $(article).find(".tr9rh885")
        var content1 = $(contents[0]).find(`>div>div>div[dir="auto"]`);
        var content2 = $(contents[0]).find(`>div>div>div[class="l9j0dhe7"]`);

        // has title
        var isNormalPost1 = content1.length === 1;

        // has body
        var isNormalPost2 = content2.length === 1;

        // not external link
        var isNormalPost3 = $(article).find('a[target="_blank"]').length === 0;

        // enough time
        var enoughTime = false;
        var enoughTimeText = $(article).find('span.e9vueds3').text();
        if (enoughTimeText.includes('now')) {
          enoughTime = false;
        } else if (enoughTimeText.includes('min')) {
          var enoughTimeVal = enoughTimeText.match(/\s([0-9]*)\smin/).pop();
          enoughTime = enoughTimeVal > 20;
        } else if (enoughTimeText.length > 0) {
          enoughTime = true;
        }

        // blacklist
        var hasBlackList = false;
        if (data.blackList) {
          var contents = content1.text().normalize('NFC');
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
          var contents = content1.text().normalize('NFC');
          for (let text of data.rejects) {
            if (contents.toLocaleLowerCase().indexOf(text) > -1) {
              hasReject = true;
              break;
            }
          }
        }

        // approves
        var hasApproves = false;
        if (data.approves) {
          var contents = content1.text().normalize('NFC');
          for (let text of data.approves) {
            if (contents.toLocaleLowerCase().indexOf(text) > -1) {
              hasApproves = true;
              break;
            }
          }
        }

        // bad history
        if ($(article).find("div.muag1w35").length !== 0) {
          hasBlackList = true;
        }

        if (isNormalPost1 && isNormalPost2 && isNormalPost3 && !hasReject) {
          if (!hasApproves && (data.notApprovePost || hasBlackList || !enoughTime)) {
            $(article).remove();
            console.log('Đã giữ lại.');
            continue;
          } else {
            $(article).find(`div[aria-label="Approve"]`)[0] && $(article).find(`div[aria-label="Approve"]`)[0].click(); // approve button
            console.log('Đã đồng ý.');
          }
        } else {
          $(article).find(`div[aria-label="Decline"]`)[0] && $(article).find(`div[aria-label="Decline"]`)[0].click(); // reject button
          console.log('Đã xóa!');
        }

        await Common.sleep(500);
        $(article).remove();
      }

      if (loop && --loop > 0) {
        Common.scrollToBottom();
        main(2000);
      } else {
        chrome.storage.local.set({
          countRequestMember: $(`a[href*="member-requests"] .sv5sfqaa`).text(),
          countReported: $(`a[href*="member_reported_content"] .sv5sfqaa`).text(),
          countAlerted: $(`a[href*="keyword_alerted_content"] .sv5sfqaa`).text()
        }, () => {
          chrome.runtime.sendMessage({ command: "Next" });
        });
      }

    }
    main();
  },
  removeReported() {
    async function main() {
      await Common.sleep(3000);
      await Common.clickTotalLinks($(`div[aria-label="Delete"][role="button"][tabindex="0"]`));
      await Common.sleep(1000);
      chrome.runtime.sendMessage({ command: "Next" });
    }
    main();
  },
  removeAlerted() {
    async function main() {
      await Common.sleep(3000);
      await Common.clickTotalLinks($(`div[aria-label="Delete"][role="button"][tabindex="0"]`));
      await Common.sleep(1000);
      chrome.runtime.sendMessage({ command: "Next" });
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
      ' cc',
      'sủa',
      'cứt',
      'ngu',
      'địt mẹ',
      'lồn',
      'lozz',
      'óc chó',
      'súc vật',
      'lừa',
      'trẩu',
      'tuyển dụng',
      'kiếm tiền',
      'liên hệ',
      'zalo',
      'giá học sinh',
      'kiếm thẻ',
      'mình bán',
      'bán k',
      'bán code',
      'tặng code',
      'tặng k',
      'mua k',
      'nhận ki',
      'nhận th',
      'cần đổi',
      'đổi ac',
      'gdtg',
      'hack',
      'code',
      'link',
      'http',
      'minigame',
      'mini game',
    ];
    const APPROVES = [
      'tuyển thành viên',
      'tuyển tv',
      'ttv'
    ];
    this.approvePendingPost({ blackList: BLACK_LIST, rejects: REJECTS, loop: 999999, notApprovePost: true });
  },
  approvePendingMember() {
    async function main() {
      await Common.sleep(3000);
      await Common.clickTotalLinks($(`div[aria-label="Approve"][role="button"][tabindex="0"]`));
      await Common.sleep(1000);
      chrome.runtime.sendMessage({ command: "Next" });
    }
    main();
  }
};
