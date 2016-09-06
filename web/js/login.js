$(document).ready(function(){
  $('#login_form').validate({
    rules: {
      user: {
        required: true
      },
      pass1: {
        required: true
      }
    },
      messages: {
        user: {
          required: "Introduce un usuario"
        },
        pass1: {
          required: "Introduce una contraseña"
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
      var pass = $.md5($("input#pass1").val());
      var cookie = $("input#cookie").is(":checked");
      var dataString = {"user":name,
                       "pass":pass};  

      $.ajax({
        type: "POST",
        url: "inc/login3.php",
        data: dataString,
        dataType: 'json',
        success: function(data) {
          if(data.result == "true"){ 
            localStorage.zasdfvslinkbookudsdfeuws = name;
            localStorage.zasdfvslinkbookudsdfeaws = data.auth;
            window.location.replace("profile");
          }
          if(data.result == "false"){
            $('.login-error').text('');
            $('.login-error').text('Usuario o contraseña incorrecta');
            $(':input', '#login_form').val('');
          }
        },
        error : function(){
          alert('Se ha producido un error. Inténtelo más tarde');
        }
      });
      return false;  
    }  
    });
});