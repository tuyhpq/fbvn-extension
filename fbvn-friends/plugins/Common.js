export default {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  scrollToElement(element, deviation = 80) {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(element).offset().top - deviation
    }, 500);
  },
  clickTotalLinks(links) {
    for (let i = 0; i < links.length; i++) {
      links[i].click();
    }
  }
};
