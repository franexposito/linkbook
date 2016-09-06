jQuery.validator.addMethod("userUsed", function(value, element) {
    var data = {"user":value};
    var response = false;
    $.ajax({
      type: 'POST',
      url: 'inc/checkUser.php',
      data: data,
      async: false,
      dataType:'json',
      success: function(resp){
        if (resp.result == "true") { response = false; }
        if (resp.result == "false") { response = true; }
      },
      error: function() {
        response = false;
      }
    });
    
    return response;
    
}, "El usuario ya se encuentra en el sistema.");

jQuery.validator.addMethod("emailUsed", function(value, element) {
    var data = {"email":value}; 
    var response = false;
    $.ajax({
      type: 'POST',
      url: 'inc/checkMail.php',
      data: data,
      async: false,
      dataType:'json',
      success: function(resp){
        if (resp.result == "true") { response = false; }
        if (resp.result == "false") { response = true; }
      },
      error: function() {
        response = false;
      }
    });

    return response;
}, "El email ya se encuentra en el sistema.");

$(document).on("ready",function(){
  $(".signup-h").on("click", function(evt){
    $("html,body").animate({ scrollTop : $("#signup").offset().top  }, 1200 );
    evt.preventDefault();
  });
  
  $(".ques").on("click", function(evt){
    $("html,body").animate({ scrollTop : $("#info1").offset().top  }, 1200 );
    evt.preventDefault();
  });
  
  $("#signup-form").validate({
    rules: {
      user: {
        required: true,
        userUsed: true
      },
      email: {
        required: true,
        email: true,
        emailUsed: true
      },
      pass1: {
        minlength: 6,
        maxlength: 14,
        required: true
      },
      pass2: {
        required: true,
        equalTo: "#pass1"
      }
    },
    messages: {
      user: {
        required: "Introduce un usuario"
      },
      email: {
        required: "Introduce tu email",
        email: "No es un formato de email válido"
      },
      pass1: {
        minlength: "La contraseña debe tener 6 caracteres como mínimo",
        maxlength: "La contraseña debe tener 14 caracteres como máximo",
        required: "Introduce una contraseña"
      },
      pass2: {
        required: "Repita la contraseña",
        equalTo: "Las contraseñas no coinciden"
      }
    },
    errorPlacement: function (error, element) {
      var mensaje = $(error).text();
      element.parent().next('.form-error').text(mensaje); 
    },
    success : function (label) {
      label.text('');
    },
    submitHandler: function(){
      var name = $("input#user").val();
      var email = $("input#email").val();
      var pass = $.md5($("input#pass1").val());
        
      var dataString = {'name':name,
                        'email':email,
                        'pass':pass};  
      $.ajax({
          type: "POST",
          url: "inc/signup.php",
          data: dataString,
          dataType: 'json',
          success: function(data) {
            if (data.result == 'true') {
              $('#signup-form').hide();
              $('.signup-section').append('<p class="p-form new">Gracias por registrarte. Ahora puedes <a href="login.html">iniciar sesión</a></p>');
            }
          },
          error : function(){
            alert('Se ha producido un error, intentelo de nuevo más tarde.')
          }
        });
        return false; 
    }
  });
});