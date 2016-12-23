$(document).ready(function(){
  
  $(".toggle-btn:not('.noscript') input[type=radio]").change(function() {
    if( $(this).attr("name") ) {
      $(this).parent().parent().addClass("selected").siblings().removeClass("selected");
    } else {
      $(this).parent().parent().toggleClass("selected");
    }
  });
  
  $(".cancel").click(function(){
    $(".pop-up").toggleClass("invisible");
    $(".blackout").toggleClass("invisible");
  });
  
});