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

  $('#play').click(function(){
    socket.emit('play', userId);
  });

  $('#kick').click(function(){
    socket.emit('kick', userId);
  });

  /**
   * Build the Deck
   * Update team field with all players
   * Show play button to currentUser and hide to opponent.
   */
  socket.on('refresh deck', function(currentPlayer, allowPlay, allowKick, data){
    data = JSON.parse(data)

    $('#play').prop('disabled', true)
    $('#kick').prop('disabled', true)

    // enable play button to current user
    if(currentPlayer == userId){
      if(allowPlay){
        $('#play').prop('disabled', false)
      }

      if(data[currentPlayer].movements.length > 1 && allowKick){
        $('#kick').prop('disabled', false)
      }
    }

    $.each(data, function(player, value){

      refreshDeck(userId, player, value.team)
    });
  })

  socket.on('refresh score', function(score){
    score = JSON.parse(score)

    $.each(score, function(player, value){
      if(player == userId){
        $('#myScore').html(value)
      }
      else{
        $('#otherScore').html(value)
      }
    });
  })

  socket.on('message', function(msg){
    console.log(msg)
    //$('#messages').append($('<li>').text(msg))
  })
});
