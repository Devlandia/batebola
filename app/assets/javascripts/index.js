function validateForm(formName){
  form = $(formName)

  if(form.is(':valid')){
    form.submit();
  }
}

$(document).ready(function(){
  $('.tabs').tabs();

  $('#arenaLinkCreate').click(function(){
    validateForm('#formCreateArena')
  });

  $('#arenaLinkJoin').click(function(){
    validateForm('#formJoinArena')
  });
});
