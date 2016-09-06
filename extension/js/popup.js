var authGlobal;
var user;

$(document).ready(function(){
  $('body').on('click', 'a', function(){
    if ( $(this).hasClass('bye') ) {
      if (localStorage.zasdfvslinkbookudsdfeu) { localStorage.removeItem("zasdfvslinkbookudsdfeu"); }
      if (localStorage.zasdfvslinkbookudsdfea) { localStorage.removeItem("zasdfvslinkbookudsdfea"); }
      changeDisplay2();
    }
    else if( !$(this).hasClass('delete') ) {
      chrome.tabs.create({url: $(this).attr('href')});  
    }
    else {
      var id = $(this).data('id');
      var success = deleteClip(id);
      if (success == true) {
        $(this).parent().fadeOut();
      }
    }
    return false;
  });
  
  if (localStorage.zasdfvslinkbookudsdfeu && localStorage.zasdfvslinkbookudsdfea){
    user = localStorage.zasdfvslinkbookudsdfeu;
    var auth = localStorage.zasdfvslinkbookudsdfea;
    var success = checkUserAuth(user, auth);
    if( success == true ){
      changeDisplay();
      loadLinks(user);  
    }
  }
  
  $('.sub').on('click', function (evt) {
    evt.preventDefault();
    var user = $('#user').val();
    var pass = $('#pass1').val();
    
    if (user == "" && pass == "") { $('.wrong').text('Introduce datos en el formulario').show(); }
    else if (user == "") { $('.wrong').text('Introduce un usuario').show(); }
    else if (pass == "") { $('.wrong').text('Introduce una contraseña').show(); }
    else {
      $('.wrong').text('').hide();
      pass = $.md5(pass);
      var success = checkUser(user, pass);
      if ( success == true ) {
        localStorage.zasdfvslinkbookudsdfeu = user;
        localStorage.zasdfvslinkbookudsdfea = authGlobal;
        changeDisplay();
        loadLinks(user);
      } 
      else {
        $('.wrong').text('Usuario o contraseña inexistente').show(); 
        $('#pass1').val('');
      }
    }
    
  });
  
  
  $('#send').on('click', function(evt) {
    evt.preventDefault();
    var expression = /^(http:\/\/|https:\/\/)?((([\w-]+\.)+[\w-]+)|localhost)(\/[\w- .\/?%&=]*)?/i; 
    var url = $('#url').val();
    
    if (url == '') { $(".msg").text('Introduzca una url').show(); }
    else if (!expression.test(url)) { $(".msg").text('La url introducida no es válida').show(); }
    else {
      $(".msg").text('').hide();
      sendLink(url);
    }
  });
});

function loadLinks(user) {
  var date = new Date();
  var ahora = date.format("yyyy-mm-dd HH:MM:ss");
  var hoy00 = date.format("yyyy-mm-dd 00:00:00");
  date.setDate(date.getDate() - 1);
  var ayer00 = date.format("yyyy-mm-dd 00:00:00");

  var conn = "http://linkbook.mobi/linkbook/inc/getClips.php";

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.result == false) { alert('error'); }
          if (resp.result == true) { 
            var hoy = resp.hoy;
            $.each(hoy, function(index, key) {
              var urlHref = haveHttp(hoy[index].url);
              var urlShort = shortUrl(hoy[index].url);
              var clip = '<article class="url-load"><a class="ref" href="'+urlHref+'">'+urlShort+'</a><a data-id="'+hoy[index].id+'" class="delete" href="#" style="float:right">x</a></article>';
            $('.hoy').append(clip);
            });
            var ayer = resp.ayer;
            $.each(ayer, function(index, key) {
              var urlHref = haveHttp(ayer[index].url);
              var urlShort = shortUrl(ayer[index].url);
              var clip = '<article class="url-load"><a class="ref" href="'+urlHref+'">'+urlShort+'</a><a data-id="'+ayer[index].id+'" class="delete" href="#" style="float:right">x</a></article>';
            $('.ayer').append(clip);
            });
            var anteriores = resp.anteriores;
            $.each(anteriores, function(index, key) {
              var urlHref = haveHttp(anteriores[index].url);
              var urlShort = shortUrl(anteriores[index].url);
              var clip = '<article class="url-load"><a class="ref" href="'+urlHref+'">'+urlShort+'</a><a data-id="'+anteriores[index].id+'" class="delete" href="#" style="float:right">x</a></article>';
            $('.antes').append(clip);
            });
        }
        else {
          $('.enlaces-section').css('display', 'none');
          $('.error').css('display', 'block');  
        }
      }
    }
  }
  xhr.open("POST", conn, true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&ahora="+ahora+"&hoy00="+hoy00+"&ayer00="+ayer00+"");
}

function checkUserAuth(user, auth) {
  var conn = "http://linkbook.mobi/linkbook/inc/checkAuth.php";
  var final = false;
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          final = resp.result;
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&auth="+auth+"");
  
  return final;
}

function checkUser(user, pass) {
  var conn = "http://linkbook.mobi/linkbook/inc/login2.php";
  var final = false;
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          final = resp.result;
          authGlobal = resp.auth;
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&pass="+pass+"");
  
  return final;
}

function sendLink(url) {
  var date = new Date();
  var ahora = date.format("yyyy-mm-dd HH:MM:ss");
  var source = 'web';
  
  var conn = "http://linkbook.mobi/linkbook/inc/addUrl2.php";
  var data = JSON.stringify({'user':user, "date":ahora, "url":url, "source":source});
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.result == true ) {
            var urlHref = haveHttp(url);
            var urlShort = shortUrl(url);
            var clip = '<article class="url-load new"><a class="ref" href="'+urlHref+'">'+urlShort+'</a><a data-id="'+resp.id+'" class="delete" href="#" style="float:right">x</a></article>'; 
            $('.hoy').prepend(clip).fadeIn();
            $('#url').val('');
          }
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(data);
}

function deleteClip(id) {
  var conn = "http://linkbook.mobi/linkbook/inc/deleteClip2.php";
  var final = false;
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          final = resp.result;
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&id="+id+"");
  
  return final;
}

function haveHttp (url) {
  var url2 = url;
  if ((url.toLowerCase().indexOf("http://") < 0) && (url.toLowerCase().indexOf("https://") < 0)) { url2 = 'http://' + url; }
  return url2;
}

function shortUrl (url) {
  var url2 = url;
  if (url.length > 45) { url2 = url.substr(0, 45) + '...'; }
  return url2;
}

function changeDisplay() {
  $('.login').css('display', 'none');
  $('.pie').css('display', 'none');
  $('.main').css('display', 'block');
  $('.header').css('display', 'block');
  $("#url").focus();
}

function changeDisplay2() {
  $('.login').css('display', 'block');
  $('.pie').css('display', 'block');
  $('.main').css('display', 'none');
  $('.header').css('display', 'none');
}