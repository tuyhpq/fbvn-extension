
$(function() {

  chrome.storage.local.get(null, function(result) {
    var recentFriends = result.recentFriends ? JSON.parse(result.recentFriends) : [];
    $('#friendList').val(JSON.stringify(recentFriends, null, 4));
    $('#friends-count').text(recentFriends.length);
  });

  $('#updateFriendList').click(() => {
    var friends = JSON.parse($('#friendList').val() || '[]');
    chrome.storage.local.set({ recentFriends: JSON.stringify(friends) }, () => {
      window.location.reload();
    });
  });

});
