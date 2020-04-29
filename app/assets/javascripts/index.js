function joinArena(){
  form = $('#formJoinArena')

  if(form.is(':valid')){
    form.submit();
  }
}

function createArena(){
  form = $('#formCreateArena')

  if(form.is(':valid')){
    form.submit();
  }
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
