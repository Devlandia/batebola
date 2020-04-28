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
 * If userId is the same of player, mount deck as mine. Else, as other.
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

function arenaId(){
  return $('#arenaId').val();
}

$(document).ready(function(){
  const socket    = io();
  const userId    = getOrCreateCookie();
  const userName  = 'User Name';

  socket.emit('join game', arenaId(), userId, userName);

  /**
   * Build the Deck
   * Update team field with all players
   * Show play button to currentUser and hide to opponent.
   */
  socket.on('refresh deck', function(arena){
    arena = JSON.parse(arena)

    if(arena.id != arenaId()){
      return;
    }

    $('#play').prop('disabled', true)
    $('#kick').prop('disabled', true)

    // refresh deck and handle buttons play and kick
    $.each(arena.players, function(playerId, player){
      nameField = (playerId == userId) ? '#myName' : '#otherName'
      $(nameField).html(player.name)

      refreshDeck(userId, playerId, player.team)

      if(player.id == userId && player.allowPass && arena.started){
        $('#play').prop('disabled', false)
      }

      if(player.id == userId && player.allowKick){
        $('#kick').prop('disabled', false)
      }
    });

    // handle finished matches
    if(arena.finished){
      $('#actionButtons').hide();
      $('#finishedMatch').show();
    }

    // refresh scoreboard
    $.each(arena.score, function(playerId, value){
      if(playerId == userId){
        $('#myScore').html(value)
      }
      else{
        $('#otherScore').html(value)
        res = (arena.winner == userId) ? 'won' : 'lose'
        $('#matchResult').html(res)
      }
    });
  })

  /**
   * Send play signal.
   */
  $('#play').click(function(){
    socket.emit('play', arenaId(), userId);
  });

  /**
   * Send kick signal
   */
  $('#kick').click(function(){
    socket.emit('kick', arenaId(), userId);
  });

  socket.on('message', function(arena, msg){
    if(arena != arenaId()){
      return;
    }

    $('#messages').append($('<li>').text(msg))
  })

  socket.on('fatal error', function(msg){
    console.log('fatal error: ', msg);
  });
});
