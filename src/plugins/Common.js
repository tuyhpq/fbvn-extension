import ExtensionStorage from './ExtensionStorage';

export default {

  test() {
    this.addLog("Test!!!");
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  scrollToElement(element, deviation = 200, time = 500, addClass = true) {
    if (addClass) {
      $(element).addClass("bg-focus");
    }
    $([document.documentElement, document.body]).animate({
      scrollTop: $(element).offset().top - deviation
    }, time);
  },

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  },

  getLogs(next) {
    ExtensionStorage.getField(`logs`, (obj) => {
      next(obj.data || "");
    })
  },

  addLog(log) {
    this.getLogs((logs) => {
      logs += log + '\n';
      ExtensionStorage.setField(`logs`, { data: logs });
    });
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
