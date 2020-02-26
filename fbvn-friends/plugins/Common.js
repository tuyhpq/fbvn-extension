import ExtensionStorage from './ExtensionStorage';

// Extend jQuery
jQuery.fn.extend({
  realClick: function() {
    const EVENTS = ["focus", "mousedown", "mouseup", "click"];
    return this.each(function() {
      for (let event of EVENTS) {
        let e = new Event(event, { view: window, bubbles: true, cancelable: false });
        this.dispatchEvent(e);
      }
    });
  }
});

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
  clickTotalLinks(links) {
    for (let i = 0; i < links.length; i++) {
      links[i].click();
    }
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
  }
};
