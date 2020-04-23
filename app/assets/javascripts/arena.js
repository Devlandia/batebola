/**
 * Get userId from cookies or create a brand new userId and store on cookies.
 */
function getOrCreateCookie(){
  var cookie = JSON.parse(document.cookie || '{}')

  if(cookie.userId){
    return cookie.userId;
  }
  else{
    var userId      = new Date().getTime();
    document.cookie = JSON.stringify({ userId: userId })

    return userId;
  }
}

function refreshDeck(player, userId, deck){
  var fieldId = player == userId ? '#myDeck' : '#otherDeck'

  $(fieldId).html(deck)
  console.log(JSON.parse(deck))
}

$(document).ready(function(){
  const socket = io();
  const userId = getOrCreateCookie();

  socket.emit('init game', userId);

  socket.on('refresh deck', function(player, deck){
    refreshDeck(player, userId, deck)
  })
});
