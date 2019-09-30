// https://m.facebook.com/100009780511088/allactivity?entry_point=profile_shortcut&ref=bookmarks

var items = $("._56d4");
console.log(`Count: ${items.length}`);

var comments = [];

for (let item of items) {
  if ($(item).find(`span[data-sigil="expose"]`).length > 0) {
    comments.push($(item).find(`span[data-sigil="expose"]`)[0].textContent);
  } else if ($(item).find(`span`).length > 0) {
    comments.push($(item).find(`span`)[0].textContent);
  } else {
    console.log(item);
  }
}

console.log(comments);
console.log(JSON.stringify(comments));
