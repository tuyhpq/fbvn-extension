// https://m.facebook.com/hcm.hcm.290195/friends

var items = $("._55wp._7om2._5pxa");
console.log(`Count: ${items.length}`);

var friends = {};

for (let item of items) {
  var nameElement = $(item).find("._52jh._5pxc a")[0];
  var name = $(nameElement).text();

  var ids = $(item).prop('outerHTML').match(/\&quot\;id\&quot\;\:([0-9]*)\,/);

  // focus if error
  if (ids === null || ids.length < 2 || !name) {
    $('html, body').animate({ scrollTop: $(item).offset().top }, 'slow');
    console.log(item);
  }

  var id = ids[1];

  friends[id] = name;
}

console.log(friends);
console.log(JSON.stringify(friends));

function getImageUrl(id) {
  return `http://graph.facebook.com/${id}/picture?type=large`;
}
