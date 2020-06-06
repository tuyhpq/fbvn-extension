export default {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  scrollToElement(element, deviation = 200, time = 500) {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(element).offset().top - deviation
    }, time);
  },
  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  },
  async clickTotalLinks(links) {
    for (let i = 0; i < links.length; i++) {
      links[i].click();
      await this.sleep(200);
    }
  }
};
