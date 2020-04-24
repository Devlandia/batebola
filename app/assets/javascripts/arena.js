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

function refreshDeck(userId, player, deck){
  var fieldId = player == userId ? '#myDeck' : '#otherDeck'

  $(fieldId).html('');

  $.each(deck, function(id, data){
    element = $('<li>')
    element.addClass('collection-item')
    //element.text(`${data.name}: ${data.position}`)
    element.append($('<h6>').text(data.name))
    element.append($('<p>').text(data.position))

    $(fieldId).append(element);
  });
}

$(document).ready(function(){
  const socket = io();
  const userId = getOrCreateCookie();

  socket.emit('init game', userId);

  socket.on('refresh deck', function(data){
    data = JSON.parse(data)

    $.each(data, function(player, value){
      //console.log(values.team)
      refreshDeck(userId, player, value.team)
    });
  })
});
