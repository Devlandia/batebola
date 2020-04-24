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

/**
 * Clear the player deck and built it again.
 */
function refreshDeck(userId, player, deck){
  var fieldId = player == userId ? '#myDeck' : '#otherDeck'

  $(fieldId).html('');

  $.each(deck, function(id, data){
    var li    = $('<li>').addClass('collection-item avatar')

    li.append($('<span>').addClass('title').text(data.name))
    li.append($('<p>').text(data.position))

    if(data.ownBall){
      li.append('<span class="secondary-content"><i class="material-icons black-text">grade</i></a>')
    }

    $(fieldId).append(li);
  });
}

$(document).ready(function(){
  const socket = io();
  const userId = getOrCreateCookie();

  socket.emit('init game', userId);

  /**
   * Build the Deck
   * Update team field with all players
   * Show play button to currentUser and hide to opponent.
   */
  socket.on('refresh deck', function(currentPlayer, data){
    data = JSON.parse(data)

    $.each(data, function(player, value){
      // Fill input with my players
      if(player == userId){
        $('#team').val(JSON.stringify(value.team))
      }

      // enable play button to current user
      if(currentPlayer == userId){
        $('#play').show()
      }
      else{
        $('#play').hide()
      }

      refreshDeck(userId, player, value.team)
    });
  })
});
