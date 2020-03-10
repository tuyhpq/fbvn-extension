
if (typeof jQuery !== 'undefined') {

  // Real Click
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

  // Real Hover
  jQuery.fn.extend({
    realHover: function() {
      const EVENTS = ["hover", "mouseover"];
      return this.each(function() {
        for (let event of EVENTS) {
          let e = new Event(event, { view: window, bubbles: true, cancelable: false });
          this.dispatchEvent(e);
        }
      });
    }
  });

  // Click Total Links
  jQuery.fn.extend({
    clickLinks: function() {
      return this.each(function() {
        this.click();
      });
    }
  });

}
