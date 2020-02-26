
export default {

  getField(key, next) {
    chrome.storage.local.get([key], (result) => {
      let value = result[key];
      let obj = !value ? {} : JSON.parse(value);

      if (next) {
        next(obj);
      }
    });
  },

  setField(key, obj, next) {
    chrome.storage.local.set({ [key]: JSON.stringify(obj) }, () => {
      if (next) {
        next(obj);
      }
    });
  }

};
