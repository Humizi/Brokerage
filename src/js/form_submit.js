jQuery(document).on('submit', '#contactForm', function (e){
  e.preventDefault();
  
    var params = {
      name: jQuery('input[id=userName]').val(),
      email: jQuery('input[id=userEmail]').val(),
      message: jQuery('textarea[id=userMessage]').val()
    };
    
    $.ajax({ 
      url: "/wp-content/themes/brokerage/form.php",
      method: "POST",
      data: params,
      success: function(data) {
        $('.form').fadeOut(0);
        $('.request').fadeIn(0);
      },
      error: function(xhr, str) {
        alert("Возникла ошибка: " + xhr.responseCode);
    }
   });
});