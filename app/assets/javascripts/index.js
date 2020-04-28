function replaceLinkHref(){
  arenaId = new Date().getTime();
  element = $('#arenaLink');
  href    = element.attr('href').replace(':id', arenaId);

  element.attr('href', href)
}

$(document).ready(function(){
  replaceLinkHref()
});
