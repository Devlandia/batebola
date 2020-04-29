
function joinArena(){
  var field   = $('#arenaId');
  var arenaId = field.val().trim();

  if(field.is(':valid')){
    location.href = `arena/${arenaId}`;
  }
}

function createArena(){
  var arenaId = new Date().getTime();

 location.href = `arena/${arenaId}`;
}

$(document).ready(function(){
  $('.tabs').tabs();

  $('#arenaLinkCreate').click(function(){
    createArena();
  });

  $('#arenaLinkJoin').click(function(){
    joinArena();
  });

  $('#arenaId').keyup(function(){
    var attr = !$(this).is(':valid')

    $('#arenaLinkJoin').attr('disabled', attr);
  });
});
